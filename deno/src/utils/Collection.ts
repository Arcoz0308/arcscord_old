export class Collection<K, V> extends Map<K, V> {
    /**
     *
     * @param [limit=0] limit of size of the collection, 0 = no limit
     * @param entries
     */
    public limit: number;
    
    constructor(limit = 0, entries?: [K, V][] | null) {
        super(entries);
        this.limit = limit;
    }
    
    public set(key: K, value: V): any {
        if (this.limit !== 0 && this.size === this.limit && !this.has(key)) {
            this.delete(this.keys().next().value);
        }
        return super.set(key, value);
    }
    
    /**
     * find a value in the collection
     * @param cb the callback for find the value
     * @example ```ts
     * client.guilds.find(guild => guild.name === 'cool name');
     *
     */
    public find(cb: (value: V, key: K) => boolean) {
        for (const [key, value] of this) {
            if (cb(value, key)) return value;
        }
    }
    
    public filter(cb: (value: V, key: K) => boolean) {
        const results = new Collection<K, V>(this.limit);
        for (const [key, value] of this) {
            if (cb(value, key)) results.set(key, value);
        }
        return results;
    }
    
    public toObject(): object {
        const object = {};
        this.forEach((value, key) => {
            object[typeof key === 'string' ? key : (typeof key === 'number' ? key.toString(10) : `invalidKey:${key}`)] = value;
        });
        return object;
    }
    
    public toJSON(space = 1): string {
        const object = this.toObject();
        for (const key in object) {
            if (object.hasOwnProperty(key) && typeof object[key] === 'object' && object[key].hasOwnProperty('toJSON')) object[key] = JSON.parse(object[key].toJSON());
        }
        return JSON.stringify(object, null, space);
    }
}