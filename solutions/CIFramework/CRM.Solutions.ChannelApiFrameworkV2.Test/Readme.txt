To run the CIF test case we have to add config file - TAConfig.config
Config file located in CRM.Solutions.ChannelApiFramework\solutions\CIFramework\CRM.Solutions.ChannelApiFramework.Test

1. init.cmd
2. msbuild

Default config path(CONFIG_PATH) fot ChannelApiFramework is target\debug\amd64
we have to copy that config file to CRM.Solutions.ChannelApiFramework\target\debug\amd64

Config File - TAConfig.config
we have to add OrgAdminUserName,OrgAdminPassword and ServerAddress - Machine name
OrgUniqueName - CITTest for OnPrem machine no need to add orgunique name for Online Env

Info: In CIF release pipeline we are building Channel API framework repo and using the artifacts generated to run the CIF test cases 
 
CIF Release pipeline link: https://dynamicscrm.visualstudio.com/DefaultCollection/OneCRM/_releaseDefinition?definitionId=2948&_a=definition-pipeline 
  
The Tasks that are part of the Pipeline are mentioned below 
1) In first task a Aurora Machine will be Checkout where the build artifacts and the Test artifacts will be extracted 
2) In "Create Org Json" task we are generating json file with parameters OrgUniqueName, OrgFriendlyName and JsonOutputPath 
3) In "Create Config file" task we are generating TA.config with paramters that have to be written. Which will be used by test cases when running to get any values. 
4) In "Set env variable" task we are getting the path to the TA.config 
5) In "Import CIF Solution" we are downloading the CIF solution that is part of artifacts and uploading the same to Server machine 
6) Now the task for Running test cases will run using dll

Trigger a Release  
1) Go to the CIF Release pipeline link https://dynamicscrm.visualstudio.com/OneCRM/_release?definitionId=2948 
2) Click on the Create a release button in the top menubar. 
3) Select the required_Microsoft.Dynamics.XrmSolution.Service version dropdown in Artifacts.  
4) In that dropdown, the versions will be listed with and without CALCIUMSERVICE. 
5) There select the latest version without CALCIUMSERVICE. 
6) Now click on the Create button.   
