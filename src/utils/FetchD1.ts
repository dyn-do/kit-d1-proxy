import type { Fetcher } from "../interfaces/Fetcher";
import type { QueryBody } from "../interfaces/QueryBody";

export class FetchD1 {
    private fetcher;

    constructor(fetchr: Fetcher) {
        this.fetcher = fetchr;
    }

    async postJson(absolutePath: string, jsonBody: QueryBody) {
        return await this.fetcher.fetch(absolutePath, {
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
