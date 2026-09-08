// Tiny in-memory, TTL-based cache shared by data hooks (useProducts, useCategories)
// so navigating between pages doesn't refetch the whole catalog every time.
// Lives only for the page session (a hard refresh clears it) and is invalidated
// manually wherever a hook performs a mutation (add/edit/delete).
const store = new Map();

const apiCache = {
    /** Returns the cached value for `key` if it exists and is within `maxAgeMs`, else undefined. */
    getFresh(key, maxAgeMs) {
        const entry = store.get(key);
        if (!entry) return undefined;
        if (Date.now() - entry.timestamp > maxAgeMs) return undefined;
        return entry.data;
    },
    set(key, data) {
        store.set(key, { data, timestamp: Date.now() });
    },
    /** Clears every cached key starting with `prefix` (or everything, if omitted). */
    clear(prefix) {
        if (!prefix) {
            store.clear();
            return;
        }
        for (const key of store.keys()) {
            if (key.startsWith(prefix)) store.delete(key);
        }
    },
};

export default apiCache;
