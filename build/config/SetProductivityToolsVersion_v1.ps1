param(
	[string]
	$solutionsFolder = $env:WSRoot + "\solutions",
	[string]
	$solutionDependencyFile = $env:WSRoot + "\build\config\solutionDependencies.json",
	[string]
	$UpdateVSOBuild = 'false',
	[string]
	$AddVersionVSOTag = 'false',
	[string]
	$packagesFile = $env:WSRoot + "\build\config\packages.config",

	# version for release/2001.1 - 9.2.1.359 === terms followed here are not from powershell, in powershell version object is - major.minor.build.revision
	[int]
	$1_1_major = 8, # as major in 2001.1 release was 8 (1 will be added because of tag "major-minor-patch-version")
	[int]
	$1_1_minor = 1, # as minor in 2001.1 release was 2 (1 will be added because of tag "major-minor-patch-version")
	[int]
	$1_1_patch = 0, # as patch in 2001.1 release was 1 (1 will be added because of tag "major-minor-patch-version")
	[int]
	$1_1_build = 359 # as build in 2001.1 release was 359 (number of commit will be counted which are made after tag "major-minor-patch-version")

)

#. $env:WSRoot"\build\config\SetPatchVersion.ps1"
Write-Host "Computed Patch Version: $PatchVersion"


# Solution Object - Created for each solution
class Solution
{
	[string]	$Name;
	[string]	$Folder;
	[string]	$SlnXML;
	[int]		$Commits;
	[bool]		$IsPatchEnabled;
	[Object]	$Version;
}

# Commandlet Update-SolutionXMLVersion updates the solution xml file
# param solutionFile
# param newVersion
function Update-SolutionXMLVersion{
	[CmdletBinding()]
	param(
		[string]
		$solutionFile,
		[string]
		$newVersion
	)

	$xml = [xml](gc $solutionFile)
	$xml.ImportExportXml.SolutionManifest.Version = $newVersion
	$xml.Save((Resolve-Path $solutionFile))
	Write-Host "$solutionFile version updated"
}

#
# Commandlet to compute major, minor and patch version
# To override major version: Set env variables OverrideMajorVersion to true and ocMajorVersion to the desired value
# To override minor version: Set env variables OverrideMinorVersion to true and ocMinorVersion to the desired value
# To override patch version: Set env variables OverridePatchVersion to true and ocPatchVersion to the desired value
# If override flag is not set then git tags are used to compute the major, minor and patch version
# Returns the computed version object
#
function Compute-DerivedVersion {
	[CmdletBinding()]
	param(
	[string] $latestTag
	)
	#Log all the git tags
	$tagList = git tag
	Write-Host "Tags: $tagList"

	if ((Test-Path env:OverrideMajorVersion) -And ($env:OverrideMajorVersion -eq $true)) {

		Write-Host "Overriding Major Version flag is set"
		if (Test-Path env:ocMajorVersion) {
			Write-Host "Overriding Major version number with $env:ocMajorVersion"
			$majorVersion = $env:ocMajorVersion
		}
	} else {
		$majorVersion = (git tag -l "*[mM]ajor*" | Measure-Object -Line).Lines + $1_1_major
	}

	if ((Test-Path env:OverrideMinorVersion) -And ($env:OverrideMinorVersion -eq $true)) {
		Write-Host "Overriding Minor Version flag is set"
		if (Test-Path env:ocMinorVersion) {
			Write-Host "Overriding Minor version number with $env:ocMinorVersion"
			$minorVersion = $env:ocMinorVersion
		}
	} else {
		$minorVersion = (git tag -l "*[mM]inor*" | Measure-Object -Line).Lines + $1_1_minor
	}

	if ((Test-Path env:OverridePatchVersion) -And ($env:OverridePatchVersion -eq $true)) {
		Write-Host "Overriding patch Version flag is set"
		if (Test-Path env:ocPatchVersion) {
			Write-Host "Overriding Patch version number with $env:ocPatchVersion"
			$patchVersion = $env:ocPatchVersion
		}
	} else {
		$patchVersion = (git tag -l "*[pP]atch*" | Measure-Object -Line).Lines + $1_1_patch
	}
	$buildCommits = $1_1_build;

<#
	#Reset versions based on major or minor release
	if ([string]::IsNullOrEmpty($latestTag) -eq $false) {
		if ($latestTag.Contains("major") -or $latestTag.Contains("Major")) {
			Write-Host("Last tag is Major, Resetting version")
			$minorVersion = 0
			$patchVersion = 0
			$buildCommits = 0
		}
		if ($latestTag.Contains("minor") -or $latestTag.Contains("Minor")) {
			Write-Host("Last tag is Minor, Resetting version")
			$patchVersion = 0
			$buildCommits = 0
		}
	}
	#>

	$computedVersion = New-Object Version $majorVersion, $minorVersion, $patchVersion, $buildCommits
	Write-Host "Computed Version: $computedVersion"
	$computedVersion
}

