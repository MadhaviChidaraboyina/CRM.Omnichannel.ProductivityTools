param(
	[string]
	$solutionsFolder = $env:WSRoot + "\solutions",
	[string]
	$solutionDependencyFile = $env:WSRoot + "\build\config\solutionDependencies.json",
	[string]
	$nuggetFilePath = $env:WSRoot + "\build\config\ProductivityTools.nuspec",
	[string]
	$packagesFile = $env:WSRoot + "\build\config\packages.config"
)
. $env:WSRoot"\build\config\SetPatchVersion.ps1"
Write-Host "Computed Patch Version: $PatchVersion"

# Solution Object - Created for each solution
class Solution
{
	[string]	$Name;
	[string]	$Folder;
	[string]	$SlnXML;
	[int]		$Commits;
	[bool]		$IsPatch;
	[bool]		$HasChanges
	[Object]	$Version;
	[string]	$solutionFile
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

	$xml = [xml](Get-Content $solutionFile)
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
		$majorVersion = (git tag -l "*[mM]ajor*" | Measure-Object -Line).Lines
	}

	if ((Test-Path env:OverrideMinorVersion) -And ($env:OverrideMinorVersion -eq $true)) {
		Write-Host "Overriding Minor Version flag is set"
		if (Test-Path env:ocMinorVersion) {
			Write-Host "Overriding Minor version number with $env:ocMinorVersion"
			$minorVersion = $env:ocMinorVersion
		}
	} else {
		$minorVersion = (git tag -l "*[mM]inor*" | Measure-Object -Line).Lines
	}

	if ((Test-Path env:OverridePatchVersion) -And ($env:OverridePatchVersion -eq $true)) {
		Write-Host "Overriding patch Version flag is set"
		if (Test-Path env:ocPatchVersion) {
			Write-Host "Overriding Patch version number with $env:ocPatchVersion"
			$patchVersion = $env:ocPatchVersion
		}
	} else {
		$patchVersion = (git tag -l "*[pP]atch*" | Measure-Object -Line).Lines
	}
	$buildCommits = 0

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

	$computedVersion = New-Object Version $majorVersion, $minorVersion, $patchVersion, $buildCommits
	Write-Host "Computed Version: $computedVersion"	
	$computedVersion
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
	# PatchGenerator Change
	if ($solutionObj.IsPatch -eq $false) {
		Write-Host "`r`n######Setting SolutionVersions#######"
		#the last bit of the version will be taken care by autoversioning later automatically
		$SolutionVersion = New-Object Version $derivedVersion.Major, $derivedVersion.Minor, $derivedVersion.Build, 0
		$name = $solutionObj.Name
		Write-Host "`r`n $name Version : $SolutionVersion versionFile = $versionFile"
		Update-SolutionXMLVersion -solutionFile $solutionObj.SlnXML -newVersion $SolutionVersion.ToString()
		$solutionObj.Version = $SolutionVersion
	}
}

#Commandlet Set-NuggetVersion sets the current major and minor version in the OmniChannel.nuspec file
#param filePath the path of the OmniChannel.nuspec file
#param version the major, minor version to be set
function Set-NuggetVersion {
	[CmdletBinding()] 
	param(
		[string] $filePath,
		[Object] $version
	)
		Write-Host "`r`n######Setting Nugget version#######"
		$xml = [xml](Get-Content $filePath)
		$xml.package.metadata.version = [System.Convert]::ToString($version)
		$xml.Save((Resolve-Path $filePath))
		Write-Host ($filePath |  Out-String) "version flag set to" $version
}

#Commandlet Get-NuggetVersion gets the current nugget version set
#param filePath the path of the OmniChannel.nuspec file
function Get-NuggetVersion {
	[CmdletBinding()] 
	param(
		[string] $filePath
	)
	Write-Host "`r`n######Getting Nugget version#######"
	$xml = [xml](Get-Content $filePath)
	$version = $xml.package.metadata.version
	Write-Host "version flag set to" $version
	$version
}

