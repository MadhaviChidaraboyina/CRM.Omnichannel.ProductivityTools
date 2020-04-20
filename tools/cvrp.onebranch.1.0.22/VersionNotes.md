## Release Notes:

### 1.0.19
 - Use BinariesDirectory as LocalOutputRoot for both BuildTracker and CloudBuild builds.
### 1.0.18
 - Fix catalog name.
### 1.0.17
 - Change cvrp and cat files paths to relative in replication manifests when generating cvrp by paths.
### 1.0.16
 - Support SHA512 and SHA1.
### 1.0.15
 - Trim CvrpDropFolderPath inside the target in case customer override it.
### 1.0.14
 - Fail build if CVRP fails to generate.
### 1.0.13
 - Compute SHA256 hash of composition items if the hash algorithm is different.
### 1.0.12
 - Add a standalone script to generate CVRP by path.
### 1.0.9
 - Improve folder layout for CVRP and catalog files.
### 1.0.8
 - Support redefined BinariesBuildTypeArchDirectory to not virtualized path in CloudBuild.
### 1.0.7
 - Change default catalog name for customers outside of OneBranch.
### 1.0.6
 - Output creation of directory to null to avoid junk data in CVRP.
### 1.0.5
 - Flip backslashes in catalog paths.
### 1.0.3
 - Use PowerShell Cmdlets instead of makecat tool to create CVRP catalogs.
### 1.0.0.11
 - Improve documentation.
### 1.0.0.10
 - Add BCDT to CVRP standalone conversion script for customers outside of OneBranch.
### 1.0.0.9
 - Add creation of target folders for CVRP and cat files if they do not exist.
### 1.0.0.8
 - Remove redundant slash at the end of the cvrp and catalog drop paths.
### 1.0.0.7
 - Fix CVRP for CloudBuild.
### 1.0.0.6
 - Fix Cdf full path. Filter out duplicates in CVRP paths.
### 1.0.0.5
 - Set Powershell path even if it is already defined.
### 1.0.0.4
 - Do not fail CVRP if mandatory parameters are not defined.
### 1.0.0.3
 - Remove redundant dependency on WindowsSdk.Corext package.
### 1.0.0.2
 - Do not fail CVRP targets when BCDT manifest does not exist or fails to generate.
### 1.0.0.1
 - Add MakeCat tool to the package from WindowsSdk.Corext.6.3.9600.6.
### 1.0.0.0
 - Initial implementation.