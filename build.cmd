REM ShowInfo -> Show information
REM Package -> perform full msbuild and create package

powershell -File %~dp0build.ps1 ShowInfo
powershell -File %~dp0build.ps1 Package
powershell -File %~dp0build.ps1 GenerateCvrp