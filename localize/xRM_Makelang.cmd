@echo off
REM ----------------------------------------------------------------------
REM Microsoft CRM International Build Kit for CRM.Omnichannel.ProductivityTools
REM xRM_MakeLang.cmd
REM ----------------------------------------------------------------------

echo.
echo Microsoft (R) CRM International Build Kit for CRM.Omnichannel.ProductivityTools
echo Copyright (C) Microsoft Corporation 2002-2018. All rights reserved.
echo.


REM Check command-line parameters
REM ----------------------------------------------------------------------

if "%1"=="/?" goto :DisplayUsage
if "%1"=="" goto :DisplayUsage


REM ----------------------------------------------------------------------

call :ParseArguments %*

REM init
set xRM_PNAME=CRM.Omnichannel.ProductivityTools
set xRM_LCID=
set xRM_CULTURE_NAME=
set xRM_TRG_FILE=
set xRM_BASEDONE=
set xRM_TMPPATH=%~dp0Temp
if exist "%xRM_TMPPATH%" rd /S /Q "%xRM_TMPPATH%

REM Set language options
REM if Arabic
REM - xRM_LCID=1025
REM - xRM_CULTURE_NAME=ar-SA

set xRM_LCID=%1

for /f "usebackq  eol=! tokens=1,2 delims= " %%i in (%~dp0xRM_language.txt) do (
    if "%%i"=="%xRM_LCID%" (
        set xRM_CULTURE_NAME=%%j
    )
)


REM ----------------------------------------------------------------------
:CheckArguments

if /i NOT "All"=="%xRM_LCID%" (
    if NOT DEFINED xRM_CULTURE_NAME (
        echo.
        echo Error: Specified LCID is not valid.
        echo        Please specify all or supported languages in xRM_language.txt.
        echo.
        goto :DisplayUsage
    )
)


REM Initialize the localization kit
REM ----------------------------------------------------------------------
:Init

set inetroot=%~dp0
set inetroot=%inetroot:\Localize\=%
set PKG_LSBUILD=%inetroot%\packages\LSBuild.Corext.6.12.4929.5
@echo off

set xRM_LOCPATH=%~dp0Extern
if not exist "%xRM_TMPPATH%" (
    md "%xRM_TMPPATH%"
) else ( 
    if exist "%xRM_TMPPATH%\target.txt" del /f /q "%xRM_TMPPATH%\target.txt"
)
REM Check 
if NOT DEFINED xRM_SRCPATH (
    echo.
    echo Use default path - %inetroot%
    echo.
    set xRM_SRCPATH=%inetroot%
)

REM Get relative Path 
call :Get_CharCount %inetroot%

setlocal ENABLEDELAYEDEXPANSION
for /f "usebackq  eol=! tokens=1,2 delims=," %%i in (%~dp0xRM_filelist.txt) do (
    set xRM_TRG=%%i
    REM if path includes 'CmtDataFiles\data_1033' and .json, call DataXml2json.ps1 to generate data json from data xml
    if not "!xRM_TRG:CmtDataFiles\data_1033=!"=="!xRM_TRG!" (
        if /i "%%~xi"==".json" (
            set xRM_SRC=!xRM_TRG:json=xml!
            REM delete data json file generated in previous run
            if exist "%xRM_SRCPATH%\!xRM_TRG!" del "%xRM_SRCPATH%\!xRM_TRG!" /f /q
            call powershell -noprofile %~dp0DataXml2json.ps1 -mode generate -sourceDataxmlPath %xRM_SRCPATH%\!xRM_SRC! -referenceFilePath %~dp0%%~ni_rules.xml -jsonFilePath %xRM_SRCPATH%\!xRM_TRG! || goto :Error
        )
    )
    call :Get_RelativePath "%xRM_SRCPATH%\%%i" %xRM_charcount% "%%j"
)
endlocal

