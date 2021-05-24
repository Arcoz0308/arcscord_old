import {User} from "./User";
import {Activity, Presence, PresenceStatus} from "../typing/Types";
import {USER_ME} from "../requests/EndPoints";

/**
 * @category Structures
 */
export class ClientUser extends User {
    /**
     * get current presence of the bot
     */
    get presence(): Presence | null {
        if (this.client.presence) return this.client.presence;
        return null;
    }

    /**
     * update bot presence
     * @param presence a object of presence
     *
     * @example
     * client.user.setPresence({
     *     status: "dnd",
     *     activity: {
     *         type: "game",
     *         name: "on arcscord"
     *     }
     * });
     */
    public setPresence(presence: Presence) {
        if (!presence.status) presence.status = this.client.presence.status;
        if (!presence.status) presence.status = 'online';
        this.client.presence = presence;
        this.client.gateway.updatePresence(presence);
    }

    /**
     * update the status of the ClientUser
     * @param status the status to set
     * @example
     * client.user.setStatus('dnd');
     */
    public setStatus(status: PresenceStatus) {
        this.client.presence.status = status;
        this.client.gateway.updatePresence(this.client.presence);
    }

    /**
     * update the activity of the ClientUser
     * @param activity the activity to set
     * @example
     * client.user.setActivity({
     *     name: 'using arcscord',
     *     type: 'game'
     * });
     */
    public setActivity(activity: Activity) {
        this.client.presence.activity = activity;
        this.client.gateway.updatePresence(this.client.presence);
    }

    public edit(data: { username?: string, avatar?: string }) {
        this.client.requestHandler.request('PATCH', USER_ME, data).then(r => {
            this.username = r.username;
            this.avatar = r.avatar;
        }).catch(console.error);
    }

    public setUsername(username: string) {
        this.edit({username});
    }
}