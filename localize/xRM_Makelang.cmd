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
if NOT DEFINED PKG_JSON (
    pushd %inetroot% 
    call init.cmd
    popd
)
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
    if /i "%%~xi"==".json" (
        set xRM_SRC=!xRM_TRG:json=xml!
        if exist "%xRM_SRCPATH%\!xRM_TRG!" del "%xRM_SRCPATH%\!xRM_TRG!" /f /q
        call powershell -noprofile %~dp0DataXml2json.ps1 -mode generate -sourceDataxmlPath %xRM_SRCPATH%\!xRM_SRC! -referenceFilePath %~dp0%%~ni_rules.xml -jsonFilePath %xRM_SRCPATH%\!xRM_TRG!
    )
    call :Get_RelativePath "%xRM_SRCPATH%\%%i" %xRM_charcount% "%%j"
)
endlocal

if /i "All"=="%xRM_LCID%" (
    for /f "tokens=1,2" %%i in (%~dp0xRM_language.txt) do (
        set xRM_LCID=%%i
        set xRM_CULTURE_NAME=%%j
        call :RunlsBuild
        set xRM_BASEDONE=true
    )
    call :lsBuildGenerate lsbuild.response
    call :RunCmd genXML.cmd
    call :RunCmd copytarget.cmd
) else (
    for /f "tokens=1,2" %%i in (%~dp0xRM_language.txt) do (
        if "%%i" == "%xRM_LCID%" (
            call :RunlsBuild
        )
    )
    call :lsBuildGenerate lsbuild.response
    call :RunCmd genXML.cmd
    call :RunCmd copytarget.cmd
)
exit /b

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
                if /i "%%~xo"==".json" ( set xRM_PARSER=306 )

                REM Does 'basepath' has a trailing slash? if so remove it 
                set xRM_SOURCE_BASEPATH=%%~dpo
                if !xRM_SOURCE_BASEPATH:~-1!==\ ( set xRM_SOURCE_BASEPATH=!xRM_SOURCE_BASEPATH:~0,-1! )

                REM Genereate base lcl
                echo *** call %PKG_LSBUILD%\lsbuild parse /p !xRM_PARSER! /o "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" /s "%xRM_LOCPATH%\Base\%xRM_PNAME%\LSS\lss.lss" /basepath "!xRM_SOURCE_BASEPATH!" !xRM_FILE!
                echo.
                call %PKG_LSBUILD%\lsbuild parse /p !xRM_PARSER! /o "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" /s "%xRM_LOCPATH%\Base\%xRM_PNAME%\LSS\lss.lss" /basepath "!xRM_SOURCE_BASEPATH!" !xRM_FILE!

                REM Genereate target lcl
                for /f "tokens=1,2" %%i in (%~dp0xRM_language.txt) do (
                    set LCID=%%i
                    set LL-CC=%%j

                    REM replace 'sr-Latn-RS', 'sr-Cyrl-RS' with 'sr-Latn-CS', 'sr-Cyrl-CS' respectively since D635_CE has only CS based locales
                    if "%%j"=="sr-Latn-RS" ( set LL-CC=sr-Latn-CS )
                    if "%%j"=="sr-Cyrl-RS" ( set LL-CC=sr-Cyrl-CS )

                    REM generate twice
                    REM 1. under 'Localize\Temp\[ll-cc]' to copy to 'D365_CE' repo
                    REM 2. under 'Localize\Extern\[lcid]' to copy to core team repo
                    REM After the change to stop checking in lcl files to core team repo, not all languages lcl files are available since 'Localize\Extern\ folder deleted
                    REM and we only copy Base and one language ('1031') while running 'xx_makelang.cmd 1031 /handoff' so use 'Base\%xRM_PNAME%\LSS\lss.lss' to generate language lcl files for new files
                    call %PKG_LSBUILD%\lsbuild generate /w 0 /d !LCID! /o %xRM_TMPPATH%\Output\!xRM_FILE! /s "%xRM_LOCPATH%\Base\%xRM_PNAME%\LSS\lss.lss" /ol "%xRM_LOCPATH%\!LCID!\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" /basepath "!xRM_SOURCE_BASEPATH!" !xRM_FILE!
                    call %PKG_LSBUILD%\lsbuild generate /w 0 /d !LL-CC! /o %xRM_TMPPATH%\Output\!xRM_FILE! /s "%xRM_LOCPATH%\Base\%xRM_PNAME%\LSS\lss.lss" /ol "%xRM_TMPPATH%\!LL-CC!\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" /basepath "!xRM_SOURCE_BASEPATH!" !xRM_FILE!
                )
            )
        )

        if exist "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" (
            REM Just need to copy the source file to Master folder once so check if the source file exists in Master folder
            if not exist %xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\!xRM_FILE! (
                echo "Copy the source file (%%~do%%~po!xRM_FILE!) to Master folder (%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!)"
                if /i "%%~xo"==".json" (
                    call robocopy "%%~do%%~po\" "%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\" !xRM_FILE! /MOV
                ) else (
                    call robocopy "%%~do%%~po\" "%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\" !xRM_FILE!
                )
            )

            REM Set LSBuild Parser and Target file name
            REM Default to RESX Parser
            set xRM_PARSER=211

            if /i "%%~xo"==".json" (
                set xRM_PARSER=306
                set xRM_PATH=!xRM_PATH:1033=%xRM_LCID%!
                set xRM_TARGET=!xRM_TARGET:1033=%xRM_LCID%!
                set xRM_TARGET=!xRM_TARGET:json=xml!
                set xRM_TARGETFILE=!xRM_FILE:json=xml!
            )
            if not "!xRM_FILE:1033=!" == "!xRM_FILE!" (
                set xRM_TARGETFILE=!xRM_FILE:1033=%xRM_LCID%!
                set xRM_TARGET=!xRM_TARGET:1033=%xRM_LCID%!
            ) else (
                if not "!xRM_FILE:en-US=!" == "!xRM_FILE!" (
                    set xRM_TARGETFILE=!xRM_FILE:en-US=%xRM_CULTURE_NAME%!
                    set xRM_PATH=!xRM_PATH:en-US=%xRM_CULTURE_NAME%!
                    set xRM_TARGET=!xRM_TARGET:en-US=%xRM_CULTURE_NAME%!
                ) else (
                    if /i "!xRM_PATH:CmtDataFiles\data_=!" == "!xRM_PATH!" (
                        REM 'CmtDataFiles\data_[lcid]\data.xml' file name doesn't change so only if path doesn't contain 'CmtDataFiles\data_',
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
                if NOT EXIST %xRM_SRCPATH%!xRM_PATH! md %xRM_SRCPATH%!xRM_PATH!
                if /i "%%~xo"==".json" (
                    REM Generate PowerShell command to generate dataxml
                    set xRM_SOURCE=!xRM_SOURCE:json=xml!
                    echo call powershell -noprofile %~dp0DataXml2json.ps1 -mode importjson -sourceDataxmlPath "!xRM_SOURCE!" -referenceFilePath %~dp0%%~no_rules.xml -jsonFilePath "%xRM_TMPPATH%\%xRM_LCID%\!xRM_PATH!\!xRM_FILE!" -outputDataXmlPath !xRM_TARGET!>>%xRM_TMPPATH%\genXML.cmd
                ) else ( 
                    REM Generate copy command
                    echo call copy "%xRM_TMPPATH%\%xRM_LCID%!xRM_PATH!!xRM_FILE!" "!xRM_TARGET!" /Y>>%xRM_TMPPATH%\copytarget.cmd
                )
            ) else (
                if NOT DEFINED xRM_BASEDONE (
                    echo call robocopy "%xRM_LOCPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!LCL" "%xRM_TMPPATH%\Base\%xRM_PNAME%\!xRM_COMPNAME!LCL" !xRM_FILE!.lcl /s>>%xRM_TMPPATH%\copytarget.cmd
                )
            )
        )
    )
) else (
    echo Error - %xRM_TMPPATH%\target.txt not found
    exit /b
)
endlocal
goto :eof

:lsBuildGenerate
if EXIST %xRM_TMPPATH%\%1 (
    echo call %PKG_LSBUILD%\lsbuild response %xRM_TMPPATH%\%1
    call %PKG_LSBUILD%\lsbuild response %xRM_TMPPATH%\%1
) else (
    if NOT DEFINED xRM_EXTRACT (
        echo Error - Solution Name does not exist
    )
    exit /b
)
goto :eof


REM ----------------------------------------------------------------------
REM RunCmd
:RunCmd

REM Copy to final destination
if exist %xRM_TMPPATH%\%1 call %xRM_TMPPATH%\%1

echo.
echo Process completed.
echo.

goto :eof


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
goto :eof


:Get_CharCount
set s=%1
set xRM_charcount=0
:LOOP_GCC
if defined s (
    set s=%s:~1%
    set /a xRM_charcount+=1
    goto :LOOP_GCC
)
exit /b



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
exit /b


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