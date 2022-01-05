param(
    [Parameter(Mandatory = $False)]
    [string]
    $CloudType = "test",

    [Parameter(Mandatory = $False)]
    $SubscriptionId = "7da41661-fb51-45ba-b8f2-b4c136cb904b",

    [Parameter(Mandatory = $False)]
    $ToEmail = "OcEV2CoreTeam@microsoft.com",

    [Parameter(Mandatory = $False)]
    $Geo = "United States",

    [Parameter(Mandatory = $False)]
    $Cloud = "octest",

    [Parameter(Mandatory = $False)]
    $RolloutType = "Major",

    [Parameter(Mandatory = $False)]
    $TenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47",

    [Parameter(Mandatory = $False)]
    $GCC = "Public",

    [Parameter(Mandatory = $False)]
    $adminKVSubId = "7da41661-fb51-45ba-b8f2-b4c136cb904b",

    [Parameter(Mandatory = $False)]
    $BlobFolder = "drop/outputs/build/TedCBuildArtifact",

    [Parameter(Mandatory = $False)]
    $CurrPath = ""
)

if([string]::IsNullOrEmpty($CurrPath)){
	$CurrPath = "$(Get-Location)\WebChatControl\EV2"
}

function  OpenFileAndUpdateContents([string]$ConfigFile) {
Write-Host $ConfigFile
$contents = Get-Content $ConfigFile | Out-String

$contents = $contents -replace "\(CloudType\)",$CloudType
$contents = $contents -replace "\(Cloud\)",$Cloud
$contents = $contents -replace "\(Geo\)",$Geo
$contents = $contents -replace "\(TenantId\)",$TenantId
$contents = $contents -replace "\(adminKVSubId\)",$adminKVSubId
$contents = $contents -replace "\(BlobFolder\)",$BlobFolder
$contents = $contents -replace "\(GCC\)",$GCC
$contents = $contents -replace "\(Cloud\)",$Cloud
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

#Update contents for scope binding
$ConfigFile =  "$CurrPath\BlobUpload\ScopeBindings.json"
OpenFileAndUpdateContents -ConfigFile $ConfigFile;
