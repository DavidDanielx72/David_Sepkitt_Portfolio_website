import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const safeName = String(name).slice(0, 200);
    const safeEmail = String(email).slice(0, 200);
    const safeMessage = String(message).slice(0, 5000);

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: safeName,
        email: safeEmail,
        message: safeMessage,
      }),
    });

    if (!insertRes.ok) {
      const text = await insertRes.text().catch(() => "");
      console.error("Insert failed:", insertRes.status, text);
      return new Response(JSON.stringify({ ok: false, error: "Failed to store message" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipientEmail = Deno.env.get("PORTFOLIO_RECIPIENT_EMAIL");

    if (resendApiKey && recipientEmail) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: recipientEmail,
            reply_to: safeEmail,
            subject: `New portfolio message from ${safeName}`,
            html: [
              `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1a1a1a">`,
              `<h2 style="margin:0 0 16px">New message from your portfolio</h2>`,
              `<p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(safeName)}</p>`,
              `<p style="margin:0 0 8px"><strong>Email:</strong> <a href="mailto:${escapeHtml(safeEmail)}" style="color:#d4b576">${escapeHtml(safeEmail)}</a></p>`,
              `<p style="margin:0 0 8px"><strong>Message:</strong></p>`,
              `<div style="background:#f5f3ee;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.6">${escapeHtml(safeMessage)}</div>`,
              `<p style="margin-top:24px;color:#888;font-size:12px">Sent from your portfolio contact form</p>`,
              `</div>`,
            ].join(""),
          }),
        });

        if (!emailRes.ok) {
          const errText = await emailRes.text().catch(() => "");
          console.error("Resend failed:", emailRes.status, errText);
        }
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY or PORTFOLIO_RECIPIENT_EMAIL not set — message stored but not emailed");
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ ok: false, error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
