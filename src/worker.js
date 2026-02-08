export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle form submission proxy
        if (request.method === 'POST' && url.pathname === '/api/submit') {
            try {
                const formData = await request.formData();
                const body = new URLSearchParams();

                // Map fields to Google Form entries
                // Note: These must match the entry IDs in config.js
                const fieldMap = {
                    name: "entry.1391267600",
                    email: "entry.1651304702",
                    company: "entry.1198720599",
                    inquiry: "entry.2042879415",
                    message: "entry.1417246703"
                };

                for (const [key, value] of formData.entries()) {
                    if (fieldMap[key]) {
                        body.append(fieldMap[key], value);
                    }
                }

                const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfBJzdViMqg5LPIXMdVmhEYPz7ffLA4nc3406nU6LT8jCuFFw/formResponse";

                await fetch(googleFormUrl, {
                    method: 'POST',
                    body: body,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });

                // Google Forms returns 200 on success (or we assume success if no error thrown)
                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (error) {
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        try {
            // Attempt to fetch the asset
            let response = await env.ASSETS.fetch(request);

            // If the asset is not found (404) and it's not an API call, serve index.html for SPA routing
            if (response.status === 404 && !url.pathname.startsWith('/api/')) {
                const indexRequest = new Request(new URL('/index.html', request.url), request);
                return await env.ASSETS.fetch(indexRequest);
            }

            return response;
        } catch (e) {
            return new Response("Internal Error", { status: 500 });
        }
    },
};
