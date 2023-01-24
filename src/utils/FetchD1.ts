import type { Fetcher } from "../interfaces/Fetcher";
import type { QueryBody } from "../interfaces/QueryBody";

export class FetchD1 {
    output?: (e: string) => void;

    async postJson(absolutePath: string, jsonBody?: QueryBody) {
        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: jsonBody ? JSON.stringify(jsonBody) : undefined
        };

        if (this.output) {
            this.output(`${document.URL}${absolutePath} ${JSON.stringify(requestInit)}`);
        }

        return await fetch(absolutePath, requestInit);
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
