param(
		[string]$toolsPackage = "$env:PKG_XRMAPP_TOOLS",
		[string]$agentUtilities = "$env:XrmSolutionsRoot\build\agent\AgentUtilities.exe",
		[string]$excludePathsFile = "$env:PKG_XRMAPP_TOOLS\build\config\pathExclude.txt"
)

& $agentUtilities cleanpath "$env:PATH" $excludePathsFile > temp.txt
$cleanedPath = Get-Content temp.txt
Remove-Item temp.txt 

$newPath = "$($cleanedPath);$($toolsPackage)\tools\commands\;$($toolsPackage)\tools\ImportSolution\"
$newPath
