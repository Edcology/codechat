import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
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

    // 3. Get chats
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    // Format chats before sending
    const formattedChats = chats.map(chat => ({
      ...chat,
      lastMessage: chat.messages[0] || null
    }));

    console.log('Sending chats:', formattedChats);
    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("Error in /api/chat GET:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}
