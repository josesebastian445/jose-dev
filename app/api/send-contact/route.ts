export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    // 🔥 FIX: Dynamically import Resend ONLY inside this runtime function
    const { Resend } = await import("resend");

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, subject, message, _hp } = await req.json();

    if (_hp) return NextResponse.json({ ok: true });

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const db = await getDatabase();
    await db.collection('contact_submissions').insertOne({
      name,
      email,
      subject,
      message,
      submittedAt: new Date(),
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    });

    // Admin email
    await resend.emails.send({
      from: process.env.AUDIT_FROM_EMAIL!,
      to: process.env.AUDIT_TO_EMAIL!,
      subject: `New Contact Form — ${subject}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Submitted: ${new Date().toISOString()}
      `
    });

    // Auto-reply
    await resend.emails.send({
      from: process.env.AUDIT_FROM_EMAIL!,
      to: email,
      subject: `Got your message: "${subject}"`,
      replyTo: process.env.AUDIT_TO_EMAIL!,
      text: `Hi ${name},

Thanks for reaching out. I've received your message and will get back to you soon.

Best regards,
Jose
      `.trim()
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
