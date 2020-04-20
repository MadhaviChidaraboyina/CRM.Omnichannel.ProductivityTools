#
# This script generate catalog.
#

param ([parameter(HelpMessage="Input path.")]
       [string]$inputPath,
       [parameter(HelpMessage="Path to catalog file to be generated.")]
       [string]$catalogPath
)

function GenerateCatalog
{
    param ([ValidateNotNullOrEmpty()]
           [string] $inputPath,
           [ValidateNotNullOrEmpty()]
           [string] $catalogPath
    )

    if ([string]::IsNullOrWhitespace($inputPath))
    {
        throw "ERROR: Input path is invalid. Catalog will not be generated."
    }
    if ([string]::IsNullOrWhitespace($catalogPath))
    {
        throw "ERROR: Catalog path is invalid. Catalog will not be generated for $inputPath."
    }
    if (-not (Test-Path -Path $inputPath))
    {
        throw "ERROR: Input path does not exist: $inputPath. Catalog will not be generated for $inputPath."
    }

    Write-Host "Generating catalog for $inputPath..."

    # Catalog Cmdlets https://docs.microsoft.com/en-us/powershell/wmf/5.1/catalog-cmdlets
    # Version 1 uses SHA1 hashing algorithm to create file hashes and version 2 uses SHA256. 
    # Catalog version 2.0 is not supported on Windows Server 2008 R2 and Windows 7. 
    # It is recommended to use catalog version 2 if using platforms Windows 8, Windows Server 2012 and above.
    New-FileCatalog -CatalogFilePath "$catalogPath" -Path "$inputPath" -CatalogVersion 2.0

    if (-not (Test-Path -Path $catalogPath))
    {
        throw "ERROR: Catalog was not generated: $catalogPath."
    }
}

#main
$ErrorActionPreference = "Stop"

try
{
    GenerateCatalog -inputPath "$inputPath" -catalogPath "$catalogPath"
}
catch [exception]
{
    $_.Exception | Format-List -force
    Write-Host "ERROR: Failed to generate catalog file for $inputPath."

    exit 1
}

Write-Host "Catalog has been generated: $catalogPath."

exit 0