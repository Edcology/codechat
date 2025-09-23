import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { jwtVerify } from "jose";

// Define request types
type CreatePrivateChatRequest = {
  type: "PRIVATE";
  targetUserId: string;
};

type CreateGroupChatRequest = {
  type: "GROUP";
  name: string;
  memberIds: string[];
};

type CreateChatRequest = CreatePrivateChatRequest | CreateGroupChatRequest;

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");

// ✅ Helper to get current user from Authorization header
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

// 📌 POST /api/chats → create private or group chat
export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as CreateChatRequest;

    if (body.type === "PRIVATE") {
      // ---- PRIVATE CHAT ----
      const { targetUserId } = body;

      // Verify target user exists
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId }
      });

      if (!targetUser) {
        return NextResponse.json(
          { error: "Target user not found" },
          { status: 404 }
        );
      }

      // Check if chat already exists
      const existingChat = await prisma.chat.findFirst({
        where: {
          type: "PRIVATE",
          members: {
            every: {
              userId: { in: [userId, targetUserId] }
            }
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
          }
        }
      });

      if (existingChat) {
        return NextResponse.json(existingChat);
      }

      // Create new private chat
      const newChat = await prisma.chat.create({
        data: {
          type: "PRIVATE",
          members: {
            create: [
              { userId, role: "MEMBER" },
              { userId: targetUserId, role: "MEMBER" }
            ]
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
          }
        }
      });

      return NextResponse.json(newChat);

    } else if (body.type === "GROUP") {
      // ---- GROUP CHAT ----
      const { name, memberIds } = body;

      if (!name || !memberIds || memberIds.length < 2) {
        return NextResponse.json(
          { error: "Group chat needs a name and at least 2 other members" },
          { status: 400 }
        );
      }

      // Filter out creator's ID if present in memberIds
      const uniqueMemberIds = memberIds.filter(id => id !== userId);

      if (uniqueMemberIds.length < 2) {
        return NextResponse.json(
          { error: "Group chat needs at least 2 other members (excluding you)" },
          { status: 400 }
        );
      }

      // Verify all members exist
      const members = await prisma.user.findMany({
        where: {
          id: { in: uniqueMemberIds }
        }
      });

      if (members.length !== uniqueMemberIds.length) {
        return NextResponse.json(
          { error: "One or more member IDs are invalid" },
          { status: 400 }
        );
      }

      const newGroup = await prisma.chat.create({
        data: {
          type: "GROUP" as const,
          name,
          members: {
            create: [
              { userId, role: "ADMIN" as const }, // creator as admin
              ...uniqueMemberIds.map(memberId => ({
                userId: memberId,
                role: "MEMBER" as const
              }))   
            ]
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
          }
        }
      });

      return NextResponse.json(newGroup);
    }

    return NextResponse.json(
      { error: "Invalid chat type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Chat creation error:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
