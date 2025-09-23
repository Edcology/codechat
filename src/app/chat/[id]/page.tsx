'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
  };
};

type ChatMember = {
  user: {
    id: string;
    username: string;
    email: string;
  };
  role: 'ADMIN' | 'MEMBER';
};

type Chat = {
  id: string;
  type: 'PRIVATE' | 'GROUP';
  name?: string;
  members: ChatMember[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { messages, sendMessage, isConnected, error } = useChat(params.id as string);

  // Get current user ID from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
    }
  }, []);

  const fetchChat = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/chats/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat');
      }

      const data = await response.json();
      setChat(data);
    } catch (err) {
      console.error('Failed to fetch chat:', err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chat) return;
    
    // Send message through WebSocket
    sendMessage(message.trim());
    setMessage('');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Chat not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white shadow px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/chat')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Back to chat list"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" 
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold">
              {chat.type === 'GROUP' 
                ? chat.name 
                : chat.members.find(m => m.user.id !== currentUserId)?.user.username}
            </h1>
            <p className="text-sm text-gray-500">
              {chat.members.length} members
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          if (!currentUserId) return null;
          const isSender = msg.sender.id === currentUserId;
          
          return (
            <div
              key={msg.id}
              className={`flex items-end space-x-2 ${
                isSender ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar for both sender and receiver */}
              <div className="flex-shrink-0 w-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isSender ? 'bg-[#14a4eb] text-white' : 'bg-gray-300 text-gray-700'
                }`}>
                  {msg.sender.username.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isSender 
                    ? 'bg-[#14a4eb] text-white rounded-tr-none ml-2' 
                    : 'bg-white rounded-tl-none mr-2 shadow-sm'
                }`}
              >
                {/* Username for receiver's messages */}
                {!isSender && (
                  <div className="text-xs text-gray-500 mb-1">
                    {msg.sender.username}
                  </div>
                )}
                <div className="break-words">{msg.content}</div>
                <div className={`text-xs ${isSender ? 'text-white/75' : 'text-gray-400'} mt-1`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="bg-white px-6 py-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnected ? 'Send' : 'Connecting...'}
          </button>
        </div>
      </form>
      
      {/* Connection Status */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}