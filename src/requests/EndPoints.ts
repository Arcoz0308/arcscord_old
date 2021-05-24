import {imageFormats, imageSize} from "../typing/Types";

export const REST_VERSION = 9;
export const BASE_URL = `https://discord.com/api/v${REST_VERSION}`;
export const IMAGE_BASE_URL = "https://cdn.discordapp.com/";

export const GATEWAY_CONNECT = '/gateway/bot';

// images
export const USER_AVATAR = (user: string, hash: string, format: imageFormats, size: imageSize) => `${IMAGE_BASE_URL}/avatars/${user}/${hash}.${format}?size${size}`;
export const DEFAULT_USER_AVATAR = (discriminator: string) => `${IMAGE_BASE_URL}/embed/avatars/${discriminator}.png`;
export const USER_ME = 'users/@me';