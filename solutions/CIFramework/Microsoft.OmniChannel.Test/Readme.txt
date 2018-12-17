To run the CIF test case we have to add config file - TAConfig.config
CRM.Solutions.ChannelApiFramework\solutions\CIFramework\Microsoft.OmniChannel.Test\CIFOCRunTestCases\TAConfig.config

1. init.cmd
2. msbuild

Default config path(CONFIG_PATH) fot ChannelApiFramework is target\debug\amd64
we have to copy that config file to CRM.Solutions.ChannelApiFramework\target\debug\amd64

Config File - TAConfig.config
we have to add OrgAdminUserName,OrgAdminPassword and ServerAddress - Machine name
OrgUniqueName
We have add

Credentials:  UserName,Domain : Env url,Password
AdminName,AdminPassword
UserName,UserPassword