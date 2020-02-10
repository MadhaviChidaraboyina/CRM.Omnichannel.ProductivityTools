@echo off

set newMachineName=%1
set sourceConfigurationPath=%2
set targetConfigurationPath=%3
setlocal EnableDelayedExpansion

del %targetConfigurationPath%
for /f "tokens=* delims=" %%f in ('type %sourceConfigurationPath%') do call :PerformReplace "%%f"
goto :eof

:PerformReplace
set INPUT=%*
set OUTPUT=%INPUT:machineName=!newMachineName!%

for /f "tokens=* delims=" %%g in ('echo %OUTPUT%') do echo %%~g>>%targetConfigurationPath%
exit /b

:eof