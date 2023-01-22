import type { PageServerLoad } from './$types';

const _PREFIX_BETA = "__D1_BETA__";
const _KEY_D1DB = "D1DB";
export const load = (async ({ platform }) => {
    if (platform) {
        try {
            // Get D1
            let d1 = platform.env[_KEY_D1DB];
            if (!d1) {
                // Add beta prefix
                d1 = platform.env[_PREFIX_BETA + _KEY_D1DB];
            }
            if (!d1) {
                throw new Error("No D1 Database");
            }
            // Get D1 Fetcher
            // ref: https://github.com/cloudflare/wrangler2/issues/2335#issuecomment-1352344893
            let fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
            if (d1.constructor.name == "D1Database") {
                fetch = d1.binding;
            } else {
                fetch = d1;
            }
            let data: { [key: string]: string } = {};
            for (let [k, v] of Object.entries(platform.env)) {
                data[k] = v.toString();
            }
            data["____"] = fetch.toString();
            data["____2"] = fetch.constructor.toString();
            data["_____3"] = fetch.constructor.name;
            // return { "result": [], "test": JSON.stringify(data) };
            const res = await fetch("/query", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    sql: 'select name from sqlite_master where type="table"',
                    params: [],
                })
            });
            // const obj = await res.json();
            return { "result": [], "test": JSON.stringify(data) };
        } catch (error) {
            if (error instanceof Error) {
                return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) }
            } else if (typeof error === 'string') {
                return { error: error }
            } else {
                return { error: "unexpected error" }
            }

        }
    }
    return { error: "Not Connect Cloudflare Worker." }
}) satisfies PageServerLoad;