"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function NewChatPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // First, find the user by username
      const userRes = await fetch(`/api/users/by-username/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.ok) {
        throw new Error("User not found");
      }

      const { id: targetUserId } = await userRes.json();

      // Create a private chat with the user
      const chatRes = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "PRIVATE",
          targetUserId,
        }),
      });

      if (!chatRes.ok) {
        const error = await chatRes.json();
        throw new Error(error.message || "Failed to create chat");
      }

      const chat = await chatRes.json();
      toast.success("Chat created successfully!");
      
      // Redirect to the new chat
      setTimeout(() => {
        router.push(`/chat/${chat.id}`);
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create chat";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Chat</h1>
        <Link
          href="/chat"
          className="text-[#14a4eb] hover:underline"
        >
          Back to Chats
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username to start a chat"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14a4eb] focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="w-full bg-[#14a4eb] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Start Chat"
          )}
        </button>
      </form>
    </div>
  );
}