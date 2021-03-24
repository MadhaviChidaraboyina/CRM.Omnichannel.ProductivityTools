function UpdateTag ($BuildId, $Tag, $accessToken) {
    try {

        $Url = "https://dynamicscrm.visualstudio.com/OneCrm/_apis/build/builds/" + $BuildId + "/tags/" + $Tag + "?api-version=4.1"

        Write-Host "Tagging URL: $Url";

        $auth = "Bearer $accessToken"
        $accept = "*/*;api-version=3.2-preview.1;excludeUrls=true"
        $headers = @{authorization = $auth; accept = $accept }
        Invoke-RestMethod -Method 'PUT' -Uri $url -Headers $headers

        Write-Output 'End Tagging'
    }
    catch {
        Write-Host "Failed to Tag [$Build] with tag [$Tag]" -exception $_
    }
}

# Find the branch
$branchCode = "user"
$sourceBranch = $env:BUILD_SOURCEBRANCH
Write-Output $sourceBranch

If ($sourceBranch -eq "refs/heads/master")
{
    Write-Host "Detected master branch build"
    $branchCode = "master"
}
elseif ($sourceBranch -clike "refs/heads/releases/*")
{
    Write-Host "Detected release branch build"
    $branchCode = "release"
}
elseif ($sourceBranch -clike "refs/heads/features/*")
{
    Write-Host "Detected feature branch build"
    $branchCode = "features"
}
elseif ($sourceBranch -eq "PullRequest")
{
    Write-Host "Detected pull request branch build"
    $branchCode = "pr$(System.PullRequest.PullRequestId)"
}
else
{
    Write-Host "Detected user branch build"
}

#if($branchCode -eq "master" -OR $branchCode -eq "release"){
#if($true){
#    ."$PSScriptRoot\build\config\SetProductivityToolsVersion_v1.ps1" -solutionsFolder "$PSScriptRoot\solutions" -solutionDependencyFile "$PSScriptRoot\build\config\solutionDependencies.json" -UpdateVSOBuild "true" -AddVersionVSOTag "true" -packagesFile "$PSScriptRoot\build\config\packages.config"
#} else{

# Generate Application version 
$commitDate = Get-Date -Format "yyyy.MM.dd"
$commitID = $env:BUILD_SOURCEVERSION.subString(0,8)

$applicationVersion = $commitDate + "." +$commitID + "." +$branchCode
Write-host $applicationVersion

# TODO: Both of the approaches is not working yet 
$appVersion  = "applicationVersion"
Write-Host "##vso[build.addbuildtag]${applicationVersion}";

#Set auth parameters
$headers = @{"Authorization" = "Bearer $env:SYSTEM_ACCESSTOKEN"}

# create URL to get the commit 
$out = "https://dev.azure.com/dynamicscrm/OneCRM/_apis/git/repositories/$env:BUILD_REPOSITORY_ID/commits/$env:BUILD_SOURCEVERSION?api-version=5.1"
#API call to get the commit 
Write-host $out
$build= Invoke-RestMethod -Method Get -Headers $headers -Uri $out

$accesstoken = $env:SYSTEM_ACCESSTOKEN;
if([string]::IsNullOrEmpty($accesstoken)){
	Write-Host "system token is null or empty"
}
else{
	Write-Host "access token is: $accesstoken"
	UpdateTag -BuildId $env:BUILD_BUILDID -Tag $applicationVersion -accessToken $accesstoken;
}

$root = (Resolve-Path "$PSScriptRoot\..").Path

Write-Host "Setting version in buildver.txt file"
[System.IO.File]::WriteAllText("$root/src/EV2/buildver.txt", "$applicationVersion", [System.Text.UTF8Encoding]::new($False))

# To generate a custom version with "1.0.yyyymmdd.<build_count_of_day>"
$major = "15"
$minor = "0"
$date = Get-Date
$year = Get-Date -UFormat "%y"
$dayOfYear = $date.ToUniversalTime().DayOfYear
$revision = $env:CDP_DEFINITION_BUILD_COUNT_DAY

Write-Host "Build Id is: $env:BUILD_BUILDID"
$buildNumber = "$major.$minor.$year$dayOfYear.$revision"+"_"+"$applicationVersion"
# setting the build id
[Environment]::SetEnvironmentVariable("CustomBuildNumber", $buildNumber, "User")  # Setting the enviornmnet variable in powershell enviornment
Write-Host "##vso[build.updatebuildnumber]${buildNumber}"

Write-Output 'Application version is not set in Manifest'
#}