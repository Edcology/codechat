import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../../lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token & expiry (24 hours)
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user with verification details
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        verificationToken: token,
        verificationTokenExpiry: expiry,
      },
    });

    let globalChat = await prisma.chat.findFirst({
      where: {type: 'GLOBAL'}
    })

    if (!globalChat) {
      globalChat = await prisma.chat.create({
        data: {
          name: "Global Chat",
          type: "GLOBAL"
        }
      })
    }

    await prisma.chatMember.create({
      data: {
        userId: user.id,
        chatId: globalChat.id,
      },
    });

    await sendVerificationEmail(email, token);

    // For now, just return the token (later we’ll email it)
    return NextResponse.json(
      {
        message: "Signup successful. Please check your email to verify your account.",
        verificationToken: token, // ⚠️ just for testing, remove later
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
