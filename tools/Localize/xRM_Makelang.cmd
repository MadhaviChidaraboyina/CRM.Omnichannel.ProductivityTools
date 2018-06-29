@echo off
REM ----------------------------------------------------------------------
REM Microsoft CRM International Build Kit for xRMSolutions
REM xRM_MakeLang.cmd
REM ----------------------------------------------------------------------

echo.
echo Microsoft (R) CRM International Build Kit for xRMSolutions
echo Copyright (C) Microsoft Corporation 2002-2015. All rights reserved.
echo.


REM Check command-line parameters
REM ----------------------------------------------------------------------

if "%1"=="/?" goto :DisplayUsage
if "%1"=="" goto :DisplayUsage


REM ----------------------------------------------------------------------
set inetroot=%XrmSolutionsRoot%\solutions\
set PkgLsBuild_Corext=%XrmSolutionsRoot%\Packages\LSBuild.Corext.6.12.4929.5

call :ParseArguments %*
set xRM_NAME=%1

REM Initialize the localization kit
REM ----------------------------------------------------------------------
:Init
rem set xRM_LOCPATH=E:\Repository\v9.0_Loc\CRM-Loc\src\Localize\Extern
set xRM_TMPPATH=%~dp0Temp
if not exist "%xRM_TMPPATH%" md "%xRM_TMPPATH%"

REM Check 
if NOT DEFINED "%xRM_SRCPATH%" (
    set xRM_SRCPATH=%inetroot%
    echo.
    echo Use default path - %inetroot%
    echo.
)

for /f "tokens=1" %%i in (%~dp0xRM_LocVer.txt) do (
    set xRM_LocVer=%%i
)

if /i "All"=="%xRM_NAME%" (
    for /f "tokens=1" %%i in (%~dp0xRM_filelist.txt) do (
        set xRM_NAME=%%i
        set xRM_LANGLIST=%~dp0xRM_language.txt
        call :RunlsBuild
    )
    if NOT EXIST %xRM_TMPPATH%\lsbuild.response (
        echo Error - Solution Name does not exist
        exit /b
    )
    rem pause
    call %PkgLsBuild_Corext%\lsbuild response %xRM_TMPPATH%\lsbuild.response
    for /f "tokens=1" %%i in (%~dp0xRM_filelist.txt) do (
        set xRM_NAME=%%i
        set xRM_LANGLIST=%~dp0xRM_language.txt
        call :Finish
    )
) else (
    for /f "tokens=1" %%i in (%~dp0xRM_filelist.txt) do (
        if /i "%xRM_NAME%" == "%%i" (
            set xRM_LANGLIST=%~dp0xRM_language.txt
            call :RunlsBuild
        )
    )
    if NOT EXIST %xRM_TMPPATH%\lsbuild.response (
        echo Error - Solution Name does not exist
        exit /b
    ) 
    rem pause
    %PkgLsBuild_Corext%\lsbuild response %xRM_TMPPATH%\lsbuild.response
    set xRM_LANGLIST=%~dp0xRM_language.txt
    call :Finish
)
exit /b


echo.
echo -------------------------------------
echo      Build Info
echo.
echo SolutionName = %%i - %xRM_PL_FULL%
echo -------------------------------------
echo.

REM 
REM Process all the files under target language
REM 
:Runlsbuild
set xRM_COMPNAME=
if not "%xRM_NAME:\=%" == "%xRM_NAME%" (
    rem echo %xRM_NAME%
    for /f "tokens=1,2 delims=\" %%1 in ("%xRM_NAME%") do (
        set xRM_NAME=%%1
        set xRM_COMPNAME=%%2
    )
)

if not "%xRM_NAME:SMB=%" == "%xRM_NAME%" (
   set xRM_LANGLIST=%~dp0xRM_SMBlanguage.txt
)

