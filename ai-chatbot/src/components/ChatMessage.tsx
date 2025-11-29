import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { type Message, Role } from '../types';
import { Bot, User, Copy, Check, Terminal } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const isUser = message.role === Role.USER;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group flex gap-3 sm:gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-md mt-1 ring-2 ring-white dark:ring-gray-900">
          <Bot size={18} className="text-white" />
        </div>
      )}

      <div className={`relative max-w-[85%] sm:max-w-[75%] ${isUser ? 'order-1' : 'order-2'}`}>
        <div 
          className={`
            relative p-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed overflow-hidden transition-colors duration-300
            ${isUser 
              ? 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 rounded-tl-none border border-slate-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 rounded-tl-none border border-slate-200 dark:border-gray-700'
            }
          `}
        >
          {isUser ? (
             <div className="whitespace-pre-wrap font-medium">{message.content}</div>
          ) : (
            <div className="markdown-content prose dark:prose-invert max-w-none prose-sm sm:prose-base prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700">
               {message.content === '' && message.isStreaming ? (
                 <div className="flex gap-1 h-6 items-center px-1">
                   <span className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                   <span className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                   <span className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
               ) : (
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="rounded-lg overflow-hidden my-3 border border-gray-700 shadow-lg">
                          <div className="bg-[#1e1e1e] px-3 py-1.5 flex items-center justify-between text-xs text-gray-400 border-b border-gray-700/50">
                             <div className="flex items-center gap-1.5 font-mono">
                               <Terminal size={12} className="text-primary-400" />
                               <span>{match[1]}</span>
                             </div>
                          </div>
                          <SyntaxHighlighter
                            {...props}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1rem', background: '#0d1117' }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code {...props} className={`${className} bg-slate-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded text-primary-600 dark:text-primary-200 font-mono text-sm border border-slate-200 dark:border-transparent`}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
               )}
            </div>
          )}
          
          {/* Timestamp & Actions */}
          <div className={`flex items-center justify-end gap-2 mt-2 text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'text-primary-200' : 'text-slate-400 dark:text-gray-500'}`}>
             <span>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
             <button 
              onClick={copyToClipboard}
              className="hover:text-white dark:hover:text-white transition-colors"
              title="Copy message"
             >
               {copied ? <Check size={12} /> : <Copy size={12} />}
             </button>
          </div>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-200 to-gray-500 flex items-center justify-center shrink-0 shadow-md mt-1 ring-2 ring-white dark:ring-gray-900 border border-slate-300 dark:border-gray-700">
          <User size={18} className="text-slate-500 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
};