# Commandlet Get-nugetpackages-Commits calculates the number of commits in the packages.config file
# Returns total commits between the given tags
function Get-nugetpackages-Commits {
	[CmdletBinding()]
	param(
		[string] $tags
	)
	# Calculate the number of commits in the packages.config file
	$nugetcommits = (git log --pretty=oneline $tags -- $packagesFile | Measure-Object –Line).Lines
	Write-Host "Package file commits -$nugetcommits"
	$nugetcommits
}

# Commandlet Get-Commits calculates the number of commits in the given solution folder
# param solutionObj
# param tags
# Returns total commits between the given tags
function Get-Commits {
	[CmdletBinding()]
	param(
		[Object] $solutionObj,
		[string] $tags
	)
	# Calculate the number of commits in each solutions folder
	$commits = (git log --pretty=oneline $tags -- $solutionObj.Folder | Measure-Object –Line).Lines 
	$commits
}

# Commandlet Get-LatestGitTag Returns the latest git tag containing string v/Version
function Get-LatestGitTag {
	# Get the latest tag
	# To Do: Resetting version component based on patch or minor or major version change
	try {
		$latestTag = git describe --match "*[vV]ersion*" --abbrev=0
		if (-not $?) {
			$msg = "Error: Versioning Failed - No recent tags matching the given pattern"
			Write-Host $msg
			throw $msg
		}
	}
	catch
	{
		$latestTag = "HEAD"
		Write-Host "Latest Tag - $latestTag"
	}
	$latestTag
}

# Commandlet Set-SolutionVersion computes the version and updates the solution xml with Update-SolutionXMLVersion commandlet
# param solutionObj
# param derivedVersion
# param versionFile defaults to empty string
function Set-SolutionVersion {
	[CmdletBinding()] 
	param(
		[Object] $solutionObj,
		[Object] $derivedVersion,
		[Object] $versionFile = ""
	)

	Write-Host "`r`n######Setting SolutionVersions#######"
	$SolutionVersion = New-Object Version $derivedVersion.Major, $derivedVersion.Minor, $derivedVersion.Build, ($derivedVersion.Revision + $solutionObj.Commits )
	$name = $solutionObj.Name
	Write-Host "`r`n $name Version : $SolutionVersion versionFile = $versionFile"
	if ($solutionObj.IsPatchEnabled -eq $false) {
		Update-SolutionXMLVersion -solutionFile $solutionObj.SlnXML -newVersion $SolutionVersion.ToString()
	}
	$solutionObj.Version = $SolutionVersion

	$text = $solutionObj.Name +" - "+$solutionObj.Version
	$text | Add-Content $versionFilePath -Force
}

# Commandlet Create-VersionTxtFile creates a version.txt file
# param versionFile
# param tempVersionFolder Folder in which the version.txt file will be created
function Create-VersionTxtFile {
	[CmdletBinding()]
	param(
		[string] $versionFile,
		[string] $versionFolder
	)
	# Create folder
	try {
		New-Item -Path $versionFolder -Type Directory -Force
		# Create Version.txt file
		Write-Host "`r`nCreating version.txt file... $versionFile"
		New-Item -path $versionFile -type "file" -Force
	}
	catch {
		Write-Host "`r`n Error in creating version.txt file... $versionFile"
	}
}

# Commandlet Handle_Vesion_For_ProductivityToolAchor handles version for ProductivityToolAchor
function Handle_Vesion_For_ProductivityToolAchor {
	[CmdletBinding()]
	param(
		[int] $commit,
		[Object] $derivedVersion,
		[Object] $versionFile = ""
	)
		# this portion of code is written to handle version for ProductivityToolAchor - its version will be increased if there are any changes in (wsroot)/solutions/ProductivityTools
		$baseSln= New-Object Solution
		$baseSln.Name = "ProductivityTools"
		$baseSln.Folder = $solutionsFolder + "\ProductivityTools"
		$baseSln.SlnXML = $solutionsFolder + "\Anchors\ProductivityTools" +$solutionXmlPath
		$PatchFlagName = $record.EnvironmentVariableForPatching
		
		Write-Host $baseSln	

		# Calculate the Commits
		$baseSln.Commits = $commit

		# Add the solution object to an array 
		$solutionObjects += $baseSln
	
		Set-SolutionVersion -solutionObj $baseSln -derivedVersion $derivedBaseVersion -versionFile $versionFilePath
}

###############################  MAIN ###############################
# Set the constansts
$solutionDependencies = (Get-Content $solutionDependencyFile | Out-String | ConvertFrom-Json)
$solutionXmlPath = "\Solution\Other\Solution.xml"
$patchsolutionXmlPath = "\Other\Solution.xml"
$PatchSolutionFolderName = "\PatchSolution"
$PatchGenratorFileName = "\PatchGenerator\PatchGenerator.csproj"
$AnchorFolder = $solutionsFolder + "\" + "Anchors"
$versionFileName = "version.txt"
$tempVersionFolder = "tempVersion"
$packages = @()
$solutionObjects = @()
$zero = 0
$TotalCommits = $zero

