@rem
@rem Usage:
@rem GenerateCvrp.cmd <BcdtManifestPath> <LocalOutputRoot> <ReleaseOutputRoot>
@rem

@rem
@rem Sample usage:
@rem GenerateCvrp.cmd e:\drops\git_cloudvault_develop\2.5.0.249\retail-amd64\BCDTManifest\blackforest.xml e:\drops\git_cloudvault_develop\2.5.0.249 \\reddog\builds\branches\git_cloudvault_develop\2.5.0.249
@rem
@rem

:Main
  @setlocal enabledelayedexpansion
      @echo Setting defaults...
      @call :SetDefaults
      @call :ParseArgs %* || exit /b 1
      @call :ValidateParameters || (
        echo "Parameters validation failed"
        call :help 
        exit /b 1
      )

      @echo Converting BCDT manifest to CVRP...
      @call :ConvertBcdtManifestToCvrp || (
        exit /b 1
      )
      
      @if exist %cvrpPath% (
        echo Generating catalog for CVRP...
        call :GenerateCatalogForCvrp || (
          @rem Do not fail the script if GenerateCatalogForCvrp fails.
          exit /b 0
        )
      )
  @endlocal enabledelayedexpansion
@exit /b 0

:help
  @echo Usage:
  @echo GenerateCvrp.cmd ^<BcdtManifestPath^> ^<LocalOutputRoot^> ^<ReleaseOutputRoot^>
@goto :EOF

:SetDefaults
  @set RequiredParams= ^
    bcdtManifestPath ^
    cvrpPath ^
    cvrpDropFolderPath ^
    localOutputRoot ^
    releaseOutputRoot
@exit /b 0

:ParseArgs
  @if "%~1"=="\?" (
    call :help
    exit /b 1
  )
  @if "%~1"=="\h" (
    call :help
    exit /b 1
  )

  @if not "%~1"=="" (
    set bcdtManifestPath=%~dpnx1
    set cvrpPath=%~dpn1.cvrp
    set catalogPath=%~dpn1.cat
    set cvrpDropFolderPath=%~dp1
  )

  @if not "%~2"=="" set localOutputRoot=%~dpnx2
  @if not "%~3"=="" set releaseOutputRoot=%~dpnx3
@exit /b 0

:ValidateParameters
  @for %%i in (%RequiredParams%) do @(
    if not defined %%~i (
      echo ERROR: Required parameter %%~i is not set.
      @exit /b 1
    )
  )
@exit /b 0

:ConvertBcdtManifestToCvrp
  @call powershell.exe -NoProfile -NoLogo -NonInteractive -ExecutionPolicy ByPass -Command "%~dp0GenerateCvrp.ps1 -manifest '%bcdtManifestPath%' -cvrpPath '%cvrpPath%' -cvrpDropFolderPath '%cvrpDropFolderPath%' -localOutputRoot '%localOutputRoot%'  -releaseOutputRoot '%releaseOutputRoot%'" || (
    echo ERROR: Failed to convert BCDT manifest %bcdtManifestPath% to CVRP %cvrpPath%.
    exit /b 1
  )
@goto :EOF

:GenerateCatalogForCvrp
  @call powershell.exe -NoProfile -NoLogo -NonInteractive -ExecutionPolicy ByPass -Command "%~dp0GenerateCatalog.ps1 -inputPath '%cvrpPath%' -catalogPath '%catalogPath%'" || (
    echo ERROR: Failed to generate catalog for CVRP %cvrpPath%.
    exit /b 1
  )
@goto :EOF
