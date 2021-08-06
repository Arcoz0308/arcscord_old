import { APIMessage } from 'discord-api-types';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';


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
