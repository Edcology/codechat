"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import Link from "next/link";

type MessageType = "TEXT" | "IMAGE" | "FILE" | "AUDIO" | "VIDEO";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  chatId: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isEdited: boolean;
  sender?: {
    id: string;
    username: string;
    email: string;
  };
}

interface ChatMember {
  id: string;
  userId: string;
  chatId: string;
  role: "ADMIN" | "MEMBER";
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface Chat {
  id: string;
  type: "PRIVATE" | "GROUP";
  name: string | null;
  createdAt: string;
  updatedAt: string;
  members: ChatMember[];
  lastMessage: Message | null;
}

interface User {
  id: string;
  username: string;
  email: string;
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    console.log('Auth check:', { hasToken: !!token, hasUserData: !!userData });
    
    if (!token || !userData) {
      console.log('Missing auth data, redirecting to login');
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      console.log('Parsed user data:', { userId: user.id });
      setUser(user);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!user) {
      console.log('No user data yet, waiting...');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log('Token missing when fetching chats');
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }

        const data = await res.json();
        console.log('Fetched chats:', data);
        setChats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load chats";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  // Handle loading state and missing user data
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-[#14a4eb] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-[#14a4eb] hover:underline cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  const getMessagePreview = (message: Message | null) => {
    if (!message) return "No messages yet";
    if (message.isDeleted) return "Message was deleted";
    
    switch (message.type) {
      case "IMAGE":
        return "📷 Image";
      case "FILE":
        return "📎 File";
      case "AUDIO":
        return "🎵 Audio message";
      case "VIDEO":
        return "🎥 Video";
      default:
        return message.content;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Link
          href="/chat/new"
          className="bg-[#14a4eb] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors"
        >
          New Chat
        </Link>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No chats yet</p>
          <Link
            href="/chat/new"
            className="text-[#14a4eb] hover:underline"
          >
            Start a new conversation
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => {
            console.log('Rendering chat:', { id: chat.id, type: chat.type, name: chat.name });
            const chatLink = `/chat/${chat.id}`;
            console.log('Chat link:', chatLink);
            
            return (
              <Link 
                key={chat.id} 
                href={chatLink}
                className="block"
              >
                <div
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">
                      {chat.type === "PRIVATE"
                        ? chat.members.find(m => m.userId !== user.id)?.user.username || "Unknown User"
                        : chat.name || "Group Chat"}
                    </div>
                  {chat.lastMessage && (
                    <div className="text-xs text-gray-500">
                      {format(new Date(chat.lastMessage.createdAt), "MMM d, h:mm a")}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  {chat.lastMessage?.isEdited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                  {getMessagePreview(chat.lastMessage)}
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
