import { APIMessage } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../Client.ts';
import { Snowflake } from '../utils/Snowflake.ts';
import { Base } from './Base.ts';


/**
 * @category Structures
 */
export class Message extends Base {
    public id: Snowflake;
    public channelId: Snowflake;
    
    constructor(client: Client, data: APIMessage) {
        super(client);
        this.id = data.id as Snowflake;
        this.channelId = data.channel_id as Snowflake;
    }
}

export interface MessageOptions {
}

export interface MessageOptionsWithContent extends MessageOptions {
    content?: string;
}