# Commandlet Set-ReturnNextVersionFlag sets the ReturnNextVersion flag in a given *Solution.csproj file
# param solutionObj the solution object
# param flagValue the flag value
function Set-ReturnNextVersionFlag{
	[CmdletBinding()] 
	param(
		[Object] $solutionObj,
        [bool] $flagValue
	)

	$xml = [xml](Get-Content $solutionObj.solutionFile)
	if($env:TF_BUILD -eq $true)
	{
		try
		{
			$xml.Project.PropertyGroup.ReturnNextVersion = [System.Convert]::ToString($flagValue)
		}
		catch
		{
			Write-Host "More than one PropertyGroup Encountered in"  $solutionObj.Name  ". Retrying to set ReturnNextVersion"
			try
			{
				$xml.Project.PropertyGroup[0].ReturnNextVersion = [System.Convert]::ToString($flagValue)
			}
			catch
			{
				Write-Host "Error setting ReturnNextVersion in" $solutionObj.Name
			}
			
		}
		
		$xml.Save((Resolve-Path $solutionObj.solutionFile))
		Write-Host ($solutionObj.solutionFile |  Out-String) "returnnextversion flag set to" $flagValue
		}
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

###############################  MAIN ###############################
# Set the constants
$solutionDependencies = (Get-Content $solutionDependencyFile | Out-String | ConvertFrom-Json)
$solutionXmlPath = "\Solution\Other\Solution.xml"
$solutionFilePath = "\Solution\"
$AnchorFolder = $solutionsFolder + "\" + "Anchors"
$versionFileName = "version.txt"
$tempVersionFolder = "tempVersion"
$packages = @()
$zero = 0
$latestTag = Get-LatestGitTag

# Compute Versions based on tags 
$derivedPatchVersion = Compute-DerivedVersion -latestTag $latestTag
$derivedBaseVersion =  New-Object Version $derivedPatchVersion.Major, $derivedPatchVersion.Minor, $zero, $derivedPatchVersion.Build

$BetweenTags = ($latestTag + ".." + "HEAD").Trim()

# Create version.txt File
$CurrentFolder = Get-Location
$versionFolder = $CurrentFolder.ToString() + "\" + $tempVersionFolder
$versionFilePath = $versionFolder.ToString() + "\" + $versionFileName

Create-VersionTxtFile -versionFile $versionFilePath -versionFolder $versionFolder

#setting major/minor version in nugget
#$nuggetFilePath = $env:WSRoot + "\build\config\ProductivityTools.nuspec"
$nuggetVersion = New-Object Version $derivedBaseVersion.Major, $derivedBaseVersion.Minor, 0 , 0
Set-NuggetVersion -filePath $nuggetFilePath -version $nuggetVersion

foreach ($record in $solutionDependencies) {
	$baseSln= New-Object Solution
	$baseSln.Name = $record.SolutionName
	$baseSln.Folder = $solutionsFolder + "\" + $record.SolutionName
	$baseSln.SlnXML = $baseSln.Folder + $solutionXmlPath
    $PatchFlagName = $record.EnvironmentVariableForPatching
    if (Test-Path env:$PatchFlagName) {
		try {
			$baseSln.IsPatch = [System.Convert]::ToBoolean((get-item env:$PatchFlagName).Value)
		} catch [Exception] {
			Write-host "Format Exception occurred, setting patch flag to false"
			$baseSln.IsPatch = $false
		}
	} else {
		$baseSln.IsPatch = $false
	}

	# Calculate the Commits
	$Commits = Get-Commits -solutionObj $baseSln -tags $BetweenTags

	if($Commits -gt 0)
	{
		$baseSln.HasChanges = $true
	}
	else
	{
		$baseSln.HasChanges = $false
	}

	# Add the packages to an array and set the version
	$packages = ($record.PackageCombinations | Get-Member -Type NoteProperty).Name
	$baseSln.solutionFile = $baseSln.Folder + $solutionFilePath + $baseSln.Name + "Solution.csproj"
	Write-Host ($baseSln | Format-List | Out-String)
	$flagValue = $baseSln.HasChanges
	if ($baseSln.Name -ne "CIFramework") 
	{
		if($baseSln.IsPatch -eq $false)
		{
			Set-ReturnNextVersionFlag -solutionObj $baseSln -flagValue $baseSln.HasChanges
		}
		else
		{
			#if ispath is true no change in the existing version
			Set-ReturnNextVersionFlag -solutionObj $baseSln -flagValue $false
		}
		
		Set-SolutionVersion -solutionObj $baseSln -derivedVersion $derivedBaseVersion -versionFile $versionFilePath
	}

	foreach ($pkg in $packages) {
	# Anchor/Package version handling
		$anchorSln = New-Object Solution
		$anchorSln.Name = $pkg + "Pkg"
		$anchorSln.Folder = $AnchorFolder + "\" + $pkg
		$anchorSln.SlnXML = $anchorSln.Folder + $solutionXmlPath
		$anchorSln.HasChanges = $baseSln.HasChanges

		#if is not patch do not trigger autoversioning for base solution
		$anchorSln.solutionFile = $anchorSln.Folder + $solutionFilePath + $pkg + "Solution.csproj"
		Write-Host ($anchorSln | Format-List | Out-String)
		Set-ReturnNextVersionFlag -solutionObj $anchorSln -flagValue $true
		Set-SolutionVersion -solutionObj $anchorSln -derivedVersion $derivedPatchVersion -versionFile $versionFilePath
	}
}

Write-Host "UseAsPipelineBuildVersion:"$env:UseAsPipelineBuildVersion
if($env:UseAsPipelineBuildVersion -eq 'true')
{
	# Until this point version has been set in nuspec
	$OverallOCVersion = Get-NuggetVersion -filePath $nuggetFilePath
	$text = "***VSO Build number/version*** " + $OverallOCVersion
	$text | Add-Content $versionFilePath -Force
}