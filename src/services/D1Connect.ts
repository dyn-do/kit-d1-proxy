import { D1Constants } from "../constants/D1Constants";
import type { QueryBody } from "../interfaces/QueryBody";
import { FetchD1 } from "../utils/FetchD1";
export class D1Service {

    private _platform: App.Platform;

    constructor(platform: App.Platform) {
        this._platform = platform;
    }

    private _getFetch(): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> {
        let d1Fetch = fetch;
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
            d1Fetch = d1.binding;
        } else {
            d1Fetch = d1;
        }
        return d1Fetch;
    }

    async fetch(path: string, body: QueryBody) {
        let data: { [key: string]: string } = {};
        const f = this._getFetch();
        data["a"] = f.constructor.name;
        for (let [k, v] of Object.getOwnPropertyNames(f)) {
            data[k] = v.toString()
        }
        return data
        try {
            const fetchD1 = new FetchD1(this._getFetch());
            const res = await fetchD1.postJson(path, body);
            return await res.json();
        } catch (error) {
            if (error instanceof Error) {
                return { error: error.message }
            } else if (typeof error === 'string') {
                return { error: error }
            } else {
                return { error: "unexpected error" }
            }
        }
    }
}