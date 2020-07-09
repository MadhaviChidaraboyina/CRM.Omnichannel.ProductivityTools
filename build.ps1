[CmdletBinding()]
Param(
   [Parameter(Mandatory=$true)]
   [string]$target=$(throw "Please select a target.  Valid options are: all, clean, restoreNuget")
)

If ($target -eq "prep") {
        Exit
}

$CDP_PUBLISH_TO_PIPELINE_ARTIFACTS='true'
$env:CDP_PUBLISH_TO_PIPELINE_ARTIFACTS='true'

Write-Host "[CDP_PUBLISH_TO_PIPELINE_ARTIFACTS:$CDP_PUBLISH_TO_PIPELINE_ARTIFACTS] and [CDP_PUBLISH_TO_PIPELINE_ARTIFACTS:$env:CDP_PUBLISH_TO_PIPELINE_ARTIFACTS]"
Write-Host "[CDP_BUILD_TAG:$env:CDP_BUILD_TAG]"
function Get-MsBuildPath([int] $MaxVersion = 2017)
{

    $agentPath = "$Env:programfiles (x86)\Microsoft Visual Studio\2017\BuildTools\MSBuild\15.0\Bin\msbuild.exe"
    $devPath = "$Env:programfiles (x86)\Microsoft Visual Studio\2017\Enterprise\MSBuild\15.0\Bin\msbuild.exe"
    $proPath = "$Env:programfiles (x86)\Microsoft Visual Studio\2017\Professional\MSBuild\15.0\Bin\msbuild.exe"
    $communityPath = "$Env:programfiles (x86)\Microsoft Visual Studio\2017\Community\MSBuild\15.0\Bin\msbuild.exe"
    $fallback2015Path = "${Env:ProgramFiles(x86)}\MSBuild\14.0\Bin\MSBuild.exe"
    $fallback2013Path = "${Env:ProgramFiles(x86)}\MSBuild\12.0\Bin\MSBuild.exe"
    $fallbackPath = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe"

    If ((2017 -le $MaxVersion) -And (Test-Path $agentPath)) { return $agentPath } 
    If ((2017 -le $MaxVersion) -And (Test-Path $devPath)) { return $devPath } 
    If ((2017 -le $MaxVersion) -And (Test-Path $proPath)) { return $proPath } 
    If ((2017 -le $MaxVersion) -And (Test-Path $communityPath)) { return $communityPath } 
    If ((2015 -le $MaxVersion) -And (Test-Path $fallback2015Path)) { return $fallback2015Path } 
    If ((2013 -le $MaxVersion) -And (Test-Path $fallback2013Path)) { return $fallback2013Path } 
    If (Test-Path $fallbackPath) { return $fallbackPath } 

    throw "Unable to find msbuild"
}

Function Get-MsBuildLocation() {
    $msbuildLocations = @("${env:ProgramFiles(x86)}\Microsoft Visual Studio\2017\Enterprise\MSBuild\15.0\Bin\MSBuild.exe",
                          "${env:ProgramFiles(x86)}\MSBuild\14.0\Bin\MSBuild.exe")
    $msbuildLocation = Find-FirstExistingPath -Paths $msbuildLocations
    if ([string]::IsNullOrEmpty($msbuildLocation)) {
        throw "Could not find MSBuild.exe!"
    }

    return $msbuildLocation
}

function Start-Executable {
  param(
    [String] $FilePath,
    [String[]] $ArgumentList,
    [String] $workDir
  )
  $OFS = " "
  $process = New-Object System.Diagnostics.Process
  $process.StartInfo.WorkingDirectory = $workDir
  $process.StartInfo.FileName = $FilePath
  $process.StartInfo.Arguments = $ArgumentList
  $process.StartInfo.UseShellExecute = $false
  $process.StartInfo.RedirectStandardOutput = $true
  if ( $process.Start() ) {
    $output = $process.StandardOutput.ReadToEnd() `
      -replace "\r\n$",""
    if ( $output ) {
      if ( $output.Contains("`r`n") ) {
        $output -split "`r`n"
      }
      elseif ( $output.Contains("`n") ) {
        $output -split "`n"
      }
      else {
        $output
      }
    }
    $process.WaitForExit()
    & "$Env:SystemRoot\system32\cmd.exe" `
      /c exit $process.ExitCode
  }
}

if($target -eq "GenerateCvrp"){
    $RootPath = "$PSScriptRoot\solutions\ProductivityMacros"
    $OutCvrpPath = "$PSScriptRoot\drop\retail\AnyCPU\Blobs\RDPackage\fairfax.cvrp"
    Write-Host "Generating Cvrp file for fairfax...[RootPath:$RootPath] and [OutCvrpPath:$OutCvrpPath]"

    ."$PSScriptRoot\tools\cvrp.onebranch.1.0.22\content\scripts\GenerateCvrpByPath.ps1" -paths "$PSScriptRoot\drop\retail\AnyCPU\Blobs" -dropRoot $RootPath -outCvrpPath $OutCvrpPath
    Write-Host "Cvrp file has generated successfully!"
    return
}

#$build = Get-MsBuildLocation
$srcPath = $PSScriptRoot;
Write-Host "Source path is: "$srcPath
$buildFilePath = $srcPath +"\solutions\ProductivityMacros\build.xml";
Write-Host "Build file path is: "$buildFilePath

#if($target -eq "GenerateCvrp"){
    #$RootPath = "$PSScriptRoot\solutions\ProductivityMacrosComponent"
    #$OutCvrpPath = "$PSScriptRoot\drop\retail\AnyCPU\Blobs\RDPackage\fairfax.cvrp"
    #Write-Host "Generating Cvrp file for fairfax...[RootPath:$RootPath] and [OutCvrpPath:$OutCvrpPath]"

    #."$PSScriptRoot\tools\cvrp.onebranch.1.0.22\content\scripts\GenerateCvrpByPath.ps1" -paths "$PSScriptRoot\drop\retail\AnyCPU\Blobs" -dropRoot $RootPath -outCvrpPath $OutCvrpPath
    #Write-Host "Cvrp file has generated successfully!"
    #return
#}

#$build = Get-MsBuildLocation
#$srcPath = $PSScriptRoot;
#Write-Host "Source path is: "$srcPath
#$buildFilePath = $srcPath +"\solutions\ProductivityMacrosComponent\build.xml";
#Write-Host "Build file path is: "$buildFilePath

$Env:BuildPlatform  = "AnyCPU"
$Env:BuildConfiguration  = "retail"

#Tagging build
Write-Host "Tagging build"
Write-Host "##vso[build.addbuildtag]working" 

#Write-Host $build
Write-Host "Executing build"
& "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2017\Enterprise\MSBuild\15.0\Bin\MSBuild.exe" $buildFilePath /target:$target /verbosity:m /m:1


Write-Host 
Write-Host 
Write-Host "*** Done ***  Press Enter to close..."