## Reads the parent solution version from packages file
## Input $pkgFile
function Read-ParentSolutionVersions {
	[CmdletBinding()]
	param(
	[string] $pkgFile
	)
	[xml]$xmlDoc = Get-Content $PackagesFile
	$packages = $xmlDoc.packages.package

	foreach($pkg in $packages) {

		if ($pkg.id -eq $SolutionPkg) {

			$VersionStr = $pkg.version
			$VersionComponents = $VersionStr.split(".")
			if ($VersionComponents.count -ge 2) {
				$ParentVersion = New-Object Version $VersionComponents[0], $VersionComponents[1], 0, 0
			}
		}
	}
	$ParentVersion
}

## Computes the patch version
function Compute-Patch-Version {
	[CmdletBinding()]

	$patches = 0
	# Get the tag list sorted by date
	$listTags = (git for-each-ref --sort=taggerdate --format '%(refname)' refs/tags)
	if ($listTags.Count -ge 1) {
		if ($listTags[-1].ToLower().Contains("patch") -eq $true) {
			Write-Host "Last release is a Patch release"
			for($i = -1; $i -ge -($listTags.count); $i=$i-1) {
				[string] $tag = $listTags[$i]
				Write-Host $tag
				if ($tag.ToLower().Contains("patch")) {
					$patches+=1
				} else {
					break;
				}
			}
		} else {
			$patches = 1
			Write-Host "Last release is an upgrade release"
		}
	}
	Write-Host "Patch Version: $patches"
	$patches
}

# Commandlet Update-SolutionXMLVersion updates the solution xml file
# param solutionFile
# param newVersion
function Update-PatchSolutionVersion {
	[CmdletBinding()]
	param(
		[string]
		$patchGenFile,
		[string]
		$version
	)

	$xml = [xml](gc $patchGenFile)
	$xml.Project.PropertyGroup.PatchSolutionVersion = $version
	$xml.Save((Resolve-Path $patchGenFile))
	Write-Host "$patchGenFile updated"
}
############################ MAIN #############################
## Initialize variables
	$PackagesFile = $env:WSRoot +"\build\config\packages.config"
	$SolutionPkg = "Microsoft.Dynamics.XrmSolutions.Omnichannel"
	$PatchVersion = New-Object Version 0,0,0,0

if ($env:enablePatchGenerator -eq $true) {

	$ParentVersion = Read-ParentSolutionVersions -pkgFile $PackagesFile
	Write-Host "`r`nParent Major and Minor versions: $ParentVersion"
	$patches = Compute-Patch-Version -version $ParentVersion
	[Object] $PatchVersion = New-Object Version $ParentVersion.Major, $ParentVersion.Minor, $patches.ToString(), 0
	Write-Host "PatchVersion = $PatchVersion"

	# Return Patch Version
	$PatchVersion
}
else {
	Write-Host "Patch generator is disabled"
	# Return 0.0.0.0
	$PatchVersion
}