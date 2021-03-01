param(
    [Parameter(Mandatory = $False)]
    [string]
    $CloudType = "test",

    [Parameter(Mandatory = $False)]
    $SubscriptionId = "7da41661-fb51-45ba-b8f2-b4c136cb904b",

    [Parameter(Mandatory = $False)]
    $ToEmail = "OcEV2CoreTeam@microsoft.com"
)

$CurrPath = "$(Get-Location)\Src\EV2"

function  OpenFileAndUpdateContents([string]$ConfigFile) {
Write-Host $ConfigFile
$contents = Get-Content $ConfigFile | Out-String

$contents = $contents -replace "\(CloudType\)",$CloudType
$contents = $contents -replace "\(SubscriptionId\)",$SubscriptionId
$contents = $contents -replace "\(imageName\)","adm-ubuntu-1804-l"
$contents = $contents -replace "\(imageVersion\)","v17"
$contents = $contents -replace "\(ToEmailTo\)",$ToEmail

Set-Content $ConfigFile $contents
}

#set content for service model
$ConfigFile =  "$CurrPath\BlobUpload\ServiceModel.json"
OpenFileAndUpdateContents -ConfigFile $ConfigFile;


#Update contents for rollouts
$ConfigFile =  "$CurrPath\BlobUpload\FlowControlRolloutSpec.json"
OpenFileAndUpdateContents -ConfigFile $ConfigFile;
