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
    public toObject(): object {
        const object = {};
        this.forEach((value, key) => {
            object[typeof key === 'string' ? key : (typeof key === 'number' ? key.toString(10) : `invalidKey:${key}`)] = value
        });
        return object;
    }
    public toJSON(space = 1): string {
        return JSON.stringify(this.toObject(), null, space);
    }
}