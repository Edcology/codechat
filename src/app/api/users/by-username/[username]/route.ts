import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // 1. Get token from header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3. Find user by username
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't allow creating chat with self
    if (user.id === userId) {
      return NextResponse.json(
        { error: "Cannot create chat with yourself" },
        { status: 400 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in /api/users/by-username/[username] GET:", error);
    return NextResponse.json(
      { error: "Failed to find user" },
      { status: 500 }
    );
  }
}