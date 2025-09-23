import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export type Message = {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
  createdAt: string;
  sender: {
    id: string;
    username: string;
    email: string;
  };
};

export function useChat(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    // Connect to WebSocket server
    socketRef.current = io('http://localhost:3001', {
      auth: { token },
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      // Join the chat room
      socket.emit('join', chatId);
    });

    socket.on('connect_error', (err) => {
      setIsConnected(false);
      setError(err.message);
    });

    socket.on('chatHistory', (history: Message[]) => {
      setMessages(history);
    });

    socket.on('message', (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage]);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  const sendMessage = useCallback((content: string, type: Message['type'] = 'TEXT') => {
    if (!socketRef.current || !isConnected) {
      setError('Not connected to chat');
      return;
    }

    socketRef.current.emit('message', {
      chatId,
      content,
      type,
    });
  }, [chatId, isConnected]);

  return {
    messages,
    sendMessage,
    isConnected,
    error,
  };
}