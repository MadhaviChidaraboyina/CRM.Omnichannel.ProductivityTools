param (
    [Parameter(Mandatory=$true, HelpMessage="List of folder paths to generate CVRP devided by semicolon.")]
    [string] $paths,

    [Parameter(Mandatory=$true, HelpMessage="Root of the drop.")]
    [string] $dropRoot,

    [Parameter(Mandatory=$true, HelpMessage="Path to CVRP to be generated.")]
    [string] $outCvrpPath,

    [Parameter(Mandatory=$false, HelpMessage="Timeout in seconds. Default value is 1800 seconds.")]
    [string] $timeoutInSeconds = 30 * 60,

    [Parameter(Mandatory=$false, HelpMessage="Flag that indicates whether to include all files in the drop root non recursive to CVRP.")]
    [switch] $includeAllFilesInDropRootNonRecursive
)

$ErrorActionPreference = "Stop"

#
# Copy from sd GIT\Buildtracker\CmdModules\bin\psm1\ParallelTasks.psm1.
#
function Run-ParallelTasks
{
    param(
        [Parameter(Mandatory=$true)]
        [scriptblock] $ScriptBlock,

        [Parameter(Mandatory=$true)]
        [object[]]    $Objects,

        [hashtable]   $Parameters = @{},

        [Parameter(Mandatory=$true)]
        [int]         $TimeoutInSeconds,

        [int]         $ThrottleLimit = 20
    )

    $ErrorActionPreference = "Stop"

    Write-Host "Starting the job... Timeout for the job is set to $TimeoutInSeconds seconds."

    $Jobs = @()

    $RunspacePool = [runspacefactory]::CreateRunspacePool(1,$ThrottleLimit)
    $RunspacePool.Open()

    $Objects | % {
        $Job = [powershell]::Create().AddScript($ScriptBlock).AddArgument($_).AddParameters($Parameters)

        $Job.RunspacePool = $RunspacePool
        $Jobs += New-Object PSObject -Property @{
            Pipe = $Job
            Result = $Job.BeginInvoke()
        }
    }

    $timer = [Diagnostics.Stopwatch]::StartNew()
    $progressCounter = 0
    do
    {
        Start-Sleep -Seconds 1
        $progressCounter++

        if ( ($progressCounter % 30) -eq 0)
        {
            Write-Host "The job is in progress..."
        }

        if ($timer.Elapsed.TotalSeconds -gt $TimeoutInSeconds)
        {
            throw "ERROR: Timeout exceeded while awaiting the task to complete. Timeout: $TimeoutInSeconds seconds."
        }
    }
    while ($Jobs.Result.IsCompleted -contains $false)

    $Outputs = @()

    $Jobs | % {
        $Outputs += $_.Pipe.EndInvoke($_.Result)
    }

    return $Outputs
}
#
#
#

