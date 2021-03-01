## Variables

$spId = (Get-Item -Path env:spid).Value
$spPwd = (Get-Item -Path env:sppwd).Value
$tenantId = (Get-Item -Path env:tenantId).Value
$subscriptionId = (Get-Item -Path env:subscriptionId).Value
$rgName = (Get-Item -Path env:rgName).Value
$sgName = (Get-Item -Path env:sgName).Value
$ctName = (Get-Item -Path env:ctName).Value
$cacheValue = (Get-Item -Path env:cacheValue).Value
$blobFolderName = (Get-Item -Path env:blobFolderName).Value


function UploadToBlob{
param(
    [string]$FilePath = $( throw "Missing required parameter file-path"))
  
    Write-Host "File to copy is $FilePath";
	$RelativePath = "DesignerBlob/" + $FilePath.Replace("$ApplicationPackagePath/","");
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
	$CurrPath = "$(Get-Location)"
	Write-Host $CurrPath

	$ApplicationPackagePath = "$CurrPath/$blobFolderName"
	Write-Host "ApplicationPackagePath- $ApplicationPackagePath"

	$PWord = ConvertTo-SecureString -String $spPwd -AsPlainText -Force
	$PsCred = New-Object System.Management.Automation.PSCredential($spId, $PWord)
	Login-AzAccount -Credential $PsCred -ServicePrincipal -TenantId $tenantId -SubscriptionId $subscriptionId

	Write-Host "Azure Account Login successful.";
	
	$StorageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $sgName
	$Context = $StorageAccount.Context; 
		  
	Write-Host "Uploading file...";
	# Uploads all the files present in given path and overwrites if already present
	$FilesToBeUploaded=Get-ChildItem -Path  $ApplicationPackagePath -Recurse | ForEach-Object -Process {$_.FullName}
	Write-Host "Files in directory are...$FilesToBeUploaded";
	
	foreach($File in $FilesToBeUploaded)
	{
		UploadToBlob $File;
	}	
	Write-Host "Successfully uploaded all files";
}
catch
{
	Write-Error "Upload file to Blob Container failed" -exception $_
        write-host “Exception Type:"
        Write-Host "$($_.Exception.GetType().FullName)” -ForegroundColor Red
        write-host “Exception Message: "
        Write-Host "$($_.Exception.Message)” -ForegroundColor Red
        write-host “Exception Inner Exception: "
        Write-Host "$($_.Exception.InnerException)” -ForegroundColor Red
	exit -1;
}