Param(
    [Parameter(Mandatory=$true)] [string] $repoRoot
)

$ErrorActionPreference = "Stop"

# Create the .tools directory
New-Item -ItemType Directory -Force -Path "$repoRoot\tools" | Out-Null
$toolsDir = Join-Path -Resolve $repoRoot "tools"

# Ensure nuget.exe is up-to-date
$nugetDownloadName = "node.msi"
$filename = (Join-Path $toolsDir $nugetDownloadName)

Try{

	# redirect stderr into stdout
	$p = &{node -v} 2>&1
    # otherwise return as is
	Write-Host "Current NodeJS Verion installed: $p"
	if($p -ne "v9.9.0"){
		Write-Host "Please install Version 9.9.0 or newer of Node"
	}
}
Catch
{
    # grab the version string from the error message
    Write-Host "node is not installed. Downloading Node v9.9.0 MSI"
	if(Test-Path -path $filename)
	{
		Write-Host "NodeJS MSI previously downloaded."
	}
	else
	{
		. "$PSScriptRoot\Initialize-DownloadLatest.ps1" -OutDir $toolsDir -DownloadUrl "https://nodejs.org/dist/v9.9.0/node-v9.9.0-x64.msi" -DownloadName $nugetDownloadName -Unzip $false
		Write-Host "NodeJS MSI downloaded."
	}
	Write-Host "IMPORTANT: Please install NodeJS from the msi located in \.tools in order to build this solution"
}