if /i "All"=="%xRM_LCID%" (
    for /f "tokens=1,2" %%i in (%~dp0xRM_language.txt) do (
        set xRM_LCID=%%i
        set xRM_CULTURE_NAME=%%j
        call :RunlsBuild || goto :Error
        set xRM_BASEDONE=true
    )
    call :lsBuildGenerate lsbuild.response || goto :Error
    call :RunCmd genXML.cmd || goto :Error
    call :RunCmd copytarget.cmd || goto :Error
) else (
    for /f "tokens=1,2" %%i in (%~dp0xRM_language.txt) do (
        if "%%i" == "%xRM_LCID%" (
            call :RunlsBuild || goto :Error
        )
    )
    call :lsBuildGenerate lsbuild.response || goto :Error
    call :RunCmd genXML.cmd || goto :Error
    call :RunCmd copytarget.cmd || goto :Error
)
echo '%~nx0 %*' completed successfully.
exit /b 0

REM 
REM Process all the files under target language
REM 
:Runlsbuild
echo.
echo -------------------------------------
echo      Build Info
echo.
echo Language = %xRM_LCID%%xRM_PL_FULL%
echo  SRCPath = %xRM_SRCPATH%
echo -------------------------------------
echo.

setlocal ENABLEDELAYEDEXPANSION
echo.
echo Searching target files...
echo.

if exist "%xRM_TMPPATH%\%xRM_LCID%" rd /S /Q "%xRM_TMPPATH%\%xRM_LCID%"

