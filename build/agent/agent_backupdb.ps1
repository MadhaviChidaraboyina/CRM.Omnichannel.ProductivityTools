param(
    [string]$VMHostName = "VMHostName",
    [string]$VMName = "VMName",
    [string]$DBName = "ReportServer",
    [string]$AgentUserName = "userName",
    [string]$AgentPassword = "password"
)

# secure credential to use by builder for agent access
$agentUsername = $AgentUserName
$agentPassword = $AgentPassword

$secstr = New-Object -TypeName System.Security.SecureString
$agentPassword.ToCharArray() | ForEach-Object {$secstr.AppendChar($_)}
$agentCred = new-object -typename System.Management.Automation.PSCredential -argumentlist $agentUsername, $secstr

$agent = ( Get-VM -ComputerName $VMHostName -VMName $VMName | Get-VMNetworkAdapter).IpAddresses | ?{$_ -notmatch ':'}

$session = New-PSSession -ComputerName $agent -Credential $agentCred

    Invoke-Command -Session $session -ScriptBlock {
        param($databaseName)

        Write-Output ("Starting backup at: " + (Get-Date -format  yyyy-MM-dd-HH:mm:ss));
        # perform full database backup
        Backup-SqlDatabase -ServerInstance localhost -Database $databaseName -BackupAction Database
        Write-Output ("Finished at: " + (Get-Date -format  yyyy-MM-dd-HH:mm:ss));
    } -ArgumentList $DBName

Remove-PSSession -Session $session