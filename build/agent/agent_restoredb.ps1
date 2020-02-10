param(
    [string]$DBName = "ReportServer"
)

# restart sql server service
Restart-Service -Force MSSQLSERVER -Confirm:$false

# set database offline
Add-Type -Path 'C:\Program Files\Microsoft SQL Server\110\SDK\Assemblies\Microsoft.SqlServer.Smo.dll'
$srv = New-Object Microsoft.SqlServer.Management.Smo.Server("localhost")
$db = New-Object Microsoft.SqlServer.Management.Smo.Database
$db = $srv.Databases.Item($DBName)
$db.SetOffline()

$backupFile = $DBName + ".bak"

# restore database from file
Write-Output ("Starting restore at: " + (Get-Date -format  yyyy-MM-dd-HH:mm:ss));
Restore-SqlDatabase -ServerInstance "localhost" -Database $DBName -BackupFile $backupFile -Confirm:$false -ReplaceDatabase:$true
Write-Output ("Finished at: " + (Get-Date -format  yyyy-MM-dd-HH:mm:ss));