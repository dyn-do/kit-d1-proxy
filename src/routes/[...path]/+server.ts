import { error, type RequestHandler } from "@sveltejs/kit";
import { D1Service as D1ConnectService } from "../../services/D1Connect";
import { ErrorUtils } from "../../utils/ErrorUtils";

export const POST: RequestHandler = async ({ request, params, platform }) => {
    const path = params["path"];
    if (path) {
        if (platform) {
            // For Cloudflare
            try {
                // run d1 call;
                const conn = new D1ConnectService(platform);
                const d1res = await conn.fetch(path, request);
                const res = new Response(d1res.body);
                // CORS 
                res.headers.append('Access-Control-Allow-Origin', "*");
                res.headers.append('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
                res.headers.append('Access-Control-Allow-Methods', 'POST');
                return res;
            } catch (e) {
                throw error(500, {
                    message: ErrorUtils.stackTrace(e)
                });
            }
        } else {
            // For Local Dev
            try {
                const requestInit: RequestInit = {
                    method: "POST",
                    headers: {
                        "authorization": "Bearer w1Z27m26IGlc7GlUvnt3iz5LZEJN4zSNRAuI79KI",
                    },
                    duplex: "half",
                    body: request.body
                };
                const d1res = await fetch("https://api.cloudflare.com/client/v4/accounts/1f60a750acc192ddfcb4077542357b40/d1/database/345aa71f-4f63-4ccd-8b40-c5794880c7b2/" + path, requestInit);
                const res = new Response(d1res.body);
                // CORS 
                res.headers.append('Access-Control-Allow-Origin', "*");
                res.headers.append('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
                res.headers.append('Access-Control-Allow-Methods', 'POST');
                return res;
            } catch (e) {
                throw error(500, {
                    message: ErrorUtils.stackTrace(e)
                });
            }
        }
    }
    throw error(404, {
        message: "invalid api url"
    });
}