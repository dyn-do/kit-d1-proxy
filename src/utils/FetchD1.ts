import type { QueryBody } from "../interfaces/QueryBody";

export class FetchD1 {
    private _fetch;

    constructor(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
        this._fetch = fetch;
    }

    async postJson(absolutePath: string, jsonBody: QueryBody) {
        return await this._fetch(absolutePath, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(jsonBody)
        });
    }

    async postSql(absolutePath: string, sql: string, paramsStr: string) {
        let params = JSON.parse(paramsStr) as Array<string | number>;
        const body: QueryBody = {
            sql: sql,
            params
        };
        return await this.postJson(absolutePath, body);
    }
}
