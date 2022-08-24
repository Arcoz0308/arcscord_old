/**
 * list of intents
 * @see https://discord.com/developers/docs/topics/gateway#list-of-intents
 */
export enum Intents {
    /**
     * include events :
     * - GUILD_CREATE
     * - GUILD_UPDATE
     * - GUILD_DELETE
     * - GUILD_ROLE_CREATE
     * - GUILD_ROLE_UPDATE
     * - GUILD_ROLE_DELETE
     * - CHANNEL_CREATE
     * - CHANNEL_UPDATE
     * - CHANNEL_DELETE
     * - CHANNEL_PINS_UPDATE
     * - THREAD_CREATE
     * - THREAD_UPDATE
     * - THREAD_DELETE
     * - THREAD_LIST_SYNC
     * - THREAD_MEMBER_UPDATE
     * - THREAD_MEMBERS_UPDATE
     */
    GUILDS = 1,
    /**
     * include events :
     * - GUILD_MEMBER_ADD
     * - GUILD_MEMBER_UPDATE
     * - GUILD_MEMBER_REMOVE
     * - THREAD_MEMBERS_UPDATE
     */
    GUILD_MEMBERS = 2,
    /**
     * include events :
     * - GUILD_BAN_ADD
     * - GUILD_BAN_REMOVE
     */
    GUILD_BANS = 4,
    /**
     * include event :
     * GUILD_EMOJIS_UPDATE
     */
    GUILD_EMOJIS = 8,
    /**
     * include events :
     *  - GUILD_INTEGRATIONS_UPDATE
     * - INTEGRATION_CREATE
     * - INTEGRATION_UPDATE
     * - INTEGRATION_DELETE
     */
    GUILD_INTEGRATIONS = 16,
    /**
     * include event :
     * - WEBHOOKS_UPDATE
     */
    GUILD_WEBHOOKS = 32,
    /**
     * include events
     * - INVITE_CREATE
     * - INVITE_DELETE
     */
    GUILD_INVITES = 64,
    /**
     * include event :
     * - VOICE_STATE_UPDATE
     */
    GUILD_VOICE_STATES = 128,
    /**
     * include event :
     * - PRESENCE_UPDATE
     */
    GUILD_PRESENCES = 256,
    /**
     * include events
     * - MESSAGE_CREATE
     * - MESSAGE_UPDATE
     * - MESSAGE_DELETE
     * - MESSAGE_DELETE_BULK
     */
    GUILD_MESSAGES = 512,
    /**
     * include events :
     * - MESSAGE_REACTION_ADD
     * - MESSAGE_REACTION_REMOVE
     * - MESSAGE_REACTION_REMOVE_ALL
     * - MESSAGE_REACTION_REMOVE_EMOJI
     */
    GUILD_MESSAGE_REACTIONS = 1024,
    /**
     * include event :
     * - TYPING_START
     */
    GUILD_MESSAGE_TYPING = 2048,
    /**
     * include events :
     * - MESSAGE_CREATE
     * - MESSAGE_UPDATE
     * - MESSAGE_DELETE
     * - CHANNEL_PINS_UPDATE
     */
    DIRECT_MESSAGES = 4096,
    /**
     * include events :
     * - MESSAGE_REACTION_ADD
     * - MESSAGE_REACTION_REMOVE
     * - MESSAGE_REACTION_REMOVE_ALL
     * - MESSAGE_REACTION_REMOVE_EMOJI
     */
    DIRECT_MESSAGE_REACTIONS = 8192,
    /**
     * include event :
     * - TYPING_START
     */
    DIRECT_MESSAGE_TYPING = 16384,
}

export const API_VERSION: number = 10;