function Get-CompositionItems
{
    param (
        [Parameter(Mandatory=$true)]
        [System.IO.FileInfo[][]] $files,

        [Parameter(Mandatory=$true)]
        [string] $prefixSize = 0,

        [Parameter(Mandatory=$true)]
        [string] $hashType,

        [Parameter(Mandatory=$true)]
        [string] $timeoutInSeconds
    )

    $scriptBlock = {
        param (
            [Parameter(Mandatory=$true)]
            [System.IO.FileInfo[]] $paths,

            [Parameter(Mandatory=$false)]
            [string] $prefixSize = 0,

            [Parameter(Mandatory=$true)]
            [string] $hashType
        )

        $hashes = New-Object "System.Collections.ArrayList"

        $paths | % { 
            $hash   = (Get-FileHash -LiteralPath $_.FullName -Algorithm $hashType).Hash
            $path   = $_.FullName.Remove(0, $prefixSize).Replace('\','/')
            $source = $path.Replace('\','/')

            $null = $hashes.Add(@{Paths = @($path); Source = $source; Hash = $hash})
        }

        return $hashes
    }

    return Run-ParallelTasks -ScriptBlock $scriptBlock -Objects $files -Parameters @{PrefixSize = $prefixSize; HashType = $hashType} -TimeoutInSeconds $timeoutInSeconds -ThrottleLimit $Env:NUMBER_OF_PROCESSORS
}

# main

$DEDUP_BATCH_SIZE = 500
# Default hash algorithm in CloudVault is SHA256
$HASH_ALGORITHM = 'SHA256'
$MAX_DEPTH_OF_CVRP_JSON = 3

try
{
    if ([string]::IsNullOrWhitespace($paths))
    {
        throw "ERROR: Folders to generate CVRP are not defined."
    }

    Write-Host "Generating CVRP: $outCvrpPath. Folders: $paths..."

    $scriptPath = $PSScriptRoot
    $generateCatalogScript = Join-Path -Path $scriptPath -ChildPath "GenerateCatalog.ps1"
    if (-not (Test-Path $generateCatalogScript))
    {
        throw "ERROR: Script to generate catalog file for CVRP could not be found: $generateCatalogScript."
    }

    $dropRoot = (Resolve-Path -Path $dropRoot | Convert-Path)

    $pathArray = $paths -Split ";"
    $filesRaw = @()
    foreach ($path in $pathArray)
    {
        $path = Resolve-Path -Path $path
        $path = Convert-Path -Path $path

        if (-not (Test-Path -Path $path))
        {
            throw "ERROR: Provided folder path does not exist: $path"
        }

        Write-Host "Collecting all files in folder: $path..."
        $filesRaw += [System.IO.Directory]::GetFiles($path, "*.*", "AllDirectories")
    }

    if ($includeAllFilesInDropRootNonRecursive)
    {
        Write-Host "Adding all files from drop root '$dropRoot' non recursively because '-includeAllFilesInDropRootNonRecursive' flag was specified."
        $filesRaw += [System.IO.Directory]::GetFiles($dropRoot, "*.*")
    }

    $filesRawCount = $filesRaw.Count
    Write-Host "Total files collected: $($filesRawCount)."

    $files = @()
    for ($i = 0; $i -lt $filesRawCount; $i += ($DEDUP_BATCH_SIZE + 1))
    {
        $endRange = $i + $DEDUP_BATCH_SIZE
        if($endRange -gt $filesRawCount-1)
        {
            $endRange = $filesRawCount -1
        }
        $files += ,@($filesRaw[$i..$endRange])
    }

    Write-Host "Getting composition items..."
    $compositionItems = Get-CompositionItems -Files $files -PrefixSize ($dropRoot.TrimEnd('\').Length + 1) -HashType $HASH_ALGORITHM -timeoutInSeconds $timeoutInSeconds

    Write-Host "Merging composition items with same hash but different paths..."
    $hashAndSourcePaths = @{}
    foreach ($compositionItem in $compositionItems)
    {
        if ($hashAndSourcePaths.ContainsKey($compositionItem.Hash))
        {
            $hashAndSourcePaths[$compositionItem.Hash].Paths += $compositionItem.Paths
        }
        else
        {
            $sourceAndPaths = @{ 
                                    Paths = @($compositionItem.Paths)
                                    Source = $compositionItem.Source 
                               }

            $hashAndSourcePaths.Add($compositionItem.Hash, $sourceAndPaths)
        }
    }
    $compositionItemsMerged = @()
    foreach ($compositionItem in $hashAndSourcePaths.GetEnumerator())
    {
        $compositionItemsMerged += @{
                                        Paths = @($compositionItem.Value.Paths | Sort-Object -Unique)
                                        Source = $compositionItem.Value.Source
                                        Hash = $compositionItem.Key
                                    }
    }

    Write-Host "Adding CVRP itself..."
    $cvrpRelPath = $outCvrpPath.Replace('\','/') -ireplace [regex]::Escape($dropRoot.Replace('\','/')), [string]::Empty
    $cvrpRelPath = $cvrpRelPath.TrimStart('/')
    $compositionItemsMerged += @{
                                    Paths = @($cvrpRelPath)
                                    Source = $cvrpRelPath
                                    Hash = [string]::Empty
                                }

    Write-Host "Adding catalog file to CVRP..."
    $catRelPath = [IO.Path]::ChangeExtension($cvrpRelPath, "cat")
    $compositionItemsMerged += @{
                                    Paths = @($catRelPath)
                                    Source = $catRelPath
                                    Hash = [string]::Empty
                                }

    # Composing CVRP content
    $cvrpContent = @{ 
        HashType = "$($HASH_ALGORITHM)Hash"
        Files = @($compositionItemsMerged | Sort-Object { $_.Hash })
    }

    if((($cvrpContent.Files[0].Source -eq $cvrpRelPath) -or ($cvrpContent.Files[1].Source -eq $cvrpRelPath)) -and `
    (($cvrpContent.Files[0].Source -eq $catRelPath) -or ($cvrpContent.Files[1].Source -eq $catRelPath)))
    {
        $cvrpContent.Files[0].Remove('Hash')
        $cvrpContent.Files[1].Remove('Hash')
    }

    $outCvrpDir = Split-Path -Path $outCvrpPath -Parent
    if (-not (Test-Path $outCvrpDir))
    {
        Write-Host "CVRP folder does not exist. Creating $outCvrpDir..."
        $null = New-Item -Path $outCvrpDir -Type Directory -Force
    }

    Write-Host "Generating CVRP..."
    $cvrpContent | ConvertTo-Json -Depth $MAX_DEPTH_OF_CVRP_JSON | Set-Content -Path $outCvrpPath -Force
    if (-not (Test-Path $outCvrpPath))
    {
        throw "ERROR: Failed to generate CVRP: $outCvrpPath"
    }
    Write-Host "CVRP has been generated: $outCvrpPath."

    $cvrpFileNameWithoutExtension = [IO.Path]::GetFileNameWithoutExtension($outCvrpPath)
    $catFileName = "$cvrpFileNameWithoutExtension.cat"
    $catPath = Join-Path -Path $outCvrpDir -ChildPath $catFileName
    Write-Host "Generate catalog file for CVRP: $catPath..."
    & $generateCatalogScript -inputPath $outCvrpPath -catalogPath $catPath
    if (-not (Test-Path $catPath))
    {
        throw "ERROR: Failed to generate catalog file: $catPath."
    }
    Write-Host "Catalog file has been generated: $catPath."

    Write-Host "CVRP and catalog file have been succesfully generated."
}
catch [exception]
{
  $_.Exception | Format-List -force

  exit 1
}

exit 0
