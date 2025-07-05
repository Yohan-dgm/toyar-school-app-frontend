import { useState, useCallback, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage, ApiError } from "../types/chat";
import {
  fetchDeepSeekResponse,
  fetchDeepSeekStreamResponse,
} from "../services/api";

// Constants
const CHAT_HISTORY_KEY = "chat_history";
const MAX_MESSAGES = 100;
const AUTO_SAVE_DELAY = 1000; // 1 second

// Chat state interface
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: ApiError | null;
  addMessage: (message: ChatMessage) => void;
  sendMessage: (content: string, useStreaming?: boolean) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  clearChat: () => void;
  deleteMessage: (messageId: string) => void;
  loadHistory: () => Promise<void>;
  saveHistory: () => Promise<void>;
}

// Custom hook for chat functionality
export const useChat = (): ChatState => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);

  // Auto-save messages when they change
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveHistory();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [messages]);

  // Generate unique message ID
  const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add message to chat
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const newMessages = [...prev, message];
      // Keep only the last MAX_MESSAGES
      if (newMessages.length > MAX_MESSAGES) {
        return newMessages.slice(-MAX_MESSAGES);
      }
      return newMessages;
    });
  }, []);

  // Update existing message
  const updateMessage = useCallback(
    (messageId: string, updates: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
      );
    },
    []
  );

  // Handle streaming response
  const handleStreamingResponse = useCallback(
    async (stream: ReadableStream, messageId: string) => {
      const reader = stream.getReader();
      let accumulatedContent = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const delta = value.choices[0]?.delta;
          if (delta?.content) {
            accumulatedContent += delta.content;

            updateMessage(messageId, {
              content: accumulatedContent,
              isStreaming: true,
            });
          }

          if (value.choices[0]?.finish_reason) {
            updateMessage(messageId, {
              content: accumulatedContent,
              isStreaming: false,
            });
            break;
          }
        }
      } catch (error) {
        console.error("Streaming error:", error);
        updateMessage(messageId, {
          error: "Streaming interrupted",
          isStreaming: false,
        });
      } finally {
        setIsStreaming(false);
        streamingMessageIdRef.current = null;
      }
    },
    [updateMessage]
  );

  // Send message to API
  const sendMessage = useCallback(
    async (content: string, useStreaming = true): Promise<void> => {
      console.log("sendMessage called with:", {
        content,
        useStreaming,
        isLoading,
        isStreaming,
      });

      if (isLoading || isStreaming) {
        console.log("Skipping send - already loading or streaming");
        return;
      }

      setError(null);

      // Add user message
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      console.log("Adding user message:", userMessage);
      addMessage(userMessage);

      // Prepare assistant message
      const assistantMessageId = generateMessageId();
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: useStreaming,
      };

      if (useStreaming) {
        setIsStreaming(true);
        streamingMessageIdRef.current = assistantMessageId;
        addMessage(assistantMessage);
      } else {
        setIsLoading(true);
      }

      try {
        // Get conversation context (last 10 messages for context)
        const contextMessages = [...messages, userMessage].slice(-10);
        console.log(
          "Sending to API with context messages:",
          contextMessages.length
        );

        if (useStreaming) {
          console.log("Using streaming response...");
          const stream = await fetchDeepSeekStreamResponse(contextMessages);
          await handleStreamingResponse(stream, assistantMessageId);
        } else {
          console.log("Using non-streaming response...");
          const response = await fetchDeepSeekResponse(contextMessages, false);
          console.log("API response received:", response);

          if ("choices" in response && response.choices[0]?.message) {
            const assistantResponse: ChatMessage = {
              id: assistantMessageId,
              role: "assistant",
              content: response.choices[0].message.content,
              timestamp: new Date(),
            };
            console.log("Adding assistant response:", assistantResponse);
            addMessage(assistantResponse);
          }
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        const error = apiError as ApiError;
        setError(error);

        if (useStreaming && streamingMessageIdRef.current) {
          updateMessage(streamingMessageIdRef.current, {
            error: error.message,
            isStreaming: false,
          });
        } else {
          const errorMessage: ChatMessage = {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
            error: error.message,
          };
          addMessage(errorMessage);
        }
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        streamingMessageIdRef.current = null;
      }
    },
    [
      messages,
      isLoading,
      isStreaming,
      addMessage,
      handleStreamingResponse,
      updateMessage,
    ]
  );

  // Retry failed message
  const retryMessage = useCallback(
    async (messageId: string): Promise<void> => {
      const message = messages.find((msg) => msg.id === messageId);
      if (!message || !message.error) return;

      // Find the user message that preceded this failed message
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);
      if (messageIndex <= 0) return;

      const userMessage = messages[messageIndex - 1];
      if (userMessage.role !== "user") return;

      // Remove the failed message
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      // Retry sending
      await sendMessage(userMessage.content);
    },
    [messages, sendMessage]
  );

  // Clear all messages
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
    streamingMessageIdRef.current = null;
  }, []);

  // Delete specific message
  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  // Load chat history from storage
  const loadHistory = useCallback(async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        const parsedMessages = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.warn("Failed to load chat history:", error);
    }
  }, []);

  // Save chat history to storage
  const saveHistory = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn("Failed to save chat history:", error);
    }
  }, [messages]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    addMessage,
    sendMessage,
    retryMessage,
    clearChat,
    deleteMessage,
    loadHistory,
    saveHistory,
  };
};
