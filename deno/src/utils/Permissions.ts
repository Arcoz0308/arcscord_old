export enum Permissions {
    /**
     * Allows creation of instant invites
     */
    CREATE_INSTANT_INVITE = 1,
    /**
     * Allows kicking members
     */
    KICK_MEMBERS = 2,
    /**
     * Allows banning members
     */
    BAN_MEMBERS = 4,
    /**
     * Allows all permissions and bypasses channel permission overwrites
     */
    ADMINISTRATOR = 8,
    /**
     * Allows management and editing of channels
     */
    MANAGE_CHANNELS = 16,
    /**
     * Allows management and editing of the guild
     */
    MANAGE_GUILDS = 32,
    /**
     * Allows for the addition of reactions to messages
     */
    ADD_REACTIONS = 64,
    /**
     * Allows for viewing of audit logs
     */
    VIEW_AUDIT_LOG = 128,
    /**
     * Allows for using priority speaker in a voice channel
     */
    PRIORITY_SPEAKER = 256,
    /**
     * Allows the user to go live
     */
    STREAM = 512,
    /**
     * Allows guild members to view a channel, which includes reading messages in text channels
     */
    VIEW_CHANNEL = 1024,
    /**
     * Allows for sending messages in a channel
     */
    SEND_MESSAGES = 2048,
    /**
     * Allows for sending of /tts messages
     */
    SEND_TTS_MESSAGES = 4096,
    /**
     * Allows for deletion of other users messages
     */
    MANAGE_MESSAGES = 8192,
    /**
     * Links sent by users with this permission will be auto-embedded
     */
    EMBED_LINKS = 16384,
    /**
     * Allows for uploading images and files
     */
    ATTACH_FILES = 32768,
    /**
     * Allows for reading of message history
     */
    READ_MESSAGE_HISTORY = 65536,
    /**
     * Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel
     */
    MENTION_EVERYONE = 131072,
    /**
     * Allows the usage of custom emojis from other servers
     */
    USE_EXTERNAL_EMOJIS = 262144,
    /**
     * Allows for viewing guild insights
     */
    VIEW_GUILD_INSIGHTS = 524288,
    /**
     * Allows for joining of a voice channel
     */
    CONNECT = 1048576,
    /**
     * Allows for speaking in a voice channel
     */
    SPEAK = 2097152,
    /**
     * Allows for muting members in a voice channel
     */
    MUTE_MEMBERS = 4194304,
    /**
     * Allows for deafening of members in a voice channel
     */
    DEAFEN_MEMBERS = 8388608,
    /**
     * Allows for moving of members between voice channels
     */
    MOVE_MEMBERS = 16777216,
    /**
     * Allows for using voice-activity-detection in a voice channel
     */
    USE_VAD = 33554432,
    /**
     * Allows for modification of own nickname
     */
    CHANGE_NICKNAME = 67108864,
    /**
     * Allows for modification of other users nicknames
     */
    MANAGE_NICKNAMES = 134217728,
    /**
     * Allows management and editing of roles
     */
    MANAGE_ROLES = 268435456,
    /**
     * Allows management and editing of webhooks
     */
    MANAGE_WEBHOOKS = 536870912,
    /**
     * Allows management and editing of emojis
     */
    MANAGE_EMOJIS = 1073741824,
    /**
     * Allows members to use slash commands in text channels
     */
    USE_SLASH_COMMANDS = 2147483648,
    /**
     * Allows for requesting to speak in stage channels. (This permission is under active development and may be changed or removed.)
     */
    REQUEST_TO_SPEAK = 4294967296,
    /**
     * Allows for deleting and archiving threads, and viewing all private threads
     */
    MANAGE_THREADS = 17179869184,
    /**
     * Allows for creating and participating in threads
     */
    USE_PUBLIC_THREADS = 34359738368,
    /**
     * Allows for creating and participating in private threads
     */
    USE_PRIVATE_THREADS = 68719476736
}

export type Permission = keyof typeof Permissions;

export function hasPermission(
    permissions: number,
    permission: Permission
): boolean {
    return (permissions & Permissions[permission]) !== 0;
}

export function addPermission(
    permissions: number,
    permission: Permission
): number {
    return permissions | Permissions[permission];
}

export function removePermission(
    permissions: number,
    permission: Permission
): number {
    return hasPermission(permissions, permission)
        ? permissions ^ Permissions[permission]
        : permissions;
}

export function getAllPermissions(permissions: number): Permission[] {
    const p: Permission[] = [];
    for (const perm of Object.keys(Permissions)) {
        if (hasPermission(permissions, perm as Permission))
            p.push(perm as Permission);
    }
    return p;
}
