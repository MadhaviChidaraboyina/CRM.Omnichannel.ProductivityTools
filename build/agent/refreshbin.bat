@echo off

set testmachine=%TargetMachineName%.%TargetMachineName%dom.extest.microsoft.com
set tmUserName=%TestAgentUserName%
set tmPassword=%TestAgentPassword%

%XrmSolutionsRoot%\tools\commands\refreshtest.cmd

@echo on