#
# This script converts the manifest to the CloudVault replication plan.
#

param ([parameter(HelpMessage="Full path to the the manifest file.")]
       [string]$manifest,

       [parameter(HelpMessage="Path to CloudVault replication plan file that this script generates.")]
       [string]$cvrpPath,

       [parameter(HelpMessage="Drop folder path of the CloudVault replication plan file.")]
       [string]$cvrpDropFolderPath,

       [parameter(HelpMessage="Local output folder path.")]
       [string]$localOutputRoot,

       [parameter(HelpMessage="Release output folder path.")]
       [string]$releaseOutputRoot,

       [parameter(HelpMessage="If set - input manifest is a Build manifest, otherwise BCDT manifest.")]
       [switch]$buildManifest = $false
)

function ConvertBcdtManifestToCvrp
{
    param ([ValidateNotNullOrEmpty()]
           [string] $bcdtManifest,

           [ValidateNotNullOrEmpty()]
           [string] $cvrpPath,

           [ValidateNotNullOrEmpty()]
           [string]$cvrpDropFolderPath,

           [ValidateNotNullOrEmpty()]
           [string] $localOutputRoot,

           [ValidateNotNullOrEmpty()]
           [string] $releaseOutputRoot
    )

    if ([string]::IsNullOrWhitespace($bcdtManifest))
    {
        throw "ERROR: No BCDT Manifests were found. CVRP will not be generated."
    }

    if (-not (Test-Path -Path $bcdtManifest))
    {
        throw "ERROR: BCDT Manifest does not exist: $bcdtManifest. CVRP will not be generated for $bcdtManifest."
    }

    [xml]$xmlManifest = Get-Content -Encoding UTF8 $bcdtManifest
    if ($xmlManifest -eq $null)
    {
        throw "ERROR: Failed to load: $bcdtManifest. CVRP will not be generated for $bcdtManifest."
    }

    if ($xmlManifest.Project.ItemGroup.CompositionItems -eq $null)
    {
        throw "ERROR: No composition items were found in the BCDT manifest: $bcdtManifest. CVRP will not be generated for $bcdtManifest."
    }

    $firstCompositionItem = @($xmlManifest.Project.ItemGroup.CompositionItems)  | Select -First 1
    if ($firstCompositionItem -eq $null)
    {
        throw "ERROR: No composition items were found in the BCDT manifest: $bcdtManifest. CVRP will not be generated for $bcdtManifest."
    }
    $hashAlgorithm = Get-HashAlgorithm -compositionItem $firstCompositionItem
    $hashType = Get-HashType -hashAlgorithm $hashAlgorithm

    $hashAndSourcePaths = @{}
    foreach ($compositionItem in $xmlManifest.Project.ItemGroup.CompositionItems)
    {
        $fileName = [String]::Empty
        if ($compositionItem.Rename)
        {
            $fileName = $compositionItem.Rename
        }
        else
        {
            $fileName = $compositionItem.Include
        }

        if ([string]::IsNullOrWhitespace($fileName))
        {
            Write-Host "Composition item does not have Include or Rename parameters: $compositionItem.SourceFilePath. BCDT manifest: $bcdtManifest."
            continue
        }

        $newPath = $fileName
        if ($compositionItem.CompositionOutputPath)
        {
            $newPath = Join-Path -Path $compositionItem.CompositionOutputPath -ChildPath $fileName
        }

        $newPathFlipSlash = $newPath -ireplace "\\", "/"
        $newPathFlipSlash = $newPathFlipSlash.TrimStart('/')

        $hash = $compositionItem.$hashType
        if ([string]::IsNullOrWhitespace($hash))
        {
            throw "ERROR: Failed to get hash $hashType from $compositionItem."
        }

        if ($hashAndSourcePaths.ContainsKey($hash))
        {
            $hashAndSourcePaths[$hash].Paths += $newPathFlipSlash
        }
        else
        {
            $sourceRelPath = $compositionItem.SourceFilePath -ireplace [regex]::Escape($releaseOutputRoot), [String]::Empty -ireplace "\\", "/"
            $sourceRelPath = $sourceRelPath.TrimStart('/')

            $sourceAndPaths = New-Object PSObject -Property @{
                                  Paths = @($newPathFlipSlash)
                                  Source = $sourceRelPath
                              }

            $hashAndSourcePaths.Add($hash, $sourceAndPaths)
        }
    }

    $compositionItems = @()
    foreach ($compositionItem in $hashAndSourcePaths.GetEnumerator())
    {
        $compositionItems += New-Object PSObject -Property @{
                                 Paths = @($compositionItem.Value.Paths | Sort-Object -Unique)
                                 Source = $compositionItem.Value.Source
                                 Hash = $compositionItem.Key
                             }
    }

    $compositionItems = AddCvrpAndCatalogToCvrp -compositionItems $compositionItems -cvrpPath $cvrpPath -cvrpDropFolderPath $cvrpDropFolderPath -localOutputRoot $localOutputRoot

    $cvrpItems = @(New-Object PSObject -Property @{
                      Files = @($compositionItems | Sort-Object { $_.Source })
                      HashType = $hashType
                  })

    $cvrpItems | ConvertTo-Json -Depth $global:maxDepthOfCvrpJson | Out-File -Encoding UTF8 -FilePath $cvrpPath
}

