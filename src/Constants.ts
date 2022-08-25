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
    GUILDS = 1 << 0,
    /**
     * include events :
     * - GUILD_MEMBER_ADD
     * - GUILD_MEMBER_UPDATE
     * - GUILD_MEMBER_REMOVE
     * - THREAD_MEMBERS_UPDATE
     */
    GUILD_MEMBERS = 1 << 1,
    /**
     * include events :
     * - GUILD_BAN_ADD
     * - GUILD_BAN_REMOVE
     */
    GUILD_BANS = 1 << 2,
    /**
     * include event :
     * GUILD_EMOJIS_UPDATE
     */
    GUILD_EMOJIS = 1 << 3,
    /**
     * include events :
     *  - GUILD_INTEGRATIONS_UPDATE
     * - INTEGRATION_CREATE
     * - INTEGRATION_UPDATE
     * - INTEGRATION_DELETE
     */
    GUILD_INTEGRATIONS = 1 << 4,
    /**
     * include event :
     * - WEBHOOKS_UPDATE
     */
    GUILD_WEBHOOKS = 1 << 5,
    /**
     * include events
     * - INVITE_CREATE
     * - INVITE_DELETE
     */
    GUILD_INVITES = 1 << 6,
    /**
     * include event :
     * - VOICE_STATE_UPDATE
     */
    GUILD_VOICE_STATES = 1 << 7,
    /**
     * include event :
     * - PRESENCE_UPDATE
     */
    GUILD_PRESENCES = 1 << 8,
    /**
     * include events
     * - MESSAGE_CREATE
     * - MESSAGE_UPDATE
     * - MESSAGE_DELETE
     * - MESSAGE_DELETE_BULK
     */
    GUILD_MESSAGES = 1 << 9,
    /**
     * include events :
     * - MESSAGE_REACTION_ADD
     * - MESSAGE_REACTION_REMOVE
     * - MESSAGE_REACTION_REMOVE_ALL
     * - MESSAGE_REACTION_REMOVE_EMOJI
     */
    GUILD_MESSAGE_REACTIONS = 1 << 10,
    /**
     * include event :
     * - TYPING_START
     */
    GUILD_MESSAGE_TYPING = 1 << 11,
    /**
     * include events :
     * - MESSAGE_CREATE
     * - MESSAGE_UPDATE
     * - MESSAGE_DELETE
     * - CHANNEL_PINS_UPDATE
     */
    DIRECT_MESSAGES = 1 << 12,
    /**
     * include events :
     * - MESSAGE_REACTION_ADD
     * - MESSAGE_REACTION_REMOVE
     * - MESSAGE_REACTION_REMOVE_ALL
     * - MESSAGE_REACTION_REMOVE_EMOJI
     */
    DIRECT_MESSAGE_REACTIONS = 1 << 13,
    /**
     * include event :
     * - TYPING_START
     */
    DIRECT_MESSAGE_TYPING = 1 << 14,

    /**
     * You need to use this intent if you want get content of message, WARNING : priviliged intent for verified bots
     */
    MESSAGE_CONTENT = 1 << 15,

    /**
     * include events :
     * GUILD_SCHEDULED_EVENT_CREATE
     *   - GUILD_SCHEDULED_EVENT_UPDATE
     *   - GUILD_SCHEDULED_EVENT_DELETE
     *   - GUILD_SCHEDULED_EVENT_USER_ADD
     *   - GUILD_SCHEDULED_EVENT_USER_REMOVE
     */
    GUILD_SCHEDULED_EVENTS = 1 << 16,

    /**
     * include events :
     *   - AUTO_MODERATION_RULE_CREATE
     *   - AUTO_MODERATION_RULE_UPDATE
     *   - AUTO_MODERATION_RULE_DELETE
     */
    AUTO_MODERATION_CONFIGURATION = 1 << 20,

    /**
     * include event :
     * -  AUTO_MODERATION_ACTION_EXECUTION
     */
    AUTO_MODERATION_EXECUTION = 1 << 21,

    /**
     * include all intents
     */
    ALL = GUILDS | GUILD_MEMBERS | GUILD_BANS | GUILD_EMOJIS | GUILD_INTEGRATIONS | GUILD_WEBHOOKS | GUILD_INVITES | GUILD_VOICE_STATES | GUILD_PRESENCES | GUILD_MESSAGES |
        GUILD_MESSAGE_REACTIONS | GUILD_MESSAGE_TYPING | DIRECT_MESSAGES | DIRECT_MESSAGE_REACTIONS | DIRECT_MESSAGE_TYPING | MESSAGE_CONTENT | GUILD_SCHEDULED_EVENTS |
        AUTO_MODERATION_CONFIGURATION | AUTO_MODERATION_EXECUTION
}

export type IntentMode = 'add' | 'remove';

export interface IntentOptions {
    /**
     * if si add mode, you add each intent from 0, and with remove system, you start with all and remove with you chose
     * @default 'add'
     */
    mode?: IntentMode;
    
    /**
     * list of intent that you add/remove
     */
    intents?: Intents[];
}

export const API_VERSION: number = 10;