REM 
REM Generate target.txt
REM 
if Exist "%xRM_TMPPATH%\target.txt" (
    for /f "tokens=1,2,3 delims=," %%o in (%xRM_TMPPATH%\target.txt) do (
        set xRM_PATH=%%p
        set xRM_FILE=%%~no%%~xo
        set xRM_SOURCE=%%o
        set xRM_TARGET=%%o
        set xRM_COMPNAME=%%q\

        REM To help reading this batch file, here are sample values
        REM   xRM_PATH      \solutions\Anchors\OmnichannelPrimeCustomMessaging\Solution\Resources\en-US\
        REM   xRM_FILE      resources.en-US.resx
        REM   xRM_SOURCE    "D:\OneCRM\CRM.OmniChannel.C1Provisioning\solutions\Anchors\OmnichannelPrimeCustomMessaging\Solution\Resources\en-US\resources.en-US.resx"
        REM   xRM_TARGET    "D:\OneCRM\CRM.OmniChannel.C1Provisioning\solutions\Anchors\OmnichannelPrimeCustomMessaging\Solution\Resources\en-US\resources.en-US.resx"
        REM   xRM_COMPNAME  Anchors\OmnichannelPrimeCustomMessaging\

        REM Following if block is to onboard new files automatically. 
        REM note: it is still required to update eol file to sync with xRM_filelist.txt. I have a plan to update eol file automatically but not yet implemented.
        REM if it run in 'handoff' option and '!xRM_FILE!.lcl' file doesn't exist,
        REM given file is new file thus generate lcl file for 'base' and all languages which will be picked by CTAS Handoff (aka WordCount) run
        if /i "%xRM_HANDOFF%"=="1" (
            if not exist "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" (
                echo *** New file !xRM_SOURCE! found. 
                echo *** Generating base lcl "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl"
                REM Get parser id based on file extention
                REM Default to RESX Parser
                set xRM_PARSER=211
                if /i "%%~xo"==".json" (set xRM_PARSER=306)

                REM Does 'basepath' has a trailing slash? if so remove it 
                set xRM_SOURCE_BASEPATH=%%~dpo
                if !xRM_SOURCE_BASEPATH:~-1!==\ (set xRM_SOURCE_BASEPATH=!xRM_SOURCE_BASEPATH:~0,-1!)

                REM Genereate base lcl
                echo *** call %PKG_LSBUILD%\lsbuild parse /p !xRM_PARSER! /o "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" /s "%xRM_LOCPATH%\Base\%xRM_PNAME%\LSS\lss.lss" /basepath "!xRM_SOURCE_BASEPATH!" !xRM_FILE! || goto :Error
                echo.
                call %PKG_LSBUILD%\lsbuild parse /p !xRM_PARSER! /o "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" /s "%xRM_LOCPATH%\Base\%xRM_PNAME%\LSS\lss.lss" /basepath "!xRM_SOURCE_BASEPATH!" !xRM_FILE! || goto :Error

                REM Genereate target lcl
                for /f "tokens=1,2" %%i in (%~dp0xRM_language.txt) do (
                    set LCID=%%i
                    set LL-CC=%%j

                    REM replace 'sr-Latn-RS', 'sr-Cyrl-RS' with 'sr-Latn-CS', 'sr-Cyrl-CS' respectively since D635_CE has only CS based locales
                    if "%%j"=="sr-Latn-RS" (set LL-CC=sr-Latn-CS)
                    if "%%j"=="sr-Cyrl-RS" (set LL-CC=sr-Cyrl-CS)

                    REM generate twice
                    REM 1. under 'Localize\Temp\[ll-cc]' to copy to 'D365_CE' repo
                    REM 2. under 'Localize\Extern\[lcid]' to copy to core team repo
                    REM After the change to stop checking in lcl files to core team repo, not all languages lcl files are available since 'Localize\Extern\ folder deleted
                    REM and we only copy Base and one language ('1031') while running 'xx_makelang.cmd 1031 /handoff' so use 'Base\%xRM_PNAME%\LSS\lss.lss' to generate language lcl files for new files
                    call %PKG_LSBUILD%\lsbuild generate /w 0 /d !LCID! /o %xRM_TMPPATH%\Output\!xRM_FILE! /s "%xRM_LOCPATH%\Base\%xRM_PNAME%\LSS\lss.lss" /ol "%xRM_LOCPATH%\!LCID!\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" /basepath "!xRM_SOURCE_BASEPATH!" !xRM_FILE! || goto :Error
                    call %PKG_LSBUILD%\lsbuild generate /w 0 /d !LL-CC! /o %xRM_TMPPATH%\Output\!xRM_FILE! /s "%xRM_LOCPATH%\Base\%xRM_PNAME%\LSS\lss.lss" /ol "%xRM_TMPPATH%\!LL-CC!\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" /basepath "!xRM_SOURCE_BASEPATH!" !xRM_FILE! || goto :Error
                )
            )
        )

        if exist "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" (
            REM Just need to copy the source file to Master folder once so check if the source file exists in Master folder
            if not exist %xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\!xRM_FILE! (
                echo "Copy the source file (%%~do%%~po!xRM_FILE!) to Master folder (%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!)"
                REM if path includes 'CmtDataFiles\data_1033', use '/MOV' to delete data json file after copying since no need to check it in to core team repo
                if not "!xRM_SOURCE:CmtDataFiles\data_1033=!"=="!xRM_SOURCE!" (
                    REM Robocopy's exit code is a bitmap. In the case of copying a single file, a value of 8 or more indicates a failure.
                    REM note: when "if ERRORLEVEL 8" test succeeds, then the error level is 8 or more
                    REM see https://docs.microsoft.com/en-us/archive/blogs/deploymentguys/robocopy-exit-codes
                    call robocopy "%%~do%%~po\" "%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\" !xRM_FILE! /MOV & if ERRORLEVEL 8 goto :Error
                ) else (
                    call robocopy "%%~do%%~po\" "%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\" !xRM_FILE! & if ERRORLEVEL 8 goto :Error
                )
            )

            REM Set LSBuild Parser and Target file name
            REM Default to RESX Parser
            set xRM_PARSER=211
            if /i "%%~xo"==".json" (set xRM_PARSER=306)

            if not "!xRM_PATH:CmtDataFiles\data_1033=!"=="!xRM_PATH!" (
                REM from: \solutions\ProductivityMacros\PVSPackage\ProductivityMacros\CmtDataFiles\data_1033\
                REM to:   \solutions\ProductivityMacros\PVSPackage\ProductivityMacros\CmtDataFiles\data_1031\
                set xRM_PATH=!xRM_PATH:1033=%xRM_LCID%!

                REM from: "D:\Latest\CS\CRM.Omnichannel.ProductivityTools\solutions\ProductivityMacros\PVSPackage\ProductivityMacros\CmtDataFiles\data_1033\data.json"
                REM to:   "D:\Latest\CS\CRM.Omnichannel.ProductivityTools\solutions\ProductivityMacros\PVSPackage\ProductivityMacros\CmtDataFiles\data_1031\data.json"
                set xRM_TARGET=!xRM_TARGET:1033=%xRM_LCID%!

                REM from: "D:\Latest\CS\CRM.Omnichannel.ProductivityTools\solutions\ProductivityMacros\PVSPackage\ProductivityMacros\CmtDataFiles\data_1031\data.json"
                REM to:   "D:\Latest\CS\CRM.Omnichannel.ProductivityTools\solutions\ProductivityMacros\PVSPackage\ProductivityMacros\CmtDataFiles\data_1031\data.xml"
                set xRM_TARGET=!xRM_TARGET:json=xml!

                REM from: data.json
                REM to:   data.xml
                set xRM_TARGETFILE=!xRM_FILE:json=xml!
            ) else (
                if not "!xRM_FILE:1033=!" == "!xRM_FILE!" (
                    REM from: OCTagsControl.1033.resx
                    REM to:   OCTagsControl.1031.resx
                    set xRM_TARGETFILE=!xRM_FILE:1033=%xRM_LCID%!

                    REM from: "D:\Latest\CS\CRM.Omnichannel.ProductivityTools\solutions\OmnichannelBase\Client\Controls\OCTagsControl\strings\OCTagsControl.1033.resx"
                    REM to:   "D:\Latest\CS\CRM.Omnichannel.ProductivityTools\solutions\OmnichannelBase\Client\Controls\OCTagsControl\strings\OCTagsControl.1031.resx"
                    set xRM_TARGET=!xRM_TARGET:1033=%xRM_LCID%!
                ) else (
                    if not "!xRM_FILE:en-US=!" == "!xRM_FILE!" (
                        REM from: resources.en-US.resx
                        REM to:   resources.de-DE.resx
                        set xRM_TARGETFILE=!xRM_FILE:en-US=%xRM_CULTURE_NAME%!

                        REM from: \solutions\AgentGuidance\Solution\Resources\en-US\
                        REM to:   \solutions\AgentGuidance\Solution\Resources\de-DE\
                        set xRM_PATH=!xRM_PATH:en-US=%xRM_CULTURE_NAME%!

                        REM from: "D:\Latest\CS\CRM.Omnichannel.ProductivityTools\solutions\AgentGuidance\Solution\Resources\en-us\resources.en-US.resx"
                        REM to:   "D:\Latest\CS\CRM.Omnichannel.ProductivityTools\solutions\AgentGuidance\Solution\Resources\de-DE\resources.de-DE.resx"
                        set xRM_TARGET=!xRM_TARGET:en-US=%xRM_CULTURE_NAME%!
                    ) else (
                        REM Add [ll-cc] in the filename as default behavior
                        REM  note: %%~no (filename only), %%~xo (file extention only) and %%~dpo (target path without filename & file extention)
                        set FILE_NAME=%%~no
                        set FILE_EXTENTION=%%~xo
                        set TARGET_PATHONLY=%%~dpo

                        REM   FILE_NAME        Sample
                        REM   FILE_EXTENTION   .resx
                        REM   TARGET_PATHONLY  D:\OneCRM\CRM.OmniChannel.C1Provisioning\solutions\OmnichannelBase\Client\Localization\Languages\
                        REM   xRM_TARGETFILE   Sample.de-DE.resx
                        REM   xRM_TARGET       D:\OneCRM\CRM.OmniChannel.C1Provisioning\solutions\OmnichannelBase\Client\Localization\Languages\Sample.de-DE.resx
                        set xRM_TARGETFILE=!FILE_NAME!.%xRM_CULTURE_NAME%!FILE_EXTENTION!
                        set xRM_TARGET=!TARGET_PATHONLY!!xRM_TARGETFILE!
                    )
                )
            )
            if /i "/Pseudo"=="%xRM_PL_FULL%" (
                if NOT DEFINED xRM_BASEDONE (
                    echo parse /p !xRM_PARSER! /s "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\LSS\lss.lss" /o "%xRM_TMPPATH%\Intermidiate\Parse\!xRM_COMPNAME!\!xRM_FILE!.lcl" "%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\!xRM_FILE!">>%xRM_TMPPATH%\lsbuild.response
                    echo merge /s "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\LSS\lss.lss" /o "%xRM_TMPPATH%\Intermidiate\Merged\!xRM_COMPNAME!\!xRM_FILE!.lcl" /z "%xRM_TMPPATH%\Intermidiate\Parse\!xRM_COMPNAME!\!xRM_FILE!.lcl" /t "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl">>%xRM_TMPPATH%\lsbuild.response
                    echo update /s "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\LSS\lss.lss" /i "%xRM_TMPPATH%\Intermidiate\Merged\!xRM_COMPNAME!\!xRM_FILE!.lcl" "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl">>%xRM_TMPPATH%\lsbuild.response
                )
                echo update /s "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\LSS\lss.lss" /i "%xRM_TMPPATH%\Intermidiate\Merged\!xRM_COMPNAME!\!xRM_FILE!.lcl" "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl">>%xRM_TMPPATH%\lsbuild.response
            )
            if NOT DEFINED xRM_EXTRACT (
                echo generate %xRM_PL_FULL% /novalidate /ol "%xRM_TMPPATH%\%xRM_LCID%\!xRM_COMPNAME!\LCL\target\!xRM_TARGETFILE!.lcl" /d %xRM_LCID% /s "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\LSS\lss.lss" /o "%xRM_TMPPATH%\%xRM_LCID%\!xRM_PATH!\!xRM_FILE!" /t "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" "%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\!xRM_FILE!">>%xRM_TMPPATH%\lsbuild.response

                REM Generate copy command
                REM
                REM append ' || set failed=1' or ' & if ERRORLEVEL 8 set failed=1' at the end of each line in 'genXML.cmd' and 'copytarget.cmd' to set 'failed=1' if any execution fails while executing all lines
                REM see ':RunCmd' where 'setlocal' at the first line and 'exit /b %failed%' at the last line are added to return the error to the caller.
                REM
                REM if path includes 'CmtDataFiles\data_1033' and .json, construct PowerShell command
                REM to run DataXml2json.ps1 to generate data xml from data json which has translation, then append it to genXML.cmd
                if NOT EXIST %xRM_SRCPATH%!xRM_PATH! md %xRM_SRCPATH%!xRM_PATH!
                if not "!xRM_SOURCE:CmtDataFiles\data_1033=!"=="!xRM_SOURCE!" (
                    if /i "%%~xo"==".json" (
                        set xRM_SOURCE=!xRM_SOURCE:json=xml!
                        echo call powershell -noprofile %~dp0DataXml2json.ps1 -mode importjson -sourceDataxmlPath "!xRM_SOURCE!" -referenceFilePath %~dp0%%~no_rules.xml -jsonFilePath "%xRM_TMPPATH%\%xRM_LCID%\!xRM_PATH!\!xRM_FILE!" -outputDataXmlPath !xRM_TARGET! ^|^| set failed=^1>>%xRM_TMPPATH%\genXML.cmd
                    )
                ) else ( 
                    echo call copy "%xRM_TMPPATH%\%xRM_LCID%!xRM_PATH!!xRM_FILE!" "!xRM_TARGET!" /Y ^|^| set failed=^1>>%xRM_TMPPATH%\copytarget.cmd
                )
            ) else (
                if NOT DEFINED xRM_BASEDONE (
                    echo call robocopy "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!LCL" "%xRM_TMPPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!LCL" !xRM_FILE!.lcl /s ^& if ERRORLEVEL 8 set failed=^1>>%xRM_TMPPATH%\copytarget.cmd
                )
            )
        ) else (
            echo Info - "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" not found. Skip processing the file.
        )
    )
) else (
    echo Error - %xRM_TMPPATH%\target.txt not found
    goto :Error
)
endlocal
exit /b 0


