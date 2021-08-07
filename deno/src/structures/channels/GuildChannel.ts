import { APIChannel } from 'https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts';
import { Client } from '../../Client.ts';
import { PermissionOverwrite } from '../../utils/PermissionOverwrite.ts';
import { Snowflake } from '../../utils/Snowflake.ts';
import { Guild } from '../Guild.ts';
import { Channel } from './Channel.ts';


export class GuildChannel extends Channel {
    public name: string;
    public guild: Guild;
    public nsfw: boolean;
    public position: number;
    public parentId: Snowflake | null;
    public permissionOverwrites: PermissionOverwrite[] = [];
    
    constructor(client: Client, data: APIChannel) {
        super(client, data);
        this.guild = client.guilds.get(data.guild_id as Snowflake)!;
        this.name = data.name!;
        this.nsfw = !!data.nsfw;
        this.position = data.position || 0;
        this.parentId = data.parent_id as Snowflake || null;
        if (data.permission_overwrites) {
            for (const permissionOverwrite of data.permission_overwrites) {
                this.permissionOverwrites.push(
                    new PermissionOverwrite(permissionOverwrite as {
                        id: Snowflake;
                        type: number;
                        allow: string;
                        deny: string;
                    })
                );
            }
        }
    }
    
    update(data: APIChannel): GuildChannel {
        if (data.name !== this.name) this.name = data.name!;
        if (data.nsfw !== this.nsfw) this.nsfw = !!data.nsfw;
        if (data.position && this.position !== data.position)
            this.position = data.position;
        if (data.parent_id && this.parentId !== data.parent_id)
            this.parentId = data.parent_id as Snowflake;
        this.permissionOverwrites = [];
        if (data.permission_overwrites) {
            for (const permissionOverwrite of data.permission_overwrites) {
                this.permissionOverwrites.push(
                    new PermissionOverwrite(permissionOverwrite as {
                        id: Snowflake;
                        type: number;
                        allow: string;
                        deny: string;
                    })
                );
            }
        }
        return this;
    }
}
