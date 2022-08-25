import { Client } from '../../Client';


export class EventHandler {
    public client: Client;
    
    constructor(client: Client) {
        this.client = client;
    }
}
