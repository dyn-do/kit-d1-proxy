import { D1Constants } from "../constants/D1Constants";
import type { Fetcher } from "../interfaces/Fetcher";
import type { QueryBody } from "../interfaces/QueryBody";
import { ErrorUtils } from "../utils/ErrorUtils";
import { FetchD1 } from "../utils/FetchD1";
export class D1Service {

    private _platform: App.Platform;

    constructor(platform: App.Platform) {
        this._platform = platform;
    }

    private _getFetch() {
        let fetcher: Fetcher;
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
            fetcher = d1.binding;
        } else {
            fetcher = d1;
        }
        return fetcher;
    }

    async fetch(path: string, body: QueryBody) {
        try {
            const fetchD1 = new FetchD1(this._getFetch());
            const res = await fetchD1.postJson(path, body);
            return await res.json();
        } catch (error) {
            return { error: ErrorUtils.stackTrace(error) };
        }
    }
}