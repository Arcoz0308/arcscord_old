import { Client } from '../Client.ts';


/**
 * @category Structures
 */
export abstract class Base {
    public readonly client: Client;

    protected constructor(client: Client) {
        this.client = client;
    }
}
