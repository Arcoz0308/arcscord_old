import { APIMessage } from 'https://deno.land/x/discord_api_types/v9.ts';
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
        this.id = data.id;
        this.channelId = data.channel_id;
    }
}

export interface MessageOptions {
}

export interface MessageOptionsWithContent extends MessageOptions {
    content?: string;
}
