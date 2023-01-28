import type { QueryBody } from "../interfaces/QueryBody";

export class FetchD1Utils {

    static async postJson(absolutePath: string, jsonBody?: QueryBody) {
        const requestInit = this.buildRequest(jsonBody);
        return await fetch(absolutePath, requestInit);
    }

    static async postSql(absolutePath: string, sql: string, paramsStr?: string) {
        const requestInit = this.buildSqlRequest(sql, paramsStr);
        return await fetch(absolutePath, requestInit);
    }

    static buildRequest(jsonBody?: QueryBody) {
        const requestInit: RequestInit = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: jsonBody ? JSON.stringify(jsonBody) : undefined
        };
        return requestInit;
    }

    static buildSqlRequest(sql: string, paramsStr?: string) {
        let params: Array<string | number> | undefined = [];
        if (paramsStr) {
            try {
                params = JSON.parse(paramsStr);
            } catch (e) {
                params = undefined;
            }
        }
        const body: QueryBody = {
            sql: sql,
            params
        };
        return this.buildRequest(body);
    }
}
