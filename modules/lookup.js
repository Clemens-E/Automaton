const fetch = require('node-fetch');

const ENDPOINT = 'https://bans.discord.id/api/check.php';
const MAX_USERS = 99;

class Lookup {
    constructor(token, {
        interval,
        cacheSize,
        cacheLife,
    } = {}) {
        Object.defineProperty(this, 'token', {
            value: token,
            enumerable: false,
            writable: true,
        });
        this.interval = interval || 1000;
        this.cacheSize = cacheSize || 0;
        this.cacheLife = cacheLife || 3600000;

        this.queue = [];
        this.pending_promises = new Map;
        this.last_call = 0;
        this.timeout = null;

        this.cache = new Map;
        this.last_cache_tidy = Date.now();
    }

    lookup(user, high_priority, no_cache) {
        // If there is already a lookup, return the existing promise.
        if (this.pending_promises.has(user)) {
            return this.pending_promises.get(user);
        }

        // If the result is cached, use the cache, unless instructed otherwise
        if (!no_cache) {
            const cached = this.get_cache(user);
            if (typeof cached !== 'undefined') {
                return Promise.resolve(cached);
            }
        }

        // Queue a lookup and return a promise
        const p = new Promise((res, rej) => {
            const o = {
                user,
                res,
                rej,
            };

            // High priority requests are added at the top of queue.
            // They can be useful to quickly get a result for a user who just joined the server while a scan has also been queued.
            if (!high_priority) this.queue.push(o);
            else this.queue.unshift(o);

            this.check();
        });

        this.pending_promises.set(user, p);
        return p;
    }

    check() {
        // A future execution is already pending
        if (this.timeout !== null || this.queue.length === 0) return;

        if (this.last_call + this.interval < Date.now()) {
            // We can execute the request now. It will be executed at the end of the event loop
            this.timeout = setImmediate(() => this.execute());
        }
 else {
            // The last request is too recent. Let's wait a bit before executing the request…
            this.timeout = setTimeout(() => this.execute(), (this.last_call + this.interval) - Date.now());
        }
    }

    execute() {
        if (this.queue.length === 0) return;

        this.timeout = null;
        this.last_call = Date.now();

        // Gets up to 99 user IDs from the queue with their promise resolve/rejection methods.
        const users = {};
        for (const {
            user,
            res,
            rej,
        } of this.queue.splice(0, MAX_USERS)) {
            users[user] = {
                res,
                rej,
            };
        }

        // Construct the URL…
        const params = Object.keys(users).join('&user_id=');

        fetch(ENDPOINT + '?user_id=' + params, {
            headers: {
                Authorization: this.token,
            },
        })
            .then(r => r.json())
            .then(json => {
                // Finished
                for (const result of json) {
                    // A user can have multiple cases. Currently, we return only one case and ignore the other ones.
                    if (typeof users[result.user_id] === 'undefined') {
                        continue;
                    }

                    // We convert the banned string into a boolean. Easier to use in conditions.
                    result.banned = result.banned != '0';
                    users[result.user_id].res(result);
                    this.put_cache(result);

                    this.pending_promises.delete(result.user_id);
                    delete users[result.user_id];
                }

                // Reject the promise for user IDs for which the API don't have returned a response at all.
                // This should not happens… But a we are not immune to a bug!
                for (const [u, {
                    res,
                    rej,
                }] of Object.entries(users)) {
                    this.pending_promises.delete(u);
                    rej(new Error('No response was returned by the API'));
                }
            })
            .catch(err => {
                // If an error happened with the API call, reject the promise for all queried users…
                for (const [u, {
                    res,
                    rej,
                }] of Object.entries(users)) {
                    this.pending_promises.delete(u);
                    rej(err);
                }
            });

        // Check if we need to make another API call (for example, if their was more than 99 user IDs in the queue)
        this.check();
    }

    get_cache(user) {
        this.tidy_cache();

        const cached = this.cache.get(user);
        if (typeof cached === 'undefined') return;

        // Expired
        if (cached.t + this.cacheLife < Date.now()) {
            this.cache.delete(user);
            return;
        }

        return cached.d;
    }

    put_cache(data) {
        if (this.cacheSize === 0) return;

        const o = {
            t: Date.now(),
            d: data,
        };
        this.cache.set(data.user_id, o);

        this.tidy_cache();

        // If the cache is full, remove the oldest elements
        if (this.cacheSize > 0 && this.cache.size > this.cacheSize) {
            const iter = this.cache.keys();
            while (this.cache.size > this.cacheSize) {
                this.cache.delete(iter.next().value);
            }
        }
    }

    tidy_cache() {
        // Check the whole cache for expired entries only every 5 minutes
        if (this.cache.size === 0 || this.last_cache_tidy + 300 > Date.now()) return;

        for (const [user, data] of this.cache) {
            if (data.t + this.cacheLife < Date.now()) {
                this.cache.delete(user);
            }
        }

        this.last_cache_tidy = Date.now();
    }
}

module.exports = {
    Lookup,
};