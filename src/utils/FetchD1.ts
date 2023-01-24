import type { Fetcher } from "../interfaces/Fetcher";
import type { QueryBody } from "../interfaces/QueryBody";

export class FetchD1 {
    private fetcher;
    output?: (e: string) => void;

    constructor(fetchr: Fetcher) {
        this.fetcher = fetchr;
    }
    async post(absolutePath: string, req: Request) {
        const requestInit: RequestInit = {
            method: req.method,
            headers: req.headers,
            body: req.body
        };
        return await this.fetcher.fetch(absolutePath, requestInit);
    }

    async postJson(absolutePath: string, jsonBody: QueryBody) {
        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(jsonBody)
        };

        if (this.output) {
            this.output(`${absolutePath} ${JSON.stringify(requestInit)}`);
        }

        return await this.fetcher.fetch(absolutePath, requestInit);
    }

    async postSql(absolutePath: string, sql: string, paramsStr: string) {
        let params = JSON.parse(paramsStr) as Array<string | number>;
        const body: QueryBody = {
            sql: sql,
            params
        };
        return await this.postJson(absolutePath, body);
    }

    async downloadBinary(absolutePath: string) {
        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
        };

        if (this.output) {
            this.output(`${absolutePath} ${JSON.stringify(requestInit)}`);
        }

        return await this.fetcher.fetch(absolutePath, requestInit);
    }
}
