export interface Root {
    LiveChat: LiveChat
    ChannelIntegration: ChannelIntegration
    AppProfile: AppProfile
  }
 
  export interface Users {
    Users: User[]
  }
 
  export interface LiveChat extends Users {
  }
  
  export interface ChannelIntegration extends Users{
  }
    
  export interface AppProfile extends Users{
  }

  export interface User {
    ChannelAreas: string[]
    UserRoles: string[]
    UserEmailAlias: string
  }
  