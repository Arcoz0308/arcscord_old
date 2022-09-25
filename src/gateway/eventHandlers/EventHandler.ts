import { Client } from '../../Client';


export abstract class EventHandler {
    public client: Client;
    
    constructor(client: Client) {
        this.client = client;
    }
    
    abstract handle(d: any): Promise<void>
}
