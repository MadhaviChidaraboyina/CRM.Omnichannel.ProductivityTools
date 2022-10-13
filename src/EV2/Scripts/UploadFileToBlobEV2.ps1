## Variables

$tenantId = (Get-Item -Path env:tenantId).Value
$subscriptionId = (Get-Item -Path env:subscriptionId).Value
$rgName = (Get-Item -Path env:rgName).Value
$sgName = (Get-Item -Path env:sgName).Value
$ctName = (Get-Item -Path env:ctName).Value
$cacheValue = (Get-Item -Path env:cacheValue).Value
$blobFolderName = (Get-Item -Path env:blobFolderName).Value
$gcc = (Get-Item -Path env:gcc).Value

#AzureEnvironment
$PublicCloud = "Public"
$FairfaxCloud = "Fairfax"

$AzureEnvironmentPairMap = @{}
$AzureEnvironmentPairMap.Add($PublicCloud,"AzureCloud");
$AzureEnvironmentPairMap.Add($FairfaxCloud,"AzureUSGovernment");

if(!$gcc){
	$gcc = "Fairfax";
}

if($gcc.ToLower() -eq $FairfaxCloud.ToLower()){
	$spId = (Get-Item -Path env:appid).Value
	$spPwd = (Get-Item -Path env:apppwd).Value
}

function Login {
	Write-Host "Azure Account Login Begin.";
	if($gcc.ToLower() -eq $FairfaxCloud.ToLower()){
		Write-Host "Azure Account Login GCC.";
		$PWord = ConvertTo-SecureString -String $spPwd -AsPlainText -Force;
		$PsCred = New-Object System.Management.Automation.PSCredential($spId, $PWord);
		Login-AzAccount -Credential $PsCred -ServicePrincipal -TenantId $tenantId -Environment $AzureEnvironmentPairMap[$gcc];
	}else{
		Write-Host "Azure Account Login Public.";
		$retryCount = 0;
		$maxRetry = 10;
		$isLoggedIn = $false;
		Start-Sleep -s 20
		while(-not $isLoggedIn -and $retryCount -lt $maxRetry){
			try{
				Start-Sleep -s 20
				Connect-AzAccount -Identity
				$isLoggedIn = $true;
			}
			catch{
				Write-Host "Exception: "  $_
			}
			$retryCount = $retryCount + 1;
		}

		if($retryCount -ge $maxRetry)
		{
			exit -1;
		}
	}
}

function UploadToBlob{
param(
    [string]$FilePath = $( throw "Missing required parameter file-path"))
  
    Write-Host "File to copy is $FilePath";
	$RelativePath = $FilePath.Replace("$ApplicationPackagePath/","");
	Write-Host "Relative Path is $RelativePath";
	$fileExtension = [System.IO.Path]::GetExtension($FilePath)
	Write-Host "FileExtension is $fileExtension";

	if($fileExtension){
		$ContentType = 
			switch ($fileExtension)
			{ 
				".png" {"image/png"}
				".gif" {"image/gif"}
				".jpg" {"image/jpg"}
				".css" {"text/css"}
				".js" {"application/x-javascript"}
				".html" {"text/html"}
				".xml" {"application/xml"}
				".txt" {"text/plain"}
				".zip" {"application/zip"}
				".json" {"application/json"}
				".htm" {"text/html"}
				".svg" {"image/svg+xml"}
				default {"application/octet-stream"}
			}
		Write-Host "ContentType is $ContentType";
	}else{
		$ContentType = "";
		Write-Host "This file does not have extension." -foregroundcolor "green";
	}
	Set-AzStorageBlobContent -Container $ctName -File $FilePath -Properties @{ContentType=$ContentType; CacheControl=$cacheValue} -Context $Context -Force -ErrorAction Stop -Blob $RelativePath ;
	Write-Host "$FilePath uploaded to $ContainerName" -foregroundcolor "green";
}

try 
{
	$CurrPath = $PSScriptRoot;
	Write-Host $CurrPath
	$ApplicationPackagePath = "$CurrPath/$blobFolderName"
	Write-Host "ApplicationPackagePath- $ApplicationPackagePath"
	Login;
	Write-Host "Azure Account Login successful.";
	
	$StorageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $sgName
	$Context = $StorageAccount.Context; 
		  
	Write-Host "Uploading file...";
	# Uploads all the files present in given path and overwrites if already present
	$FilesToBeUploaded=Get-ChildItem -Path  $ApplicationPackagePath -Recurse | ForEach-Object -Process {$_.FullName}
	Write-Host "Files in directory are...$FilesToBeUploaded";
	
	foreach($File in $FilesToBeUploaded)
	{
		Write-Host "Uploading $File";
		UploadToBlob $File;
		Write-Host "Uploaded $File";
	}	
	Write-Host "Successfully uploaded all files";
}
catch
{
	Write-Error "Upload file to Blob Container failed" $_
	exit -1;
}