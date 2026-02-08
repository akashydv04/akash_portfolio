export default {
    async fetch(request, env) {
        // If using Workers Assets (beta), the assets binding handles requests.
        // However, for standard Workers Sites or if we want explicit control:
        try {
            return await env.ASSETS.fetch(request);
        } catch (e) {
            return new Response("Not Found", { status: 404 });
        }
    },
};
