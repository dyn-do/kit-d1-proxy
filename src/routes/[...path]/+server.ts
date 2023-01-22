import { error, type RequestHandler } from "@sveltejs/kit";
import { D1Service as D1Connect } from "../../services/D1Connect";

export const POST: RequestHandler = async ({ request, params, platform }) => {
    const path = params["path"];
    if (platform && path) {
        let res: Response
        if (path == "dump") {
            // download SQLite
            const connect = new D1Connect(platform);
            const binary = await connect.downloadBinary(path);

            res = new Response(binary);

        } else {


            const json = await request.json();

            // run d1 call;
            const connect = new D1Connect(platform);
            const obj = await connect.fetchJson(path, json);

            res = new Response(JSON.stringify(obj));
        }
        // CORS 
        res.headers.append('Access-Control-Allow-Origin', "*");
        return res;
    } else {
        throw error(404, {
            message: "No Cloudflare Worker"
        });
    }
}