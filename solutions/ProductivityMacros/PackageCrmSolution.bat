@echo off
REM Build
REM Web resource mappings won't apply if run locally so ensure web resources are copied to CrmSolutionComponents
REM Apply random /src:"1033" to ensure solution packager works to build (docs wrong)
set SOLUTIONPACKAGER=..\packages\Microsoft.Packager.1.0.0\SolutionPackager.exe
set PACKAGEROOT=..\..\SolutionPackage\
set SOLUTIONZIP=%PACKAGEROOT%\%1
set SOLUTIONDIR=%2
set LOGFILE=buildlog.log
set LANGCODE=1033
%SOLUTIONPACKAGER%  /action Pack /zipfile  %SOLUTIONZIP% /clobber /packagetype both /folder %SOLUTIONDIR% /localize /log %LOGFILE% /src:%LANGCODE%
@echo on