:lsBuildGenerate
if EXIST %xRM_TMPPATH%\%1 (
    echo call %PKG_LSBUILD%\lsbuild response %xRM_TMPPATH%\%1
    call %PKG_LSBUILD%\lsbuild response %xRM_TMPPATH%\%1
    if ERRORLEVEL 1 goto :Error
) else (
    if NOT DEFINED xRM_EXTRACT (
        echo Error - Solution Name does not exist
    )
    goto :Error
)
exit /b 0


REM ----------------------------------------------------------------------
REM RunCmd
:RunCmd
if exist %xRM_TMPPATH%\%1 (
    REM Inject 'set failed=0' at the beginning and 'exit /b %failed%' at the end of the file
    REM in order to expose an error ('exit /b 1') while executing commands in the files (e.g. genXML.cmd, copytarget.cmd)
    setlocal
    echo set failed=^0>%xRM_TMPPATH%\setFailed.cmd
    type %xRM_TMPPATH%\%1 >>%xRM_TMPPATH%\setFailed.cmd
    type %xRM_TMPPATH%\setFailed.cmd > %xRM_TMPPATH%\%1
    echo exit /b %%failed%%>> %xRM_TMPPATH%\%1
    del %xRM_TMPPATH%\setFailed.cmd
    endlocal

    REM Copy to final destination (copytarget.cmd) or Generate data xml files (genXML.cmd)
    echo.
    echo call %xRM_TMPPATH%\%1
    call %xRM_TMPPATH%\%1
    if ERRORLEVEL 1 goto :Error
    echo.
    echo '%1' completed successfully.
    echo.
)
exit /b 0


