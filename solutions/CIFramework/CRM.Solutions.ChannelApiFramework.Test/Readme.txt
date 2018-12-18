To run the CIF test case we have to add config file - TAConfig.config
Config file located in CRM.Solutions.ChannelApiFramework\solutions\CIFramework\CRM.Solutions.ChannelApiFramework.Test

1. init.cmd
2. msbuild

Default config path(CONFIG_PATH) fot ChannelApiFramework is target\debug\amd64
we have to copy that config file to CRM.Solutions.ChannelApiFramework\target\debug\amd64

Config File - TAConfig.config
we have to add OrgAdminUserName,OrgAdminPassword and ServerAddress - Machine name
OrgUniqueName - CITTest for OnPrem machine no need to add orgunique name for Online Env
