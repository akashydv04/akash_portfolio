import nodemailer from 'nodemailer';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        // Handle form submission via SMTP
        if (request.method === 'POST' && url.pathname === '/api/submit') {
            try {
                const formData = await request.formData();
                
                const name = formData.get('name');
                const email = formData.get('email');
                const company = formData.get('company') || 'N/A';
                const inquiry = formData.get('inquiry') || 'General';
                const message = formData.get('message');

                // Validate required fields
                if (!name || !email || !message) {
                    throw new Error('Missing required fields');
                }

                // Create transporter
                // Note: In a real production environment, use environment variables for secrets.
                // For this session, we use the provided credentials.
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'akashydv04@gmail.com',
                        pass: 'lris tchi nwvd apgh'
                    }
                });

                const mailOptions = {
                    from: `"Portfolio Contact" <akashydv04@gmail.com>`,
                    to: 'yadav0427@gmail.com',
                    replyTo: email,
                    subject: `New Portfolio Inquiry: ${inquiry}`,
                    text: `
Name: ${name}
Email: ${email}
Company: ${company}
Inquiry Type: ${inquiry}

Message:
${message}
                    `,
                    html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Company:</strong> ${company}</p>
<p><strong>Inquiry Type:</strong> ${inquiry}</p>
<br/>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
                    `
                };

                await transporter.sendMail(mailOptions);

                return new Response(JSON.stringify({ success: true }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });

            } catch (error) {
                console.error('SMTP Error:', error);
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
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
            console.error('Asset fetch error:', e);
            return new Response("Internal Error", { status: 500 });
        }
    },
};
