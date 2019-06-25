Echo "Run channel integration framework test cases"
Start-Process "C:\RunTestCases\ExecuteCIFQATestCases.bat" -Wait -RedirectStandardOutput output.txt -RedirectStandardError err.txt
$LastExitCode
Get-Content -Path output.txt
Get-Content -Path err.txt
Echo "Test cases run complete"