function ConvertBuildManifestToCvrp
{
    param ([ValidateNotNullOrEmpty()]
           [string] $buildManifest,

           [ValidateNotNullOrEmpty()]
           [string] $cvrpPath,

           [ValidateNotNullOrEmpty()]
           [string]$cvrpDropFolderPath,

           [ValidateNotNullOrEmpty()]
           [string] $localOutputRoot,

           [ValidateNotNullOrEmpty()]
           [string] $releaseOutputRoot,

           [ValidateNotNullOrEmpty()]
           [string] $hashAlgorithm = "SHA256"
    )

    if ([string]::IsNullOrWhitespace($buildManifest))
    {
        throw "ERROR: No build Manifests were found. CVRP will not be generated."
    }

    if (-not (Test-Path -Path $buildManifest))
    {
        throw "ERROR: Build Manifest does not exist: $buildManifest. CVRP will not be generated for $buildManifest."
    }

    [xml]$xmlManifest = Get-Content -Encoding UTF8 $buildManifest
    if ($xmlManifest -eq $null)
    {
        throw "ERROR: Failed to load: $buildManifest. CVRP will not be generated for $buildManifest."
    }

    if ($xmlManifest.manifest.files.file -eq $null)
    {
        throw "ERROR: No files were found in the build manifest: $buildManifest. CVRP will not be generated for $buildManifest."
    }

    $hashType = Get-HashType -hashAlgorithm $hashAlgorithm

    $files = @()
    foreach ($compositionItem in $xmlManifest.manifest.files.file)
    {
        $files += $compositionItem.path -ireplace "\\", "/"
    }

    $compositionItems = @()
    foreach ($file in $files)
    {
        $fullFilePath = Join-Path -Path $releaseOutputRoot -ChildPath $file
        if (Test-Path -Path $fullFilePath)
        {
            $compositionItems += New-Object PSObject -Property @{
                                     Paths = @($file)
                                     Source = $file
                                     Hash = (Get-FileHash $fullFilePath -Algorithm $hashAlgorithm).Hash
                                 }
        }
    }

    $compositionItems = AddCvrpAndCatalogToCvrp -compositionItems $compositionItems -cvrpPath $cvrpPath -cvrpDropFolderPath $cvrpDropFolderPath -localOutputRoot $localOutputRoot

    $cvrpItems = @(New-Object PSObject -Property @{
                      Files = @($compositionItems | Sort-Object { $_.Source })
                      HashType = $hashType
                  })

    $cvrpItems | ConvertTo-Json -Depth $global:maxDepthOfCvrpJson | Out-File -Encoding UTF8 -FilePath $cvrpPath
}

function AddCvrpAndCatalogToCvrp
{
    param ([object[]] $compositionItems,

           [ValidateNotNullOrEmpty()]
           [string] $cvrpPath,

           [ValidateNotNullOrEmpty()]
           [string] $cvrpDropFolderPath,

           [ValidateNotNullOrEmpty()]
           [string] $localOutputRoot
    )

    if (-not (Test-Path -Path $cvrpDropFolderPath))
    {
        $null = New-Item -ItemType Directory -Force -Path $cvrpDropFolderPath
    }

    $cvrpDropFolderPathResolved = Convert-Path -Path $cvrpDropFolderPath
    $cvrpDropFolderPathResolved = $cvrpDropFolderPathResolved.Replace('\', '/')

    $localOutputRootResolved = Convert-Path -Path $localOutputRoot
    $localOutputRootResolved = $localOutputRootResolved.Replace('\', '/')

    if (-not $cvrpDropFolderPathResolved.StartsWith($localOutputRootResolved))
    {
        throw "ERROR: Local output root is not part of the CVRP drop path. CVRP will not be generated."
    }

    $fileNameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($cvrpPath)

    $cvrpDropFolderRelPath = $cvrpDropFolderPathResolved -ireplace [regex]::Escape($localOutputRootResolved), ""
    if ($cvrpDropFolderRelPath)
    {
        $source = Join-Path -Path $cvrpDropFolderRelPath -ChildPath $fileNameWithoutExtension
        $source = $source.Replace('\', '/')
        $source = $source.TrimStart('/')
    }
    else
    {
        $source = $fileNameWithoutExtension
    }

    # Adding CVRP itself
    $compositionItems += New-Object PSObject -Property @{
                             Paths = @("$source.cvrp")
                             Source = "$source.cvrp"
                         }

    #Adding catalog
    $compositionItems += New-Object PSObject -Property @{
                             Paths = @("$source.cat")
                             Source = "$source.cat"
                         }

    return $compositionItems
}

function Get-HashAlgorithm
{
    param ([ValidateNotNullOrEmpty()]
           [object] $compositionItem
    )

    if (-not [string]::IsNullOrWhitespace($compositionItem.SHA1Hash))
    {
        return "SHA1"
    }
    elseif (-not [string]::IsNullOrWhitespace($compositionItem.SHA256Hash))
    {
        return "SHA256"
    }
    elseif (-not [string]::IsNullOrWhitespace($compositionItem.SHA512Hash))
    {
        return "SHA512"
    }

    throw "ERROR: Failed to get hash from composition item: $($compositionItem | Format-List -Force | Out-String)."
}

function Get-HashType
{
    param ([ValidateNotNullOrEmpty()]
           [object] $hashAlgorithm
    )

    return "$($hashAlgorithm)Hash"
}

#main
$ErrorActionPreference = "Stop"

$global:maxDepthOfCvrpJson = 3

try
{
    if ($buildManifest)
    {
        ConvertBuildManifestToCvrp -manifest $manifest -cvrpPath $cvrpPath -cvrpDropFolderPath $cvrpDropFolderPath -localOutputRoot $localOutputRoot -releaseOutputRoot $releaseOutputRoot
    }
    else
    {
        ConvertBcdtManifestToCvrp -bcdtManifest $manifest -cvrpPath $cvrpPath -cvrpDropFolderPath $cvrpDropFolderPath -localOutputRoot $localOutputRoot -releaseOutputRoot $releaseOutputRoot
    }
}
catch [exception]
{
    $_.Exception | Format-List -force
    Write-Host "Failed to generate CVRP for $manifest."
}

exit 0