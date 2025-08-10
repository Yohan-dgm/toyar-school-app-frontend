import { renderHook, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useChat } from "../src/hooks/useChat";
import { DeepSeekAPI } from "../src/services/api";
import { Security } from "../src/utils/security";

// Mock dependencies
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../src/services/api");
jest.mock("../src/utils/security");
jest.mock("@env", () => ({
  DEEPSEEK_API_KEY: "test-key",
  DEEPSEEK_BASE_URL: "https://test.api.com",
  APP_SECRET: "test-secret",
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockDeepSeekAPI = DeepSeekAPI as jest.Mocked<typeof DeepSeekAPI>;
const mockSecurity = Security as jest.Mocked<typeof Security>;

describe("Chat Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();

    // Mock security checks
    mockSecurity.EnhancedRateLimiter.checkLimit.mockResolvedValue({
      allowed: true,
      remaining: 10,
      resetTime: Date.now() + 60000,
    });

    mockSecurity.RequestValidator.validateMessageContent.mockReturnValue({
      valid: true,
    });

    mockSecurity.ContentSanitizer.sanitizeInput.mockImplementation(
      (input) => input,
    );
    mockSecurity.SessionManager.validateSession.mockResolvedValue({
      valid: true,
      sessionId: "test-session",
    });
  });

  describe("useChat Hook", () => {
    it("should initialize with empty messages", () => {
      const { result } = renderHook(() => useChat());

      expect(result.current.messages).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isStreaming).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should add messages correctly", () => {
      const { result } = renderHook(() => useChat());

      const testMessage = {
        id: "test-1",
        role: "user" as const,
        content: "Hello",
        timestamp: new Date(),
      };

      act(() => {
        result.current.addMessage(testMessage);
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0]).toEqual(testMessage);
    });

    it("should send message and get response", async () => {
      const mockResponse = {
        id: "response-1",
        object: "chat.completion" as const,
        created: Date.now(),
        model: "deepseek-chat",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant" as const,
              content: "Hello! How can I help you?",
            },
            finish_reason: "stop" as const,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 15,
          total_tokens: 25,
        },
      };

      mockDeepSeekAPI.fetchResponse.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.sendMessage("Hello", false);
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].role).toBe("user");
      expect(result.current.messages[0].content).toBe("Hello");
      expect(result.current.messages[1].role).toBe("assistant");
      expect(result.current.messages[1].content).toBe(
        "Hello! How can I help you?",
      );
    });

    it("should handle API errors gracefully", async () => {
      const mockError = new Error("API Error");
      mockDeepSeekAPI.fetchResponse.mockRejectedValue(mockError);

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.sendMessage("Hello", false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.messages).toHaveLength(2); // User message + error message
      expect(result.current.messages[1].error).toBeTruthy();
    });

    it("should clear chat correctly", () => {
      const { result } = renderHook(() => useChat());

      // Add some messages first
      act(() => {
        result.current.addMessage({
          id: "test-1",
          role: "user",
          content: "Hello",
          timestamp: new Date(),
        });
      });

      expect(result.current.messages).toHaveLength(1);

      act(() => {
        result.current.clearChat();
      });

      expect(result.current.messages).toHaveLength(0);
      expect(result.current.error).toBe(null);
    });

    it("should save and load history", async () => {
      const testMessages = [
        {
          id: "test-1",
          role: "user" as const,
          content: "Hello",
          timestamp: new Date().toISOString(),
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testMessages));

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.loadHistory();
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].content).toBe("Hello");
    });
  });

  describe("Security Validation", () => {
    it("should validate message content", () => {
      const validMessage = "Hello, how are you?";
      const invalidMessage = '<script>alert("xss")</script>';

      mockSecurity.RequestValidator.validateMessageContent
        .mockReturnValueOnce({ valid: true })
        .mockReturnValueOnce({ valid: false, error: "Invalid content" });

      const validResult =
        Security.RequestValidator.validateMessageContent(validMessage);
      const invalidResult =
        Security.RequestValidator.validateMessageContent(invalidMessage);

      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toBe("Invalid content");
    });

    it("should check rate limits", async () => {
      mockSecurity.EnhancedRateLimiter.checkLimit
        .mockResolvedValueOnce({
          allowed: true,
          remaining: 5,
          resetTime: Date.now() + 60000,
        })
        .mockResolvedValueOnce({
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + 60000,
          reason: "Rate limit exceeded",
        });

      const allowedResult = await Security.EnhancedRateLimiter.checkLimit();
      const blockedResult = await Security.EnhancedRateLimiter.checkLimit();

      expect(allowedResult.allowed).toBe(true);
      expect(allowedResult.remaining).toBe(5);
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.reason).toBe("Rate limit exceeded");
    });

    it("should sanitize input content", () => {
      const dirtyInput = '<script>alert("xss")</script>Hello';
      const cleanInput = "Hello";

      mockSecurity.ContentSanitizer.sanitizeInput.mockReturnValue(cleanInput);

      const result = Security.ContentSanitizer.sanitizeInput(dirtyInput);
      expect(result).toBe(cleanInput);
    });
  });

  describe("API Integration", () => {
    it("should make API requests with proper headers", async () => {
      const mockMessages = [
        {
          id: "test-1",
          role: "user" as const,
          content: "Hello",
          timestamp: new Date(),
        },
      ];

      const mockResponse = {
        id: "response-1",
        object: "chat.completion" as const,
        created: Date.now(),
        model: "deepseek-chat",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant" as const,
              content: "Hello! How can I help you?",
            },
            finish_reason: "stop" as const,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 15,
          total_tokens: 25,
        },
      };

      mockDeepSeekAPI.fetchResponse.mockResolvedValue(mockResponse);

      await DeepSeekAPI.fetchResponse(mockMessages);

      expect(mockDeepSeekAPI.fetchResponse).toHaveBeenCalledWith(
        mockMessages,
        expect.objectContaining({
          stream: false,
        }),
      );
    });

    it("should handle streaming responses", async () => {
      const mockMessages = [
        {
          id: "test-1",
          role: "user" as const,
          content: "Hello",
          timestamp: new Date(),
        },
      ];

      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue({
            id: "stream-1",
            object: "chat.completion.chunk" as const,
            created: Date.now(),
            model: "deepseek-chat",
            choices: [
              {
                index: 0,
                delta: { content: "Hello" },
                finish_reason: null,
              },
            ],
          });
          controller.close();
        },
      });

      mockDeepSeekAPI.fetchResponse.mockResolvedValue(mockStream);

      const result = await DeepSeekAPI.fetchResponse(mockMessages, {
        stream: true,
      });

      expect(result).toBeInstanceOf(ReadableStream);
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      networkError.name = "NetworkError";

      mockDeepSeekAPI.fetchResponse.mockRejectedValue(networkError);

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.sendMessage("Hello", false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.type).toBe("network");
    });

    it("should handle rate limit errors", async () => {
      mockSecurity.EnhancedRateLimiter.checkLimit.mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 60000,
        reason: "Rate limit exceeded",
      });

      const { result } = renderHook(() => useChat());

      await act(async () => {
        await result.current.sendMessage("Hello", false);
      });

      // Should not send message when rate limited
      expect(result.current.messages).toHaveLength(0);
    });
  });
});
