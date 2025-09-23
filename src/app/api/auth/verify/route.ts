import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/verify/error?reason=missing", req.url));
    }

    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/verify/error?reason=invalid", req.url));
    }

    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      return NextResponse.redirect(new URL("/verify/error?reason=expired", req.url));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return NextResponse.redirect(new URL("/verify/success", req.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/verify/error?reason=server", req.url));
  }
}
