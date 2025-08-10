// Chat Message Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  error?: string;
}

// DeepSeek API Types
export interface DeepSeekMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

export interface DeepSeekChoice {
  index: number;
  message: DeepSeekMessage;
  finish_reason: "stop" | "length" | "content_filter" | null;
}

export interface DeepSeekStreamChoice {
  index: number;
  delta: {
    role?: string;
    content?: string;
  };
  finish_reason: "stop" | "length" | "content_filter" | null;
}

export interface DeepSeekResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: DeepSeekChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DeepSeekStreamResponse {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: DeepSeekStreamChoice[];
}

// Error Types
export interface ApiError {
  message: string;
  type: "network" | "api" | "rate_limit" | "auth" | "unknown";
  code?: string;
  status?: number;
}

// Rate Limiting Types
export interface RateLimitState {
  requests: number;
  windowStart: number;
  isLimited: boolean;
}

// Security Types
export interface RequestSignature {
  timestamp: number;
  signature: string;
  nonce: string;
}
