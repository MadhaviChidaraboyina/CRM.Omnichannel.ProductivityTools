set WSRoot="%~dp0"
echo WSRoot is %WSRoot%
powershell.exe -NoProfile -ExecutionPolicy Unrestricted -File "%~dp0GenerateVersion.ps1"
exit /B %ERRORLEVEL%