import { imageFormats, imageSize } from '../utils/Utils';
import { Snowflake } from '../utils/Snowflake';

export const REST_VERSION = 9;
export const BASE_URL = `https://discord.com/api/v${REST_VERSION}`;
export const IMAGE_BASE_URL = 'https://cdn.discordapp.com/';

export const APPLICATION_GLOBAL_COMMAND = (
    applicationId: Snowflake,
    cmdId: Snowflake
) => `/applications/${applicationId}/commands/${cmdId}`;
export const APPLICATION_GLOBAL_COMMANDS = (applicationId: Snowflake) =>
    `/applications/${applicationId}/commands`;
export const GATEWAY_CONNECT = '/gateway/bot';
export const GUILD = (guildId: Snowflake) => `/guilds/${guildId}`;
export const GUILD_MEMBERS = (
    guildId: Snowflake,
    limit: number,
    after: number
) => `/guilds/${guildId}/members?limit=${limit}&after=${after}`;
export const MESSAGE = (channelId: Snowflake, msgId: Snowflake) =>
    `/channels/${channelId}/messages/${msgId}`;
export const MESSAGES = (channelId: Snowflake) =>
    `/channels/${channelId}/messages`;
export const USER_ME = '/users/@me';

//images
export const DEFAULT_USER_AVATAR = (discriminator: string) =>
    `/${IMAGE_BASE_URL}/embed/avatars/${discriminator}.png`;
export const USER_AVATAR = (
    user: string,
    hash: string,
    format: imageFormats,
    size: imageSize
) => `/${IMAGE_BASE_URL}/avatars/${user}/${hash}.${format}?size${size}`;
