import React, { useEffect, useRef } from 'react';
import { type Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatListProps {
  messages: Message[];
  isStreaming: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({ messages, isStreaming }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 pb-4">
      {messages.map((msg, index) => (
        <ChatMessage 
          key={msg.id} 
          message={msg} 
          isLast={index === messages.length - 1} 
        />
      ))}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
};