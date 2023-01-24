import { error, type RequestHandler } from "@sveltejs/kit";
import { D1Service as D1Connect } from "../../services/D1Connect";
import { ErrorUtils } from "../../utils/ErrorUtils";

export const POST: RequestHandler = async ({ request, params, platform }) => {
    const path = params["path"];
    if (platform && path) {

        try {

            // run d1 call;
            const connect = new D1Connect(platform);
            const res = await connect.fetch(path, request);
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