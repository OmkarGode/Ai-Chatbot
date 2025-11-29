import React from 'react';
import { Header } from './components/Header';
import { ChatList } from './components/ChatList';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';
import { useTheme } from './hooks/useTheme';
import { ConnectionStatus } from './types';

const App: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    connectionStatus, 
    clearChat, 
    isStreaming,
    retryConnection
  } = useChat();
  
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-screen max-h-screen transition-colors duration-300 bg-slate-50 dark:bg-gray-950">
      <Header 
        connectionStatus={connectionStatus} 
        onClearChat={clearChat}
        onRetryConnection={retryConnection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <main className="flex-1 overflow-hidden relative flex flex-col max-w-5xl w-full mx-auto shadow-2xl shadow-slate-200/50 dark:shadow-black/50 bg-white dark:bg-gray-950 md:border-x border-slate-200 dark:border-gray-800 transition-colors duration-300">
        <div className="flex-1 overflow-y-auto relative scroll-smooth">
           {messages.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 p-8 text-center opacity-80 animate-in fade-in zoom-in duration-500">
                <div className="mb-6 bg-slate-100 dark:bg-gray-800/50 p-6 rounded-3xl shadow-inner ring-1 ring-slate-200 dark:ring-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-slate-700 dark:text-gray-200">Welcome to AI Chatbot</h2>
                <p className="max-w-md text-slate-500 dark:text-gray-400 leading-relaxed">
                  Start a conversation to see real-time AI Chatbot. 
                </p>
             </div>
           )}
           <ChatList messages={messages} isStreaming={isStreaming} />
        </div>
        
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/90 backdrop-blur-md transition-colors duration-300 z-10">
          <ChatInput 
            onSendMessage={sendMessage} 
            disabled={isStreaming || connectionStatus !== ConnectionStatus.CONNECTED} 
          />
          <div className="text-center mt-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-gray-600">
              Press Enter to send, Shift + Enter for new line
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;