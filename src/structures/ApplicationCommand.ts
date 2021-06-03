import { Base } from './Base';
import { Client } from '../Client';
import { APIApplicationCommand } from 'discord-api-types';
import { Snowflake } from '../utils/Utils';

export class ApplicationCommand extends Base {
    public id: Snowflake;
    public data: APIApplicationCommand;

    constructor(client: Client, data: APIApplicationCommand) {
        super(client);
        this.data = data;
        this.id = data.id;
    }
}
