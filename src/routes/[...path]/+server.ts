import type { RequestHandler } from "@sveltejs/kit";
import { D1Service as D1Connect } from "../../services/D1Connect";

export const POST: RequestHandler = async ({ request, params, platform }) => {
    if (platform) {
        const path = params["path"];
        if (path) {

            const json = await request.json();

            // run d1 call;
            const connect = new D1Connect(platform);
            const obj = await connect.fetch(path, json);

            return new Response(JSON.stringify(obj));
        }
    }

    return new Response("No Cloudflare Worker");
}