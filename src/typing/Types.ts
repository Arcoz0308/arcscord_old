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
    competing = 5
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

export type PresenceStatus = "online" | "dnd" | "idle" | "invisible" | "offline";
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

export type imageFormats = "jpg" | "png" | "webp" | "gif";
export type imageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export interface ImageUrlOptions {
    /**
     * the format of the image
     * @default jpg
     */
    format?: imageFormats;
    /**
     * the size of the image
     * @default 4096
     */
    size?: imageSize;
    /**
     * if the avatar are animated give gif url
     * @default false
     */
    dynamic?: boolean;
}