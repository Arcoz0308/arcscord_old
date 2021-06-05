import { APIApplicationCommand } from 'discord-api-types';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';


export class ApplicationCommand extends Base {
    public id: Snowflake;
    public data: APIApplicationCommand;

    constructor(client: Client, data: APIApplicationCommand) {
        super(client);
        this.data = data;
        this.id = data.id;
    }
}
