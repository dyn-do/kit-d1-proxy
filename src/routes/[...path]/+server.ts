import { error, type RequestHandler } from "@sveltejs/kit";
import { D1Service as D1ConnectService } from "../../services/D1Connect";
import { ErrorUtils } from "../../utils/ErrorUtils";

export const POST: RequestHandler = async ({ request, params, platform }) => {
    const path = params["path"];
    if (platform && path) {

        try {

            // run d1 call;
            const conn = new D1ConnectService(platform);
            const d1res = await conn.fetch(path, request);
            const res = new Response(d1res.body);
            // CORS 
            res.headers.append('Access-Control-Allow-Origin', "*");
            return res;
        } catch (e) {
            throw error(500, {
                message: ErrorUtils.stackTrace(e)
            });
        }
    } else {
        throw error(404, {
            message: "No Cloudflare Worker"
        });
    }
}