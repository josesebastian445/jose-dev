import { NextResponse } from "next/server";
import { Resend } from "resend";

// Prevent static optimization — Cloudflare will treat as runtime API
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Create client ONLY at runtime — not during build
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, website, message, _hp } = await req.json();

    // Honeypot for spam bots
    if (_hp) return NextResponse.json({ ok: true });

    // Validation
    if (!name || !email || !website) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // =========================================================
    // 1) SEND NOTIFICATION EMAIL TO ADMIN
    // =========================================================
    await resend.emails.send({
      from: process.env.AUDIT_FROM_EMAIL!,
      to: process.env.AUDIT_TO_EMAIL!,
      subject: `New Audit Request — ${website}`,
      replyTo: email,
      text: [
        `New Free Audit Request`,
        `--------------------------------`,
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Website: ${website}`,
        ``,
        `Message:`,
        `${message || "(none)"}`,
        ``,
        `Submitted: ${new Date().toISOString()}`
      ].join("\n"),
    });

    // =========================================================
    // 2) AUTO-REPLY TO USER
    // =========================================================
    await resend.emails.send({
      from: process.env.AUDIT_FROM_EMAIL!,
      to: email,
      subject: `Got your audit request for ${website}`,
      replyTo: process.env.AUDIT_TO_EMAIL!,
      text: `Hi ${name},

Thanks for requesting a free website audit. I’ll review your site and send a summary covering:

• Performance (Core Web Vitals, Lighthouse)
• Security (headers, WAF/CDN, SSL, exposure)
• SEO technical health (crawlability, metadata)

You can reply to this email with any extra context or priorities.

— Jose
`,
    });

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("SEND-AUDIT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Email send failed" },
      { status: 500 }
    );
  }
}
