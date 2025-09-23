import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../../../../../lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "If the email exists, a reset link was sent." }); 
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpiry: expiry,
      },
    });

    await sendResetPasswordEmail(email, token);

    return NextResponse.json({ message: "If the email exists, a reset link was sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
