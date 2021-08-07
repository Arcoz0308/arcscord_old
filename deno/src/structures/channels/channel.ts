import { APIChannel} from 'https://raw.githubusercontent.com/Arcoz0308/discord-api-types/main/deno/v9.ts';
import { Client } from '../../client.ts';
import { Snowflake } from '../../utils/snowflake.ts';
import { Base } from '../base.ts';


export class Channel extends Base {
    public id: Snowflake;
    public readonly type: ChannelTypes;

    constructor(client: Client, data: APIChannel) {
        super(client);
        this.id = data.id;
        this.type = data.type as unknown as ChannelTypes;
    }

    get mention(): string {
        return `<#${this.id}>`;
    }
}

export enum ChannelTypes {
    TEXT_CHANNEL,
    DM_CHANNEL,
    VOICE_CHANNEL,
    GROUP_CHANNEL,
    CATEGORY_CHANNEL,
    NEWS_CHANNEL,
    STORE_CHANNEL,
    UNKNOWN,
    STAGE_CHANNEL = 13,
}