import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; 
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Create JWT
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      username: user.username
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // 4. Send token and user data in response
    const response = NextResponse.json({ 
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
    // Also set as cookie for additional security
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
