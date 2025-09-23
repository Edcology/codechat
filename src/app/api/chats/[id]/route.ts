import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id as string;
  } catch (err) {
    console.error("JWT error:", err);
    return null;
  }
}

interface ChatContext {
  params: { id: string } | Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest,
  context: ChatContext
) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Safely resolve params, whether it's a Promise or not
    const params = await Promise.resolve(context.params);
    const chatId = params.id;

    // Get the chat and verify user is a member
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        members: {
          some: { userId }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          include: {
            sender: true
          }
        }
      }
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error in GET /api/chats/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}