import {
    APIChannel,
    APIEmoji,
    APIGuild,
    APIGuildMember,
    APIGuildWelcomeScreen,
    APIRole,
    GatewayPresenceUpdate,
    GatewayVoiceState,
    GuildDefaultMessageNotifications,
    GuildExplicitContentFilter,
    GuildFeature,
    GuildMFALevel,
    GuildPremiumTier,
    GuildSystemChannelFlags,
    GuildVerificationLevel
} from 'discord-api-types';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';

/**
 * @category Structures
 */
export class Guild extends Base {
    //public members = new Map<Snowflake, Member>();
    public id: Snowflake;
    public name: string;
    public icon: string | null;
    public icon_hash: string | null | undefined;
    public splash: string | null;
    public discovery_splash: string | null;
    public owner: boolean | undefined;
    public owner_id: Snowflake;
    public permissions: Snowflake | undefined;
    public region: string;
    public afk_channel_id: Snowflake | null;
    public afk_timeout: number;
    public widget_enabled: boolean | undefined;
    public widget_channel_id: Snowflake | null | undefined;
    public verification_level: GuildVerificationLevel;
    public default_message_notifications: GuildDefaultMessageNotifications;
    public explicit_content_filter: GuildExplicitContentFilter;
    public roles: APIRole[];
    public emojis: APIEmoji[];
    public features: GuildFeature[];
    public mfa_level: GuildMFALevel;
    public application_id: Snowflake | null;
    public system_channel_id: Snowflake | null;
    public system_channel_flags: GuildSystemChannelFlags;
    public rules_channel_id: Snowflake | null;
    public joined_at: string | undefined;
    public large: boolean | undefined;
    public unavailable: boolean | undefined;
    public member_count: number | undefined;
    public voice_states: Omit<GatewayVoiceState, "guild_id">[] | undefined;
    public members: APIGuildMember[] | undefined;
    public channels: APIChannel[] | undefined;
    public presences: GatewayPresenceUpdate[] | undefined;
    public max_presences: number | null | undefined;
    public max_members: number | undefined;
    public vanity_url_code: string | null;
    public description: string | null;
    public banner: string | null;
    public premium_tier: GuildPremiumTier;
    public premium_subscription_count: number | undefined;
    public preferred_locale: string;
    public public_updates_channel_id: Snowflake | null;
    public max_video_channel_users: number | undefined;
    public approximate_member_count: number | undefined;
    public approximate_presence_count: number | undefined;
    public welcome_screen: APIGuildWelcomeScreen | undefined;
    public nsfw: boolean;

    constructor(client: Client, data: APIGuild) {
        super(client);

        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.icon_hash = data.icon_hash;
        this.splash = data.splash;
        this.discovery_splash = data.discovery_splash;
        this.owner = data.owner;
        this.owner_id = data.owner_id;
        this.permissions = data.permissions;
        this.region = data.region;
        this.afk_channel_id = data.afk_channel_id;
        this.afk_timeout = data.afk_timeout;
        this.widget_enabled = data.widget_enabled;
        this.widget_channel_id = data.widget_channel_id;
        this.verification_level = data.verification_level;
        this.default_message_notifications = data.default_message_notifications;
        this.explicit_content_filter = data.explicit_content_filter;
        this.roles = data.roles;
        this.emojis = data.emojis;
        this.features = data.features;
        this.mfa_level = data.mfa_level;
        this.application_id = data.application_id;
        this.system_channel_id = data.system_channel_id;
        this.system_channel_flags = data.system_channel_flags;
        this.rules_channel_id = data.rules_channel_id;
        this.joined_at = data.joined_at;
        this.large = data.large;
        this.unavailable = data.unavailable;
        this.member_count = data.member_count;
        this.voice_states = data.voice_states;
        this.members = data.members;
        this.channels = data.channels;
        this.presences = data.presences;
        this.max_presences = data.max_presences;
        this.max_members = data.max_members;
        this.vanity_url_code = data.vanity_url_code;
        this.description = data.description;
        this.banner = data.banner;
        this.premium_tier = data.premium_tier;
        this.premium_subscription_count = data.premium_subscription_count;
        this.preferred_locale = data.preferred_locale;
        this.public_updates_channel_id = data.public_updates_channel_id;
        this.max_video_channel_users = data.max_video_channel_users;
        this.approximate_member_count = data.approximate_member_count;
        this.approximate_presence_count = data.approximate_presence_count;
        this.welcome_screen = data.welcome_screen;
        this.nsfw = data.nsfw;

    }

}
