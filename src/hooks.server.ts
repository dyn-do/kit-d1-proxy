import type { Handle } from '@sveltejs/kit';
import { CorsHeaders } from './constants/CorsHeaders';

export const handle: Handle = async ({ event, resolve }) => {
    if (event.request.method !== 'OPTIONS') {
        const response = await resolve(event);
        for (const [key, value] of Object.entries(CorsHeaders)) {
            response.headers.set(key, value);
        }
        return response;
    }

    return new Response('ok', { headers: CorsHeaders });
};