REM ----------------------------------------------------------------------
REM Parse command-line options
:ParseArguments

set xRM_PL_FULL=
set xRM_FILE=
set xRM_SRCPATH=
set xRM_EXTRACT=
set xRM_TCOMP=
set xRM_HANDOFF=

shift
:ArgumentsLoopBegin
if "%~1"=="" goto :ArgumentsLoopEnd

if /i "%~1" EQU "/FullPL" (
    rem set xRM_EXTRACT=1
    set xRM_PL_FULL=/Pseudo
) else (
    if /i "%~1" EQU "/ExtractOnly" (
        set xRM_EXTRACT=1
    ) else (
        if /i "%~1" EQU "/handoff" (
            set xRM_EXTRACT=1
            set xRM_PL_FULL=/Pseudo
            set xRM_HANDOFF=1
        ) else (
            if /i "%~1" EQU "/component" (
                if "%~2"=="" goto :DisplayUsage
                set xRM_TCOMP=%~2
            )
        )
    )
)
shift
goto :ArgumentsLoopBegin

:ArgumentsLoopEnd
shift /0
exit /b 0


:Get_CharCount
set s=%1
set xRM_charcount=0
:LOOP_GCC
if defined s (
    set s=%s:~1%
    set /a xRM_charcount+=1
    goto :LOOP_GCC
)
exit /b 0


