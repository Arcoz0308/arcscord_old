import { APIMessage } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../client.ts';
import { Snowflake } from '../utils/snowflake.ts';
import { Base } from './base.ts';


/**
 * @category Structures
 */
export class Message extends Base {
    public id: Snowflake;
    public channelId: Snowflake;
    
    constructor(client: Client, data: APIMessage) {
        super(client);
        this.id = data.id;
        this.channelId = data.channel_id;
    }
}

export interface MessageOptions {
}

export interface MessageOptionsWithContent extends MessageOptions {
    content?: string;
}