$latestTag = Get-LatestGitTag

# Compute Versions based on tags 
$derivedPatchVersion = Compute-DerivedVersion -latestTag $latestTag
$derivedBaseVersion =  New-Object Version $derivedPatchVersion.Major, $derivedPatchVersion.Minor, $derivedPatchVersion.Build, $derivedPatchVersion.Revision

Write-Host "Computed derivedBaseVersion: $derivedBaseVersion"

$BetweenTags = ($latestTag + ".." + "HEAD").Trim()

# Create version.txt File
$CurrentFolder = Get-Location
$versionFolder = $CurrentFolder.ToString() + "\" + $tempVersionFolder
$versionFilePath = $versionFolder.ToString() + "\" + $versionFileName

Create-VersionTxtFile -versionFile $versionFilePath -versionFolder $versionFolder

foreach ($record in $solutionDependencies) {
	
	$baseSln= New-Object Solution
		$baseSln.Name = $record.SolutionName
		$baseSln.Folder = $solutionsFolder + "\" + $record.SolutionName
		$baseSln.SlnXML = $baseSln.Folder + $solutionXmlPath
		$PatchFlagName = $record.EnvironmentVariableForPatching
	<#	if (Test-Path env:$PatchFlagName) {
			try {
				$baseSln.IsPatchEnabled = [System.Convert]::ToBoolean((get-item env:$PatchFlagName).Value)
			} catch [Exception] {
				Write-host "Format Exception occurred, setting patch flag to false"
				$baseSln.IsPatchEnabled = $false
			}
		} else {
			$baseSln.IsPatchEnabled = $false
		} #>
		Write-Host $baseSln	

		# Calculate the Commits
		$baseSln.Commits = Get-Commits -solutionObj $baseSln -tags $BetweenTags


		# Add the packages to an array and set the version
		$packages = ($record.PackageCombinations | Get-Member -Type NoteProperty).Name

		if($baseSln.Name -ne "ProductivityTools")
		{
			# Add the solution object to an array 
			$solutionObjects += $baseSln
		
			Set-SolutionVersion -solutionObj $baseSln -derivedVersion $derivedBaseVersion -versionFile $versionFilePath
		}
		 $TotalCommits += $baseSln.Commits 
			
	<#	foreach ($pkg in $packages) {
		# Anchor/Package version handling
			$anchorSln = New-Object Solution
			$anchorSln.Name = $pkg + "Pkg"
			$anchorSln.Folder = $AnchorFolder + "\" + $pkg
			$anchorSln.SlnXML = $anchorSln.Folder + $solutionXmlPath
			foreach ($sln in $record.PackageCombinations.$pkg) {
				if($sln -notlike "*CIFFramework*") {
					$anchorSln.commits +=  ($solutionObjects | Where-Object -Property Name -eq $sln).commits
				}
			}
			$anchorSln.commits += (Get-nugetpackages-Commits -tags $BetweenTags)
			$solutionObjects += $anchorSln
			Set-SolutionVersion -solutionObj $anchorSln -derivedVersion $PatchVersion -versionFile $versionFilePath
		} #>

	<#	if (($baseSln.IsPatchEnabled -eq $true) -And ($baseSln.Name -ne "CIFramework"))
	{
		$patchSln = New-Object Solution
		$patchSln.Name =  $record.SolutionPatchName
		# Keeping Patch and Base solution commits same - Commits in base solution folder which includes patch solutions commits as well
		$patchSln.Commits = $baseSln.Commits
		$solutionObjects += $patchSln

		# Patch Generator
		$patchGenFile = $baseSln.Folder + $PatchGenratorFileName
		$newPatchVersion = New-Object Version $PatchVersion.Major, $PatchVersion.Minor, $PatchVersion.Build, $patchSln.Commits
		$patchSln.Version = $newPatchVersion
		Update-PatchSolutionVersion -patchGenFile $patchGenFile -version $newPatchVersion.ToString()
	} #>		
}

Handle_Vesion_For_ProductivityToolAchor -commit $TotalCommits -derivedVersion $derivedBaseVersion -versionFile $versionFilePath

	foreach($obj in $solutionObjects) {
		Write-Host $obj.Name":" $obj.Version
	}

#$TotalCommits += (Get-nugetpackages-Commits -tags $BetweenTags)


if($UpdateVSOBuild -eq 'true')
{
	Write-Host "Updating VSO Build number"
	if ($env:enablePatchGenerator -eq $true) {
		$OverallOCVersion = New-Object Version $PatchVersion.Major, $PatchVersion.Minor, $PatchVersion.Build, $TotalCommits

	} else {
		$OverallOCVersion = New-Object Version $derivedBaseVersion.Major, $derivedBaseVersion.Minor, $derivedBaseVersion.Build, ($derivedBaseVersion.Revision + $TotalCommits)
	}
	$text = "***VSO Build number/version*** : " + $OverallOCVersion
	$text | Add-Content $versionFilePath -Force
	"##vso[build.updatebuildnumber]$OverallOCVersion" | Write-Host
}
