import type { RequestHandler } from "@sveltejs/kit";
import { D1Service as D1Connect } from "../../services/D1Connect";

export const POST: RequestHandler = async ({ request, params, platform }) => {
    let res: Response;
    const path = params["path"];
    if (platform && path) {

        const json = await request.json();

        // run d1 call;
        const connect = new D1Connect(platform);
        const obj = await connect.fetch(path, json);

        res = new Response(JSON.stringify(obj));
    } else {
        res = new Response("No Cloudflare Worker");
    }

    // CORS 
    res.headers.append('Access-Control-Allow-Origin', "*");

    return res;
}