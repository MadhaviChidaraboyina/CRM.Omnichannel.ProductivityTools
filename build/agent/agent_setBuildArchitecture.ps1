param(
    [string]$buildPlatform = "amd64"
)

$message = "Build architecture is: "
$amd64 = "x64"
$i386 = "x86"

if ($buildPlatform -eq 'amd64') {
    Write-Host("##vso[task.setvariable variable=XSBuildArchitecture;]$amd64")
		$message + $amd64
} 
else 
{
    Write-Host("##vso[task.setvariable variable=XSBuildArchitecture;]$i386")
    $message + $i386
}