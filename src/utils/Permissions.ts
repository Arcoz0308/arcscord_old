export enum Permissions {
    /**
     * Allows creation of instant invites
     */
    CREATE_INSTANT_INVITE =     1 << 0,
    /**
     * Allows kicking members
     */
    KICK_MEMBERS =              1 << 1,
    /**
     * Allows banning members
     */
    BAN_MEMBERS =               1 << 2,
    /**
     * Allows all permissions and bypasses channel permission overwrites
     */
    ADMINISTRATOR =             1 << 3,
    /**
     * Allows management and editing of channels
     */
    MANAGE_CHANNELS =           1 << 4,
    /**
     * Allows management and editing of the guild
     */
    MANAGE_GUILD1 =             1 << 5,
    /**
     * Allows for the addition of reactions to messages
     */
    ADD_REACTIONS =             1 << 6,
    /**
     * Allows for viewing of audit logs
     */
    VIEW_AUDIT_LOG =            1 << 7,
    /**
     * Allows for using priority speaker in a voice channel
     */
    PRIORITY_SPEAKER =          1 << 8,
    /**
     * Allows the user to go live
     */
    STREAM =                    1 << 9,
    /**
     * Allows guild members to view a channel, which includes reading messages in text channels
     */
    VIEW_CHANNEL =              1 << 10,
    /**
     * Allows for sending messages in a channel
     */
    SEND_MESSAGES =             1 << 11,
    /**
     * Allows for sending of /tts messages
     */
    SEND_TTS_MESSAGES =         1 << 12,
    /**
     * Allows for deletion of other users messages
     */
    MANAGE_MESSAGES =           1 << 13,
    /**
     * Links sent by users with this permission will be auto-embedded
     */
    EMBED_LINKS =               1 << 14,
    /**
     * Allows for uploading images and files
     */
    ATTACH_FILES =              1 << 15,
    /**
     * Allows for reading of message history
     */
    READ_MESSAGE_HISTORY =      1 << 16,
    /**
     * Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel
     */
    MENTION_EVERYONE =          1 << 17,
    /**
     * Allows the usage of custom emojis from other servers
     */
    USE_EXTERNAL_EMOJIS =       1 << 18,
    /**
     * Allows for viewing guild insights
     */
    VIEW_GUILD_INSIGHTS =       1 << 19,
    /**
     * Allows for joining of a voice channel
     */
    CONNECT =                   1 << 20,
    /**
     * Allows for speaking in a voice channel
     */
    SPEAK =                     1 << 21,
    /**
     * Allows for muting members in a voice channel
     */
    MUTE_MEMBERS =              1 << 22,
    /**
     * Allows for deafening of members in a voice channel
     */
    DEAFEN_MEMBERS =            1 << 23,
    /**
     * Allows for moving of members between voice channels
     */
    MOVE_MEMBERS =              1 << 24,
    /**
     * Allows for using voice-activity-detection in a voice channel
     */
    USE_VAD =                   1 << 25,
    /**
     * Allows for modification of own nickname
     */
    CHANGE_NICKNAME =           1 << 26,
    /**
     * Allows for modification of other users nicknames
     */
    MANAGE_NICKNAMES =          1 << 27,
    /**
     * Allows management and editing of roles
     */
    MANAGE_ROLES =              1 << 28,
    /**
     * Allows management and editing of webhooks
     */
    MANAGE_WEBHOOKS =           1 << 29,
    /**
     * Allows management and editing of emojis
     */
    MANAGE_EMOJIS =             1 << 30,
    /**
     * Allows members to use slash commands in text channels
     */
    USE_SLASH_COMMANDS =        1 << 31,
    /**
     * Allows for requesting to speak in stage channels. (This permission is under active development and may be changed or removed.)
     */
    REQUEST_TO_SPEAK =          1 << 32,
    /**
     * Allows for deleting and archiving threads, and viewing all private threads
     */
    MANAGE_THREADS =            1 << 34,
    /**
     * Allows for creating and participating in threads
     */
    USE_PUBLIC_THREADS =        1 << 35,
    /**
     * Allows for creating and participating in private threads
     */
    USE_PRIVATE_THREADS =       1 << 36
}
export type Permission = keyof typeof Permissions;

export function hasPermission(permissions: number, permission: Permission): boolean {
    return (permissions & Permissions[permission]) !== 0;
}
export function addPermission(permissions: number, permission: Permission): number {
    return permissions | Permissions[permission];
}
export function removePermission(permissions: number, permission: Permission): number {
    return hasPermission(permissions, permission) ? permissions ^ Permissions[permission] : permissions;
}
export function getAllPermissions(permissions: number): Permission[] {
    const p: Permission[] = [];
    for (const perm of Object.keys(Permissions)) {
        if (hasPermission(permissions, perm as Permission)) p.push(perm as Permission);
    }
    return p;
}
