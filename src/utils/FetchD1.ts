import type { QueryBody } from "../interfaces/QueryBody";

export class FetchD1 {
    private fetch2;

    isPromise(v: any) {
        if (
            v !== null &&
            typeof v === 'object' &&
            typeof v.then === 'function' &&
            typeof v.catch === 'function'
        ) {
            return true;
        }

        return false;
    }

    constructor(fetch2: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
        this.fetch2 = fetch2;
    }

    async postJson(absolutePath: string, jsonBody: QueryBody) {
        const resAny = this.fetch2(absolutePath, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(jsonBody)
        });
        if (this.isPromise(resAny)) {
            return await resAny;
        }
        else {
            return resAny as any as Response
        }
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
