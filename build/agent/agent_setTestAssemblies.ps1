param(
	[string]$executionRoute = "route1"
)

$executionRoute = $executionRoute.ToLower()

switch ($executionRoute) 
{ 
	"route1" { $assemblies = "**\drop\tests\SolutionCommon.Xrm.IntegrationTests.dll" }
	"route2" { $assemblies = "**\drop\tests\CRM.Xrm.IntegrationTests.dll" }
	"route3" { $assemblies = "**\drop\tests\Microsoft.Dynamics.CRMNotifications.dll" }
	default { $assemblies = "**\drop\tests\*.Xrm.IntegrationTests.dll" }
}

Write-Host("##vso[task.setvariable variable=TestAssemblies;]" + $assemblies)
"TestAssemblies variable has been set to '" + $assemblies + "'"