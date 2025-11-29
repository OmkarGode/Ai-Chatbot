import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-100 dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 focus-within:border-primary-400 dark:focus-within:border-primary-500/50 focus-within:ring-4 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/20 transition-all duration-200 p-2 shadow-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 text-sm sm:text-base p-3 focus:outline-none resize-none max-h-32 disabled:opacity-50"
        />
        <div className="pb-1 pr-1">
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className={`
              p-2.5 rounded-xl flex items-center justify-center transition-all duration-200
              ${!input.trim() || disabled 
                ? 'bg-slate-200 dark:bg-gray-700 text-slate-400 dark:text-gray-500 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-500/30 hover:scale-105 active:scale-95'
              }
            `}
          >
            {disabled && input.trim() ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>
      <div className="absolute -bottom-6 right-2 text-[10px] text-slate-400 dark:text-gray-600 pointer-events-none transition-colors duration-300">
        {input.length} characters
      </div>
    </div>
  );
};