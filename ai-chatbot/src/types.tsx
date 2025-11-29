export const Role = {
  USER: 'user',
  MODEL: 'model',
} as const;
export type Role = typeof Role[keyof typeof Role];

export const ConnectionStatus = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;
export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus];

export type Theme = 'light' | 'dark';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  status: ConnectionStatus;
  isStreaming: boolean;
}

// Configuration constants
export const MODEL_NAME = 'gemini-2.5-flash';
export const SYSTEM_INSTRUCTION = `You are a helpful, witty, and precise AI assistant. 
You answer questions clearly using Markdown formatting. You can use emojis to make your responses more engaging but at appropriate times.
If the user asks for code, provide it in code blocks with language tags.
Keep your responses concise but helpful.`;