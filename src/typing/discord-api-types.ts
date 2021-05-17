/**
 * list of activity types
 */
export enum ActivityType {
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
/**
 * a presence object
 * @interface
 */
export interface Presence {
    /**
     * Unix time (in milliseconds) of when the client went idle, or `null` if the client is not idle
     */
    since?: number | null;
    /**
     * The user's activities
     *
     * See https://discord.com/developers/docs/topics/gateway#activity-object
     */
    activities: Activity[];
    /**
     * The user's new status
     *
     * See https://discord.com/developers/docs/topics/gateway#update-status-status-types
     */
    status: "online"|"dnd"|"idle"|"invisible"|"offline";
    /**
     * Whether or not the client is afk. default false
     */
    afk?: boolean;
}



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
     * See https://discord.com/developers/docs/topics/gateway#activity-object-activity-types
     */
    type: keyof typeof ActivityType;
    /**
     * Stream url (only with type Streaming)
     */
    url?: string;
}