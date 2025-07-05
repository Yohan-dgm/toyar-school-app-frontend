import React, { createContext, useContext, ReactNode } from 'react';
import { useChat, ChatState } from '../hooks/useChat';

// Create context
const ChatContext = createContext<ChatState | undefined>(undefined);

// Provider component
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const chatState = useChat();

  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use chat context
export const useChatContext = (): ChatState => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

// HOC for components that need chat context
export const withChatContext = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <ChatProvider>
      <Component {...props} />
    </ChatProvider>
  );
};
