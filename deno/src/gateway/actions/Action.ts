import { Client } from '../../Client.ts';


export class Action {
    public client: Client;
    
    constructor(client: Client) {
        this.client = client;
    }
}
