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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipientEmail = Deno.env.get("PORTFOLIO_RECIPIENT_EMAIL") ?? "davidsepkitt@gmail.com";

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 1. Persist the message to the messages table using the service role key
    //    (bypasses RLS so the edge function can always insert).
    let insertError: string | null = null;
    if (supabaseUrl && serviceRoleKey) {
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/messages`, {
        method: "POST",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (!insertRes.ok) {
        insertError = `Insert failed (${insertRes.status})`;
      }
    }

    // 2. Send email via Resend if a key is configured.
    let emailSent = false;
    let emailError: string | null = null;
    if (resendApiKey) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio <onboarding@resend.dev>",
            to: [recipientEmail],
            reply_to: email,
            subject: `New portfolio message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
          }),
        });
        emailSent = emailRes.ok;
        if (!emailRes.ok) {
          emailError = `Resend ${emailRes.status}`;
        }
      } catch (e) {
        emailError = e instanceof Error ? e.message : "Email send failed";
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        stored: !insertError,
        emailSent,
        emailError,
        insertError,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
