export interface OCCustomer {
    displayName: string,
    senderId: string
}

export class Customer implements OCCustomer {
    public displayName: string;
    public senderId: string;
    
    constructor(id: string, name: string) {
        this.displayName = name;
        this.senderId = id;
    }
}

export class WeChatCustomer implements OCCustomer {
    public displayName: string;
    public senderId: string;

    constructor(senderId: string) {
        this.displayName = senderId;
        this.senderId = senderId;
    }
}