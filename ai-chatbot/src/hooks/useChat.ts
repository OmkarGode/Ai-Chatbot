import { useState, useEffect, useCallback, useRef } from 'react';
import { type Message, Role, ConnectionStatus } from '../types';
import { initializeGemini, sendMessageStream, resetChatSession } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

const STORAGE_KEY = 'gemini_chat_history';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTING);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Ref to track if we have attempted initialization to avoid double-init in StrictMode
  const initialized = useRef(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, []);

  // Save to local storage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Initialize Gemini API
  const connect = useCallback(async () => {
    setConnectionStatus(ConnectionStatus.CONNECTING);
    try {
      initializeGemini();
      // Simulate a small delay for "connection" visual feedback
      await new Promise(resolve => setTimeout(resolve, 800)); 
      setConnectionStatus(ConnectionStatus.CONNECTED);
    } catch (error) {
      console.error("Connection failed", error);
      setConnectionStatus(ConnectionStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      connect();
    }
  }, [connect]);

  const retryConnection = () => {
    connect();
  };

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    resetChatSession();
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || connectionStatus !== ConnectionStatus.CONNECTED) return;

    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      id: userMsgId,
      role: Role.USER,
      content: content,
      timestamp: Date.now(),
    };

    const botMsgId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
      id: botMsgId,
      role: Role.MODEL,
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    // Optimistic update
    setMessages(prev => [...prev, userMessage, initialBotMessage]);
    setIsStreaming(true);

    try {
      const stream = await sendMessageStream(content);
      
      let accumulatedText = '';

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        accumulatedText += text;

        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMsgId 
              ? { ...msg, content: accumulatedText } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId 
            ? { 
                ...msg, 
                content: msg.content + "\n\n*[Error: Failed to complete response. Please check your connection.]*", 
                isError: true 
              } 
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );
    }
  }, [connectionStatus]);

  return {
    messages,
    sendMessage,
    connectionStatus,
    isStreaming,
    clearChat,
    retryConnection
  };
};