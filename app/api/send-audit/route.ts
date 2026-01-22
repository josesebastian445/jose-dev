export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    // 🔥 FIX: Dynamically import Resend ONLY inside this runtime function
    const { Resend } = await import("resend");

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, website, message, _hp } = await req.json();

    if (_hp) return NextResponse.json({ ok: true });

    if (!name || !email || !website) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const db = await getDatabase();
    await db.collection('audit_requests').insertOne({
      name,
      email,
      website,
      message: message || null,
      submittedAt: new Date(),
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    });

    // Admin email
    await resend.emails.send({
      from: process.env.AUDIT_FROM_EMAIL!,
      to: process.env.AUDIT_TO_EMAIL!,
      subject: `New Audit Request — ${website}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}
Website: ${website}

Message:
${message || "(none)"}

Submitted: ${new Date().toISOString()}
      `
    });

    // Auto-reply
    await resend.emails.send({
      from: process.env.AUDIT_FROM_EMAIL!,
      to: email,
      subject: `Got your audit request for ${website}`,
      replyTo: process.env.AUDIT_TO_EMAIL!,
      text: `Hi ${name},

Thanks for requesting a free website audit. I’ll review your site and send a summary soon.

— Jose`
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("SEND-AUDIT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Email send failed" },
      { status: 500 }
    );
  }
}
