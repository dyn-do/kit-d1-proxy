import { D1Constants } from "../constants/D1Constants";
import type { QueryBody } from "../interfaces/QueryBody";
import { FetchD1 } from "../utils/FetchD1";
export class D1Service {

    private _platform: App.Platform;

    constructor(platform: App.Platform) {
        this._platform = platform;
    }

    private _getFetch(): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> {
        let d1Fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
        // Get D1
        let d1 = this._platform.env[D1Constants.KEY_D1DB];
        if (!d1) {
            // Add beta prefix
            d1 = this._platform.env[D1Constants.PREFIX_BETA + D1Constants.KEY_D1DB];
        }
        if (!d1) {
            throw new Error("No D1 Database");
        }
        // Get D1 Fetcher
        // ref: https://github.com/cloudflare/wrangler2/issues/2335#issuecomment-1352344893
        if (d1.constructor.name == "D1Database") {
            d1Fetch = d1.binding.fetch;
        } else {
            d1Fetch = d1.fetch;
        }
        return d1Fetch;
    }

    async fetch(path: string, body: QueryBody) {
        try {
            const fetchD1 = new FetchD1(this._getFetch());
            const res = await fetchD1.postJson(path, body);
            return await res.json();
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
}