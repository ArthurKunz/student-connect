import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // This handles the browser's preflight check
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { parentEmail, studentName, token } = await req.json()

  const baseUrl = "http://localhost:3000"
  const approveUrl = baseUrl + "/consent?token=" + token + "&action=approve"
  const rejectUrl  = baseUrl + "/consent?token=" + token + "&action=reject"

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + Deno.env.get("RESEND_API_KEY")
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: parentEmail,
      subject: "Einwilligung erforderlich — Anmeldung von " + studentName,
      html: `
        <p>Hallo,</p>
        <p>Ihr Kind <strong>${studentName}</strong> möchte sich bei StudentNet anmelden.</p>
        <p>Da Ihr Kind unter 16 Jahre alt ist, benötigen wir Ihre Zustimmung.</p>
        <br/>
        <a href="${approveUrl}">Zustimmen</a>
        &nbsp;&nbsp;
        <a href="${rejectUrl}">Ablehnen</a>
        <br/>
        <p>Dieser Link ist 7 Tage gültig.</p>
      `
    })
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  })
})