:Get_RelativePath
set xRM_R_PATH=%~p1
set /a ch=%2
:LOOP_GRP
if not 2==%ch% (
    set xRM_R_PATH=%xRM_R_PATH:~1%
    set /a ch-=1
    goto :LOOP_GRP
)
if not exist "%xRM_TMPPATH%" md "%xRM_TMPPATH%"
if DEFINED xRM_TCOMP (
    if /I %3 EQU %xRM_TCOMP% echo>>"%xRM_TMPPATH%\target.txt" %1,%xRM_R_PATH%,%~3
) else (
    echo>>"%xRM_TMPPATH%\target.txt" %1,%xRM_R_PATH%,%~3
)
exit /b 0


:Error
echo Error!
exit /b 1


REM ----------------------------------------------------------------------
:DisplayUsage
echo ----------------------------------------------------------------------
echo Usage: xRM_MakeLang LCID [options]
echo.
echo  LCID                  is a language code such as 1031 or 1036. specify all to process 
echo                        all language. (Required)
echo                        Specify All to process all languages
echo.
echo Options:
echo  /FullPL               indicates that all strings should be pseudo-localized.
echo                        With this option, the language-specific LCLs are not used. 
echo                        The build kit uses generic PL LCLs in conjunction with
echo                        language-specific LSS settings.
echo.
echo  /handoff              For IPE use only.
echo                        With this option, Base file and Master files will be copied to 
echo                        Temp folder and can be used for localization hand off.
echo.
echo  /component compname   indicates generate target solution only. (Optional)
echo                        If omitted, all solution will be processed and generated.
echo.
echo.
echo Example:
echo        xRM_MakeLang 1036 /FullPL
echo          - Result = Generate French Pseudo for all the files exposed to localization.
echo.
echo        xRM_MakeLang All /component OmnichannelBase\Client
echo          - Result = Genererate all the target file under OmnichannelBase\Client for all languages.
echo.
exit /b 1