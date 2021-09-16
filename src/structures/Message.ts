import { APIMessage } from 'discord-api-types/v9';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';


/**
 * @category Structures
 */
export class Message extends Base {
    
    public id!: Snowflake;
    public channelId!: Snowflake;
    
    constructor(client: Client, data: APIMessage) {
        super(client);
        this._patchData(data);
    }
    
    _patchData(data: APIMessage) {
        this.id = data.id as Snowflake;
        this.channelId = data.channel_id as Snowflake;
    }
}

export interface MessageOptions {
}

export interface MessageOptionsWithContent extends MessageOptions {
    content?: string;
}