echo Processing %xRM_NAME%
setlocal ENABLEDELAYEDEXPANSION
for /f "tokens=1,2" %%i in (%xRM_LANGLIST%) do (
    for /f %%o in ('dir /s /b %xRM_SRCPATH%*.1033.resx') do (
        rem for /f %%f in ('dir /s /b %XrmSolutionsRoot%\Packages\CRMLoc.b-V9.0_weekly-b.xrmSolutions_%xRM_NAME%.%xRM_LocVer%\%%i\xrmSolutions\%xRM_NAME%\%xRM_COMPNAME%\*.lcl') do (
        for /f %%f in ('dir /s /b %XrmSolutionsRoot%\Packages\CRMLoc.b-V9.0_weekly-b.xrmSolutions_%xRM_NAME%.%xRM_LocVer%\%%i\xrmSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\*.lcl') do (
            if /i "%%~no%%~xo"=="%%~nf" (
                set xRM_LCL=%%~df%%~pf
                set xRM_LSS=!xRM_LCL:LCL=LSS!
                REM Set default Parser to resx
                set xRM_PARSER=211
                set xRM_BASE=%%f
                set xRM_BASE=!xRM_BASE:%%i=Base!
                if "/Pseudo"=="%xRM_PL_FULL%" (
                    if NOT DEFINED xRM_BASEDONE (
                        echo parse /p !xRM_PARSER! /s !xRM_LSS!lss.lss /o %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Parse\%%~no%%~xo.lcl %%o>>%xRM_TMPPATH%\lsbuild.response 
                        echo merge /s !xRM_LSS!lss.lss /o %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Merged\%%~no%%~xo.lcl /z %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Parse\%%~no%%~xo.lcl /t !xRM_BASE!>>%xRM_TMPPATH%\lsbuild.response
                        echo update /s !xRM_LSS!lss.lss /i %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Merged\%%~no%%~xo.lcl !xRM_BASE!>>%xRM_TMPPATH%\lsbuild.response
                    )
                    echo update /s !xRM_LSS!lss.lss /i %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Merged\%%~no%%~xo.lcl %%f>>%xRM_TMPPATH%\lsbuild.response 
                )
                echo generate %xRM_PL_FULL% /novalidate /s !xRM_LSS!lss.lss /ol %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\target\%%~no%%~xo.lcl /d %%i /o %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\%%~no%%~xo /t %%f %%o>>%xRM_TMPPATH%\lsbuild.response
            )
        )
    )
    for /f %%o in ('dir /s /b %xRM_SRCPATH%\%xRM_NAME%\%xRM_COMPNAME%\*.en-us.resx') do (
        rem for /f %%f in ('dir /s /b %XrmSolutionsRoot%\Packages\CRMLoc.b-V9.0_weekly-b.xrmSolutions_%xRM_NAME%.%xRM_LocVer%\%%i\xrmSolutions\%xRM_NAME%\%xRM_COMPNAME%\*.lcl') do (
        for /f %%f in ('dir /s /b %XrmSolutionsRoot%\Packages\CRMLoc.b-V9.0_weekly-b.xrmSolutions_%xRM_NAME%.%xRM_LocVer%\%%i\xrmSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\*.lcl') do (
            if /i "%%~no%%~xo"=="%%~nf" (
                set xRM_LCL=%%~df%%~pf
                set xRM_LSS=!xRM_LCL:LCL=LSS!
                REM Set default Parser to resx
                set xRM_PARSER=211
                set xRM_BASE=%%f
                set xRM_BASE=!xRM_BASE:%%i=Base!
                if "/Pseudo"=="%xRM_PL_FULL%" (
                    if NOT DEFINED xRM_BASEDONE (
                        echo parse /p !xRM_PARSER! /s !xRM_LSS!lss.lss /o %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Parse\%%~no%%~xo.lcl %%o>>%xRM_TMPPATH%\lsbuild.response 
                        echo merge /s !xRM_LSS!lss.lss /o %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Merged\%%~no%%~xo.lcl /z %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Parse\%%~no%%~xo.lcl /t !xRM_BASE!>>%xRM_TMPPATH%\lsbuild.response
                        echo update /s !xRM_LSS!lss.lss /i %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Merged\%%~no%%~xo.lcl !xRM_BASE!>>%xRM_TMPPATH%\lsbuild.response
                    )
                    echo update /s !xRM_LSS!lss.lss /i %xRM_TMPPATH%\Base\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\Merged\%%~no%%~xo.lcl %%f>>%xRM_TMPPATH%\lsbuild.response 
                )
                echo generate %xRM_PL_FULL% /novalidate /s !xRM_LSS!lss.lss /ol %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\LCL\target\%%~no%%~xo.lcl /d %%i /o %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\%%~no%%~xo /t %%f %%o>>%xRM_TMPPATH%\lsbuild.response
            )
        )
    )
    set xRM_BASEDONE=true
)
endlocal
goto :eof


REM ----------------------------------------------------------------------
REM Finish
:Finish
set xRM_COMPNAME=
if not "%xRM_NAME:\=%" == "%xRM_NAME%" (
    for /f "tokens=1,2 delims=\" %%1 in ("%xRM_NAME%") do (
        set xRM_NAME=%%1
        set xRM_COMPNAME=%%2\
    )
)

if not "%xRM_NAME:SMB=%" == "%xRM_NAME%" (
   set xRM_LANGLIST=%~dp0xRM_SMBlanguage.txt
)

setlocal ENABLEDELAYEDEXPANSION
for /f "tokens=1,2" %%i in (%xRM_LANGLIST%) do (
    for /f %%d in ('dir /s /b %xRM_SRCPATH%\%xRM_NAME%\%xRM_COMPNAME%*.en-us.resx') do (
    rem for /f %%d in ('dir /s /b %xRM_SRCPATH%\%xRM_NAME%\*.en-us.resx') do (
        set xRM_TARGETFILE=%%d
        set xRM_TARGETFILE=!xRM_TARGETFILE:en-US=%%j!
        rem echo if not exist !~dpxRM_TARGETFILE  
        rem echo call xcopy %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%%~nd%%~xd !xRM_TARGETFILE! /Y /Q
        echo call xcopy %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%%%~nd%%~xd !xRM_TARGETFILE! /Y /Q
        echo F | call xcopy %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%%%~nd%%~xd !xRM_TARGETFILE! /Y /Q
        rem echo call copy %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\%%~nd%%~xd !xRM_TARGETFILE! /Y
        rem call copy %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%\%%~nd%%~xd !xRM_TARGETFILE! /Y
    )
    for /f %%d in ('dir /s /b %xRM_SRCPATH%*.1033.resx') do (
        set xRM_TARGETFILE=%%d
        set xRM_TARGETFILE=!xRM_TARGETFILE:1033=%%i!
        echo call xcopy %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%%%~nd%%~xd !xRM_TARGETFILE! /Y /Q
        echo F | call xcopy %xRM_TMPPATH%\%%i\xRMSolutions\%xRM_NAME%\%xRM_COMPNAME%%%~nd%%~xd !xRM_TARGETFILE! /Y /Q
    )
)
endlocal
echo Process completed.
echo.
goto :eof


REM ----------------------------------------------------------------------
REM Parse command-line options
:ParseArguments
set xRM_BASEDONE=
set xRM_PL_FULL=
set xRM_FILE=
set xRM_EXTRACT=
set xRM_SRCPATH=
if exist "%xRM_TMPPATH%" rd /S /Q "%xRM_TMPPATH%

shift
:ArgumentsLoopBegin
if "%~1"=="" goto :ArgumentsLoopEnd

if /i "%~1" EQU "/FullPL" (
    set xRM_PL_FULL=/Pseudo
)

shift
goto :ArgumentsLoopBegin
:ArgumentsLoopEnd
shift /0
goto :eof

REM ----------------------------------------------------------------------
:DisplayUsage
echo ----------------------------------------------------------------------
echo Usage: xRM_MakeLang xRMSolutionsName [options]
echo.
echo   xRMSolutionsName     indicates xRMSolutionsName such as Activities or AppCommon.  
echo                        Specify all to process all xRMSolutionsName. (Required)
echo.
echo Options:
echo   /FullPL              indicates that all strings should be pseudo-localized.
echo                        With this option, the language-specific LCLs are not used. 
echo                        The build kit uses generic PL LCLs in conjunction with
echo                        language-specific LSS settings.
echo.
echo Example:
echo   xRM_MakeLang Activities /Fullpl - Result = Generate Pseudo file for Activities
echo.
echo   xRM_MakeLang all /Fullpl - Result = Generate Pseudo file for all xRMSolutions
echo.

:eof
exit /b 1
