import {ActivityType} from "discord-api-types/payloads/v8/gateway";

export interface AGatewayPresenceUpdateData {
    /**
     * Unix time (in milliseconds) of when the client went idle, or `null` if the client is not idle
     */
    since?: number | null;
    /**
     * The user's activities
     *
     * See https://discord.com/developers/docs/topics/gateway#activity-object
     */
    activities: AGatewayActivityUpdateData[];
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
export type AGatewayActivityUpdateData = AGatewayActivityUpdateDataNormal|AGatewayActivityUpdateDataStreaming;
export interface AGatewayActivityUpdateDataNormal {
    /**
     * The activity's name
     */
    name: string;
    /**
     * Activity type
     *
     * See https://discord.com/developers/docs/topics/gateway#activity-object-activity-types
     */
    type: keyof typeof AActivityTypeWithoutStreaming |AActivityTypeWithoutStreaming;
}
export interface AGatewayActivityUpdateDataStreaming {
    /**
     * The activity's name
     */
    name: string;
    /**
     * Activity type
     *
     * See https://discord.com/developers/docs/topics/gateway#activity-object-activity-types
     */
    type: "Streaming"|ActivityType.Streaming;
    /**
     * Stream url
     */
    url?: string;
}
export enum AActivityTypeWithoutStreaming {
    /**
     * Playing {game}
     */
    Game = 0,
    /**
     * Listening to {name}
     */
    Listening = 2,
    /**
     * Watching {details}
     */
    Watching = 3,
    /**
     * {emoji} {details}
     */
    Custom = 4,
    /**
     * Competing in {name}
     */
    Competing = 5
}