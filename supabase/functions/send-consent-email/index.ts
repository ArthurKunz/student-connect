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
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          Einwilligung erforderlichx: Zustimmung zur Anmeldung bei StudentNet.
        </div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f7fb;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;">
                <tr>
                  <td style="padding:0 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                      style="background:#ffffff;border:1px solid #e7e9f0;border-radius:14px;overflow:hidden;">
                      <tr>
                        <td style="padding:22px 22px 10px 22px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                          <div style="font-size:14px;color:#6b7280;">StudentNet</div>
                          <div style="font-size:20px;line-height:1.3;color:#111827;font-weight:700;margin-top:8px;">
                            Einwilligung erforderlich
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 22px 10px 22px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                          <div style="font-size:15px;line-height:1.6;color:#111827;margin-top:10px;">
                            Hallo,
                          </div>
                          <div style="font-size:15px;line-height:1.6;color:#111827;margin-top:10px;">
                            Ihr Kind <strong>${studentName}</strong> möchte sich bei StudentNet anmelden.
                            Da Ihr Kind unter 16 Jahre alt ist, benötigen wir Ihre Zustimmung.
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 22px 6px 22px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td>
                                <a href="${approveUrl}"
                                  style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;
                                        padding:12px 16px;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                                        font-size:14px;font-weight:700;">
                                  Zustimmen
                                </a>
                              </td>
                              <td width="12"></td>
                              <td>
                                <a href="${rejectUrl}"
                                  style="display:inline-block;background:#f3f4f6;color:#111827;text-decoration:none;
                                        padding:12px 16px;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                                        font-size:14px;font-weight:700;border:1px solid #e5e7eb;">
                                  Ablehnen
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 22px 18px 22px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                          <div style="font-size:13px;line-height:1.6;color:#6b7280;">
                            Dieser Link ist 7 Tage gültig.
                          </div>
                          <div style="font-size:12px;line-height:1.6;color:#9ca3af;margin-top:12px;">
                            Falls die Buttons nicht funktionieren, kopieren Sie diese Links in den Browser:
                            <br />Zustimmen: <a href="${approveUrl}" style="color:#2563eb;text-decoration:underline;">${approveUrl}</a>
                            <br />Ablehnen: <a href="${rejectUrl}" style="color:#2563eb;text-decoration:underline;">${rejectUrl}</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                                font-size:12px;line-height:1.6;color:#9ca3af;padding:14px 6px 0 6px;">
                      Wenn Sie diese Anfrage nicht erwarten, können Sie diese E-Mail ignorieren.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `
    })
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  })
})