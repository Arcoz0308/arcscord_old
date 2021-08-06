import { Client } from '../Client';


/**
 * @category Structures
 */
export abstract class Base {
    public readonly client: Client;
    
    protected constructor(client: Client) {
        this.client = client;
    }
}
