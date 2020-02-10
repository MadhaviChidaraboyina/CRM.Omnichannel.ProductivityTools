param(
		[string]$XRMBuildPlatform = "amd64"
    [string]$XRMBuildPath = "D:\DVD",
    [string]$XRMConfigurationFilePath = "D:\Config\XRMSetupConfig.xml"
		[string]$XRMLogFilePath = "D:\Logs\SetupServer.log"
)

$XRMInstallerPath = $XRMBuildPath + "Server\$XRMBuildPlatform"
$XRMInstaller = "$XRMInstallerPath\SetupServer.exe"

$InstallProcess = Start-Process -FilePath $XRMInstaller -ArgumentList "/Q /config $XRMConfigurationFilePath /L $XRMLogFilePath" -PassThru

do {
	Start-Sleep -Milliseconds 500
} until ($InstallProcess.HasExited)