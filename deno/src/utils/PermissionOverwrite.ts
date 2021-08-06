import { Snowflake } from './Snowflake.ts';


export class PermissionOverwrite {
    public type: 'role' | 'member';
    public id: Snowflake;
    public allow: number;
    public deny: number;
    
    constructor(data: {
        id: Snowflake;
        type: number;
        allow: string;
        deny: string;
    }) {
        this.id = data.id;
        this.type = data.type === 0 ? 'role' : 'member';
        this.allow = parseInt(data.allow);
        this.deny = parseInt(data.deny);
    }
}
