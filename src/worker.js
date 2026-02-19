import nodemailer from "nodemailer";

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
    if (request.method === "POST" && url.pathname === "/api/submit") {
      try {
        // Normalize and accept multiple naming conventions
        function extractFields(body) {
          return {
            name: body.name || body.fullName || "",
            email: body.email || body.workEmail || "",
            company: body.company || "",
            inquiry: body.inquiry || body.inquiryType || "",
            message: body.message || body.projectScopeOrJobRole || "",
          };
        }

        function isValidEmail(email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        const contentType = request.headers.get("content-type") || "";
        let body = {};
        if (contentType.includes("application/json")) {
          try {
            body = await request.json();
          } catch (err) {
            console.error("Invalid JSON body", err);
            return new Response(
              JSON.stringify({ success: false, error: "Invalid JSON body" }),
              {
                status: 400,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              },
            );
          }
        } else {
          const formData = await request.formData();
          // convert FormData to plain object
          body = {};
          for (const [k, v] of formData.entries()) body[k] = v;
        }

        let { name, email, company, inquiry, message } = extractFields(body);
        // Normalize strings
        name = (name || "").toString().trim();
        email = (email || "").toString().trim();
        company = (company || "").toString().trim();
        inquiry = (inquiry || "").toString().trim();
        message = (message || "").toString().trim();

        // Validation
        if (!name) {
          // Log body + request context for debugging missing name cases
          try {
            const ua = request.headers.get("user-agent") || "";
            console.error("Validation failed: missing name. user-agent:", ua, "body:", body);
          } catch (e) {
            console.error("Validation failed: missing name (failed to stringify body)");
          }
          return new Response(
            JSON.stringify({ success: false, error: "Missing full name" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        }
        if (!email)
          return new Response(
            JSON.stringify({ success: false, error: "Missing email" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        if (!isValidEmail(email))
          return new Response(
            JSON.stringify({ success: false, error: "Invalid email format" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        if (!inquiry)
          return new Response(
            JSON.stringify({ success: false, error: "Missing inquiry type" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        if (!message)
          return new Response(
            JSON.stringify({
              success: false,
              error: "Missing message / project scope",
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );

        // Create transporter using environment variables for credentials
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: env.GMAIL_USER,
            pass: env.GMAIL_APP_PASSWORD,
          },
        });

        try {
          await transporter.verify();
        } catch (err) {
          console.error("SMTP verify failed", { message: err && err.message });
          return new Response(
            JSON.stringify({
              success: false,
              error: "SMTP configuration error (verify failed)",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        }

        const mailOptions = {
          from: `"Portfolio Contact" <${env.GMAIL_USER}>`,
          to: env.GMAIL_RECEIVER || env.GMAIL_USER,
          replyTo: email,
          subject: `New Portfolio Inquiry: ${inquiry}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\nInquiry Type: ${inquiry}\n\nMessage:\n${message}`,
          html: `<h3>New Contact Form Submission</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Company:</strong> ${company || "N/A"}</p><p><strong>Inquiry Type:</strong> ${inquiry}</p><br/><p><strong>Message:</strong></p><p>${(message || "").replace(/\n/g, "<br>")}</p>`,
        };

        try {
          await transporter.sendMail(mailOptions);
        } catch (err) {
          console.error("SMTP sendMail failed", {
            message: err && err.message,
            stack: err && err.stack,
          });
          return new Response(
            JSON.stringify({ success: false, error: "Failed to send email" }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error) {
        console.error("SMTP Error:", error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
      }
    }

    try {
      // Attempt to fetch the asset
      let response = await env.ASSETS.fetch(request);

      // If the asset is not found (404) and it's not an API call, serve index.html for SPA routing
      if (response.status === 404 && !url.pathname.startsWith("/api/")) {
        const indexRequest = new Request(
          new URL("/index.html", request.url),
          request,
        );
        return await env.ASSETS.fetch(indexRequest);
      }

      return response;
    } catch (e) {
      console.error("Asset fetch error:", e);
      return new Response("Internal Error", { status: 500 });
    }
  },
};
