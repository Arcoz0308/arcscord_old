import { APIUser } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../client.ts';
import { DEFAULT_USER_AVATAR, USER_AVATAR } from '../rest/endpoints.ts';
import { getDate, Snowflake } from '../utils/snowflake.ts';
import { ImageUrlOptions } from '../utils/utils.ts';
import { Base } from './base.ts';


/**
 * @category Structures
 */
export class User extends Base {
    /**
     * the id of the user
     */
    public id: Snowflake;
    
    /**
     * hash of user avatar
     */
    public avatar: string | null;
    
    /**
     * username of the user
     */
    public username: string;
    
    /**
     * discriminator of the user
     */
    public discriminator: string;
    
    /**
     * tag of the user (username#descriminator)
     */
    public tag: string;
    
    /**
     * if the user is a bot
     */
    public bot: boolean;
    
    /**
     * if the user are a official discord system user
     */
    public system: boolean;
    
    /**
     * the date of the user account was created in timestamp
     */
    public readonly createAt: number;
    
    /**
     * user public's flags
     */
    public publicFlags: number;
    
    /**
     *
     * @param client
     * @param data
     */
    constructor(client: Client, data: APIUser) {
        super(client);
        
        // init data
        this.id = data.id;
        this.avatar = data.avatar;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.tag = `${data.username}#${data.discriminator}`;
        this.bot = !!data.bot;
        this.system = !!data.system;
        this.createAt = getDate(data.id);
        this.publicFlags = data.public_flags ? data.public_flags : 0;
    }
    
    /**
     * get avatar URL
     * @param format the format of image
     * @param size the size of image
     * @param dynamic if the avatar are animated give gif
     */
    avatarURL({ format, size, dynamic }: ImageUrlOptions): string {
        if (!format) format = 'jpg';
        if (!size) size = 4096;
        if (!dynamic) dynamic = false;
        if (!this.avatar)
            return DEFAULT_USER_AVATAR(`${parseInt(this.discriminator, 10) % 5}`);
        if (dynamic && this.avatar && this.avatar.startsWith('a_')) format = 'gif';
        return USER_AVATAR(this.id, this.avatar, format, size);
    }
    
    toString() {
        return `<@${this.id}>`;
    }
    
    toJSON(space = 1): string {
        return JSON.stringify({
            id: this.id,
            username: this.username,
            discriminator: this.discriminator,
            avatar: this.avatar,
            bot: this.bot,
            system: this.system,
            createAt: this.createAt,
            public_flags: this.publicFlags
        }, null, space);
    }
}

/**
 * list of activity types
 */
export enum ActivityTypes {
    /**
     * Playing {game}
     */
    game = 0,
    /**
     * Streaming {details}
     */
    streaming = 1,
    /**
     * Listening to {name}
     */
    listening = 2,
    /**
     * Watching {details}
     */
    watching = 3,
    /**
     * {emoji} {details}
     * WARNING : don't work for bots
     */
    custom = 4,
    /**
     * Competing in {name}
     */
    competing = 5,
}

export type ActivityType = keyof typeof ActivityTypes;

/**
 * a presence object
 * @interface
 */
export interface Presence {
    /**
     * The user's activities
     *
     * See https://discord.com/developers/docs/topics/gateway#activity-object
     */
    activity?: Activity;
    /**
     * The user's new status
     *
     * See https://discord.com/developers/docs/topics/gateway#update-status-status-types
     */
    status?: PresenceStatus;
    /**
     * Whether or not the client is afk. default false
     */
    afk?: boolean;
}

export type PresenceStatus =
    | 'online'
    | 'dnd'
    | 'idle'
    | 'invisible'
    | 'offline';

/**
 *
 */
export interface Activity {
    /**
     * The activity's name
     */
    name: string;
    /**
     * Activity type
     *
     * @see https://discord.com/developers/docs/topics/gateway#activity-object-activity-types
     * @default "game"
     */
    type?: ActivityType;
    /**
     * Stream url (only with type Streaming)
     */
    url?: string;
}
