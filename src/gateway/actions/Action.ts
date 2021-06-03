import { Client } from '../../Client';

export class Action {
    public client: Client;

    constructor(client: Client) {
        this.client = client;
    }
}
