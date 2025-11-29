import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MODEL_NAME, SYSTEM_INSTRUCTION } from "../types";

let client: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeGemini = (): void => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    throw new Error("API_KEY is missing");
  }

  try {
    client = new GoogleGenAI({ apiKey });
    // Initialize a new chat session
    chatSession = client.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    console.log("Gemini client initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    throw error;
  }
};

export const getChatSession = (): Chat => {
  if (!chatSession) {
    initializeGemini();
  }
  if (!chatSession) {
    throw new Error("Chat session could not be initialized");
  }
  return chatSession;
};

export const resetChatSession = (): void => {
  if (client) {
    chatSession = client.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
};

export const sendMessageStream = async (
  message: string
): Promise<AsyncGenerator<GenerateContentResponse, void, unknown>> => {
  const session = getChatSession();
  try {
    const streamResult = await session.sendMessageStream({ message });
    return streamResult;
  } catch (error) {
    console.error("Error sending message stream:", error);
    throw error;
  }
};