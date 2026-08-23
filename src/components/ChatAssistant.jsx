// src/components/ChatAssistant.jsx
//
// "Ask Sanat AI" — a floating, frontend-only chat assistant.
// Answers are generated locally by src/utils/chatEngine.js from
// src/data/portfolioKnowledge.js. No network requests, no API keys.
//
// ChatMessage shape:
//   { id: string, role: "user" | "assistant", content: string,
//     actions: Array<{label, href?, external?, scrollTo?}> | null,
//     timestamp: number }

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbRobot, TbSend2, TbX } from "react-icons/tb";
import { generateReply, getSuggestedQuestions } from "../utils/chatEngine";
import { profile } from "../data/portfolioKnowledge";

const STORAGE_KEY = "ask-sanat-ai-messages";
const WELCOME_TEXT =
  "Hi 👋 I'm Sanat's portfolio assistant. Ask me anything about Sanat, his skills, projects, experience, or how to contact him.";

function createMessage(role, content, actions) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
    actions: actions || null,
    timestamp: Date.now(),
  };
}

function loadStoredMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    // localStorage may be unavailable (privacy mode, quota, etc.) — fail soft.
    return [];
  }
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(loadStoredMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [streamingText, setStreamingText] = useState(null); // { shown, full }

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const buttonRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const thinkTimeoutRef = useRef(null);

  // Persist conversation for the session (also survives reloads via localStorage).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore storage errors */
    }
  }, [messages]);

  // Auto-scroll to latest content.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, isThinking, isOpen]);

  // Focus the input when the panel opens; close on Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 150);
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Clean up any pending timers on unmount.
  useEffect(
    () => () => {
      clearInterval(typingIntervalRef.current);
      clearTimeout(thinkTimeoutRef.current);
    },
    [],
  );

  const streamReply = useCallback((fullText, actions) => {
    let index = 0;
    setStreamingText({ shown: "", full: fullText });

    clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = setInterval(() => {
      index += 2; // reveal a couple of characters per tick — fast but visible
      const shown = fullText.slice(0, index);
      setStreamingText({ shown, full: fullText });

      if (index >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        setStreamingText(null);
        setMessages((prev) => [...prev, createMessage("assistant", fullText, actions)]);
      }
    }, 16);
  }, []);

  const handleSend = useCallback(
    (rawText) => {
      const trimmed = rawText.trim();
      if (!trimmed || isThinking || streamingText) return;

      setMessages((prev) => [...prev, createMessage("user", trimmed)]);
      setInput("");
      setIsThinking(true);

      const thinkDelay = 450 + Math.random() * 350;
      clearTimeout(thinkTimeoutRef.current);
      thinkTimeoutRef.current = setTimeout(() => {
        setIsThinking(false);
        const reply = generateReply(trimmed);
        streamReply(reply.text, reply.actions || null);
      }, thinkDelay);
    },
    [isThinking, streamingText, streamReply],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleAction = (action) => {
    if (action.scrollTo) {
      setIsOpen(false);
      setTimeout(() => {
        document.getElementById(action.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  };

  const suggestions = getSuggestedQuestions();
  const showWelcome = messages.length === 0 && !streamingText && !isThinking;
  const isBusy = isThinking || !!streamingText;

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close Ask Sanat AI chat assistant" : "Open Ask Sanat AI chat assistant"}
        aria-expanded={isOpen}
        aria-controls="ask-sanat-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-900/30 px-4 py-3 sm:px-5 sm:py-3.5 border border-blue-400/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        {isOpen ? <TbX size={20} /> : <TbRobot size={20} />}
        <span className="hidden sm:inline text-sm font-semibold">{isOpen ? "Close" : "Ask Sanat"}</span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ask-sanat-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Ask Sanat AI chat assistant"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed z-[60] bottom-[5.5rem] sm:bottom-24 right-3 left-3 sm:left-auto sm:right-6 w-auto sm:w-[380px] h-[72vh] sm:h-[560px] max-h-[calc(100vh-7rem)] bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 bg-gray-900/90">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                <TbRobot size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Ask Sanat AI</p>
                <p className="text-xs text-gray-400 truncate">Portfolio assistant · {profile.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <TbX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {showWelcome && (
                <div className="space-y-4">
                  <ChatBubble role="assistant" content={WELCOME_TEXT} />
                  <div className="flex flex-wrap gap-2 pl-1">
                    {suggestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-200 hover:border-blue-400/60 hover:text-blue-300 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <ChatBubble key={m.id} role={m.role} content={m.content} actions={m.actions} onAction={handleAction} />
              ))}

              {streamingText && <ChatBubble role="assistant" content={streamingText.shown} isStreaming />}

              {isThinking && <TypingIndicator />}
            </div>

            {/* Composer */}
            <div className="border-t border-gray-700 p-3 bg-gray-900/90">
              <div className="flex items-end gap-2">
                <label htmlFor="ask-sanat-input" className="sr-only">
                  Type your question for Sanat's portfolio assistant
                </label>
                <textarea
                  id="ask-sanat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about skills, projects, experience..."
                  className="flex-1 resize-none max-h-24 bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isBusy}
                  aria-label="Send message"
                  className="shrink-0 w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <TbSend2 size={18} />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Answers are generated from Sanat's portfolio data only.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatBubble({ role, content, actions, onAction, isStreaming }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-sm"
          }`}
        >
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-blue-400 animate-pulse align-middle" aria-hidden="true" />
          )}
        </div>
        {!isUser && actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) =>
              action.scrollTo ? (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => onAction && onAction(action)}
                  className="text-xs px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-400/40 text-blue-300 hover:bg-blue-600/30 transition-colors"
                >
                  {action.label}
                </button>
              ) : (
                <a
                  key={action.label}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  className="text-xs px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-400/40 text-blue-300 hover:bg-blue-600/30 transition-colors"
                >
                  {action.label}
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
        <span className="text-xs text-gray-400">Sanat AI is typing</span>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
        </span>
      </div>
    </div>
  );
}