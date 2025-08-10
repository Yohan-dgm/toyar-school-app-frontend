import axios, { AxiosResponse } from "axios";
import { ENV_CONFIG } from "../config/env";
import * as Application from "expo-application";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChatMessage,
  DeepSeekRequest,
  DeepSeekResponse,
  DeepSeekStreamResponse,
  ApiError,
  RateLimitState,
} from "../types/chat";

// Constants
const DEFAULT_MODEL = ENV_CONFIG.DEEPSEEK_MODEL;
const MAX_TOKENS = 4000;
const DEFAULT_TEMPERATURE = 0.7;
const RATE_LIMIT_KEY = "rate_limit_state";

// Security utilities
class SecurityManager {
  private static deviceId: string | null = null;

  static async getDeviceId(): Promise<string> {
    if (this.deviceId) return this.deviceId;

    try {
      const androidId = Application.getAndroidId();
      this.deviceId = androidId || Device.osInternalBuildId || "unknown";
      return this.deviceId;
    } catch {
      this.deviceId = "fallback-" + Date.now();
      return this.deviceId;
    }
  }

  static generateNonce(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  static async createSignature(
    payload: string,
    timestamp: number,
    nonce: string,
  ): Promise<string> {
    const deviceId = await this.getDeviceId();
    const message = `${payload}${timestamp}${nonce}${deviceId}`;
    // Simple hash for development - replace with proper HMAC in production
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  static obfuscateApiKey(key: string): string {
    // Simple obfuscation - in production, use more sophisticated methods
    const parts = key.split("-");
    if (parts.length >= 2) {
      return (
        parts[0] +
        "-" +
        "*".repeat(parts[1].length) +
        "-" +
        parts.slice(2).join("-")
      );
    }
    return (
      key.substring(0, 6) +
      "*".repeat(key.length - 12) +
      key.substring(key.length - 6)
    );
  }
}

// Rate limiting
class RateLimiter {
  private static async getRateLimitState(): Promise<RateLimitState> {
    try {
      const stored = await AsyncStorage.getItem(RATE_LIMIT_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load rate limit state:", error);
    }

    return {
      requests: 0,
      windowStart: Date.now(),
      isLimited: false,
    };
  }

  private static async saveRateLimitState(
    state: RateLimitState,
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save rate limit state:", error);
    }
  }

  static async checkRateLimit(): Promise<{
    allowed: boolean;
    resetTime?: number;
  }> {
    const state = await this.getRateLimitState();
    const now = Date.now();
    const windowDuration = 60000; // 1 minute
    const maxRequests = 10;

    // Reset window if expired
    if (now - state.windowStart > windowDuration) {
      state.requests = 0;
      state.windowStart = now;
      state.isLimited = false;
    }

    // Check if rate limited
    if (state.requests >= maxRequests) {
      state.isLimited = true;
      await this.saveRateLimitState(state);
      return {
        allowed: false,
        resetTime: state.windowStart + windowDuration,
      };
    }

    // Increment request count
    state.requests++;
    await this.saveRateLimitState(state);

    return { allowed: true };
  }
}

// Error handling
class ApiErrorHandler {
  static createError(
    message: string,
    type: ApiError["type"],
    code?: string,
    status?: number,
  ): ApiError {
    return { message, type, code, status };
  }

  static handleAxiosError(error: any): ApiError {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.message;

      switch (status) {
        case 401:
          return this.createError(
            "Invalid API key",
            "auth",
            "UNAUTHORIZED",
            status,
          );
        case 429:
          return this.createError(
            "Rate limit exceeded",
            "rate_limit",
            "RATE_LIMITED",
            status,
          );
        case 500:
          return this.createError(
            "Server error",
            "api",
            "SERVER_ERROR",
            status,
          );
        default:
          return this.createError(message, "api", "API_ERROR", status);
      }
    } else if (error.request) {
      return this.createError("Network error", "network", "NETWORK_ERROR");
    } else {
      return this.createError(
        error.message || "Unknown error",
        "unknown",
        "UNKNOWN_ERROR",
      );
    }
  }
}

// Main API class
export class DeepSeekAPI {
  private static baseURL = ENV_CONFIG.OPENROUTER_BASE_URL;
  private static apiKey = ENV_CONFIG.OPENROUTER_API_KEY;

  static async fetchResponse(
    messages: ChatMessage[],
    options: {
      stream?: boolean;
      model?: string;
      maxTokens?: number;
      temperature?: number;
    } = {},
  ): Promise<DeepSeekResponse | ReadableStream<DeepSeekStreamResponse>> {
    // Rate limiting check
    const rateLimitCheck = await RateLimiter.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      throw ApiErrorHandler.createError(
        `Rate limit exceeded. Try again after ${new Date(rateLimitCheck.resetTime!).toLocaleTimeString()}`,
        "rate_limit",
      );
    }

    // Prepare request
    const payload: DeepSeekRequest = {
      model: options.model || DEFAULT_MODEL,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: options.stream || false,
      max_tokens: options.maxTokens || MAX_TOKENS,
      temperature: options.temperature || DEFAULT_TEMPERATURE,
    };

    // Create security signature
    const timestamp = Date.now();
    const nonce = SecurityManager.generateNonce();
    const signature = await SecurityManager.createSignature(
      JSON.stringify(payload),
      timestamp,
      nonce,
    );

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": ENV_CONFIG.SITE_URL,
            "X-Title": ENV_CONFIG.SITE_NAME,
            "X-Timestamp": timestamp.toString(),
            "X-Nonce": nonce,
            "X-Signature": signature,
          },
          responseType: options.stream ? "stream" : "json",
        },
      );

      if (options.stream) {
        return this.handleStreamResponse(response);
      } else {
        return response.data as DeepSeekResponse;
      }
    } catch (error) {
      throw ApiErrorHandler.handleAxiosError(error);
    }
  }

  private static handleStreamResponse(
    response: AxiosResponse,
  ): ReadableStream<DeepSeekStreamResponse> {
    const reader = response.data.getReader();

    return new ReadableStream({
      start(controller) {
        function pump(): Promise<void> {
          return reader
            .read()
            .then(({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
              if (done) {
                controller.close();
                return;
              }

              try {
                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split("\n").filter((line) => line.trim());

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[DONE]") {
                      controller.close();
                      return;
                    }

                    const parsed = JSON.parse(data) as DeepSeekStreamResponse;
                    controller.enqueue(parsed);
                  }
                }
              } catch (error) {
                controller.error(error);
                return;
              }

              return pump();
            });
        }

        return pump();
      },
    });
  }
}

// Convenience functions
export const fetchDeepSeekResponse = async (
  messages: ChatMessage[],
  stream = false,
): Promise<DeepSeekResponse | ReadableStream<DeepSeekStreamResponse>> => {
  return DeepSeekAPI.fetchResponse(messages, { stream });
};

export const fetchDeepSeekStreamResponse = async (
  messages: ChatMessage[],
): Promise<ReadableStream<DeepSeekStreamResponse>> => {
  return DeepSeekAPI.fetchResponse(messages, { stream: true }) as Promise<
    ReadableStream<DeepSeekStreamResponse>
  >;
};

// Utility functions
export const getObfuscatedApiKey = (): string => {
  return SecurityManager.obfuscateApiKey(ENV_CONFIG.OPENROUTER_API_KEY);
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const testMessage: ChatMessage = {
      id: "health-check",
      role: "user",
      content: "Hello",
      timestamp: new Date(),
    };

    await DeepSeekAPI.fetchResponse([testMessage], { maxTokens: 1 });
    return true;
  } catch {
    return false;
  }
};
