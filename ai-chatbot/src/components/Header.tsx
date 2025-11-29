import React from "react";
import { ConnectionStatus } from "../types";
import type { Theme } from "../types";
import { Trash2, RotateCw, Sun, Moon } from "lucide-react";

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  onClearChat: () => void;
  onRetryConnection: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  onClearChat,
  onRetryConnection,
  theme,
  onToggleTheme,
}) => {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return "text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20";
      case ConnectionStatus.CONNECTING:
        return "text-amber-600 dark:text-yellow-500 bg-amber-50 dark:bg-yellow-500/10 border-amber-200 dark:border-yellow-500/20";
      case ConnectionStatus.ERROR:
        return "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20";
      default:
        return "text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-gray-500/10 border-slate-200 dark:border-gray-500/20";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return "Connected";
      case ConnectionStatus.CONNECTING:
        return "Connecting...";
      case ConnectionStatus.ERROR:
        return "Connection Error";
      default:
        return "Disconnected";
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full backdrop-blur-md bg-white/70 dark:bg-gray-950/80 border-b border-slate-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white w-6 h-6"
            >
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
          </div> */}
          <div>
            <h1 className="font-bold text-lg text-slate-800 dark:text-gray-100 leading-tight tracking-tight">
              AI Chatbot
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()} transition-colors duration-300`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    connectionStatus === ConnectionStatus.CONNECTED
                      ? "bg-green-500"
                      : connectionStatus === ConnectionStatus.CONNECTING
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                ></span>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {connectionStatus === ConnectionStatus.ERROR && (
            <button
              onClick={onRetryConnection}
              className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm"
              title="Retry Connection"
            >
              <RotateCw size={18} />
              <span className="hidden sm:inline">Retry</span>
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 dark:bg-gray-800 mx-1"></div>


          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-700 dark:text-gray-300 
             hover:bg-slate-200 dark:hover:bg-gray-800 
             rounded-lg"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={onClearChat}
            className="p-2 text-slate-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 text-sm"
            title="Clear Conversation"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </header>
  );
};
