param(
    [string]$checkoutTool = "C:\xscode\target\debug\amd64\CheckoutAgent\CheckoutAgent.exe",
    [string]$settingsPath = "C:\xscode\target\debug\amd64\CheckoutAgent\agents.json",
    [string]$checkoutReason = "deploy355",
    [string]$agentName = ""
)

$output = [string](& $checkoutTool "$settingsPath" $checkoutReason $agentName 2>&1)

if ($output -like '*checkout*') {
    throw $output
} 
else 
{
    Write-Host("##vso[task.setvariable variable=TargetMachineName;]$output")
    $output
}