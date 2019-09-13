@echo off
REM ----------------------------------------------------------------------
REM Microsoft CRM International Build Kit for CRM.Solutions.ChannelApiFramework
REM xRM_MakeLang.cmd
REM ----------------------------------------------------------------------

echo.
echo Microsoft (R) CRM International Build Kit for CRM.Solutions.ChannelApiFramework
echo Copyright (C) Microsoft Corporation 2002-2018. All rights reserved.
echo.


REM Check command-line parameters
REM ----------------------------------------------------------------------

if "%1"=="/?" goto :DisplayUsage
if "%1"=="" goto :DisplayUsage


REM ----------------------------------------------------------------------

call :ParseArguments %*

REM init
set xRM_PNAME=CRM.Solutions.ChannelApiFramework
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
REM - xRM_LANG=ar

set xRM_LCID=%1

for /f "usebackq  eol=! tokens=1,2,3 delims= " %%i in (%~dp0xRM_language.txt) do (
   if "%%i"=="%xRM_LCID%" (
       set xRM_CULTURE_NAME=%%j
       set xRM_LANG=%%k
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
set inetroot=%inetroot:\tools\Localize\=%
set PKG_LSBUILD=%inetroot%\packages\LSBuild.Corext.6.12.4929.5

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
for /f "usebackq  eol=! tokens=1 delims=" %%i in (%~dp0XRM_filelist.txt) do (
    call :Get_RelativePath "%xRM_SRCPATH%\%%i" %xRM_charcount%
)
endlocal

if /i "All"=="%xRM_LCID%" (
    for /f "tokens=1,2,3" %%i in (%~dp0xRM_language.txt) do (
        set xRM_LCID=%%i
        set xRM_CULTURE_NAME=%%j
        set xRM_LANG=%%k
        call :RunlsBuild
        set xRM_BASEDONE=true
    )
    call :lsBuildGenerate lsbuild.response
    call robocopy "%xRM_LOCPATH%\Base\%xRM_PNAME%" "%xRM_TMPPATH%\Base\%xRM_PNAME%" *.lcl /s
    call :RunCmd copytarget.cmd
) else (
    for /f "tokens=1,2,3" %%i in (%~dp0xRM_language.txt) do (
        if "%%i" == "%xRM_LCID%" (
            call :RunlsBuild
        )
    )
    call :lsBuildGenerate lsbuild.response
    call robocopy "%xRM_LOCPATH%\Base\%xRM_PNAME%" "%xRM_TMPPATH%\Base\%xRM_PNAME%" *.lcl /s
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

for /f "tokens=1,2 delims=," %%o in (%xRM_TMPPATH%\target.txt) do (
    set xRM_PATH=%%p
    set xRM_FILE=%%~no%%~xo
    set xRM_SOURCE=%%o
    set xRM_TARGET=%%o
    set xRM_COMPNAME=CIFramework\
    if not "!xRM_PATH:ScenarioConfiguration=!"=="!xRM_PATH!" (
        set xRM_COMPNAME=ScenarioConfiguration\
    ) 
	
    if exist "%xRM_LOCPATH%\%xRM_LCID%\%xRM_PNAME%\!xRM_COMPNAME!\LCL\!xRM_FILE!.lcl" (
        if NOT DEFINED xRM_BASEDONE (
            REM ExtractOnly - Copy the source file to Master folder
            echo "Extracting source"
            call robocopy "%%~do%%~po\" "%xRM_TMPPATH%\Master\%xRM_PNAME%\!xRM_COMPNAME!\" !xRM_FILE!
        )
        REM Set LSBuild Parser and Target file name
        REM Default to RESX Parser
        set xRM_PARSER=211
        if not "!xRM_FILE:1033=!" == "!xRM_FILE!" (
            set xRM_TARGETFILE=!xRM_FILE:1033=%xRM_LCID%!
            set xRM_TARGET=!xRM_TARGET:1033=%xRM_LCID%!
        ) else (
            if not "!xRM_FILE:en-US=!" == "!xRM_FILE!" (
                set xRM_TARGETFILE=!xRM_FILE:en-US=%xRM_CULTURE_NAME%!
                set xRM_PATH=!xRM_PATH:en-US=%xRM_CULTURE_NAME%!
                set xRM_TARGET=!xRM_TARGET:en-US=%xRM_CULTURE_NAME%!
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
            if NOT EXIST %xRM_SRCPATH%!xRM_PATH! md %xRM_SRCPATH%!xRM_PATH!
            echo call copy "%xRM_TMPPATH%\%xRM_LCID%!xRM_PATH!!xRM_FILE!" !xRM_TARGET! /Y>>%xRM_TMPPATH%\copytarget.cmd
        )
    )
)

endlocal
goto :eof

:lsBuildGenerate
if EXIST %xRM_TMPPATH%\%1 (
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
        ) else (
            if /i "%~1" EQU "/path" (
                if "%~2"=="" goto :DisplayUsage
                set xRM_SRCPATH=%~2
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
    echo>>"%xRM_TMPPATH%\target.txt" %1,%xRM_R_PATH%
exit /b


REM ----------------------------------------------------------------------
:DisplayUsage
echo ----------------------------------------------------------------------
echo Usage: xRM_MakeLang LCID [options]
echo.
echo        LCID            is a language code such as 1031 or 1036. specify all to process 
echo                        all language. (Required)
echo                        Specify All to process all languages
echo.
echo Options:
echo        /FullPL         indicates that all strings should be pseudo-localized.
echo                        With this option, the language-specific LCLs are not used. 
echo                        The build kit uses generic PL LCLs in conjunction with
echo                        language-specific LSS settings.
echo.
echo        /handoff        For IPE use only.
echo                        With this option, Base file and Master files will be copied to 
echo                        Temp folder and can be used for localization hand off.
echo.
echo        /path folder    indicates root folder which contains target files. (Optional)
echo                        If omitted, default path (%inetroot%\src) will be used and process
echo                        all the files exposed to localization.  
echo.
echo.
echo Example:
echo        xRM_MakeLang 1036 /FullPL
echo          - Result = Generate French Pseudo for all the files exposed to localization.
echo.
echo        xRM_MakeLang All /path c:\foo\ver
echo          - Result = Genererate all the target file under c:\foo\ver for all languages.
echo.
exit /b 1