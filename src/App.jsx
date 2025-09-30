import React, { useState, useRef, useEffect } from "react";
import { Search, ArrowUp, Moon, Paperclip } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [hasAccess, setHasAccess] = useState(false);
  const [mode, setMode] = useState("chat"); // chat | email
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const streamingIntervalRef = useRef(null);

  const ACCESS_KEY = "@ANurag100";

  // Scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // ✅ Streaming effect
  const simulateStreaming = (text) => {
    setStreamingText("");
    let index = 0;
    streamingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setStreamingText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
        setMessages((prev) => [...prev, { role: "assistant", content: text }]);
        setStreamingText("");
        setLoading(false);
      }
    }, 20);
  };

  const stopStreaming = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: streamingText },
      ]);
      setStreamingText("");
      setLoading(false);
    }
  };

  // ✅ Handle Send
  const sendMessage = async () => {
    if (!input.trim() && !attachedFile) return;

    // 🔒 Access/email flow
    if (!hasAccess && messageCount >= 1) {
      if (input.trim() === ACCESS_KEY) {
        setHasAccess(true);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "✅ Access granted! Welcome back 😍✨" },
        ]);
        setMode("chat");
      } else if (mode === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "🚫 Free limit reached! Please enter your access key 🔑 or share your email 💌 to continue.",
          },
        ]);
        setMode("email");
      } else if (mode === "email") {
        if (input.includes("@")) {
          try {
            await fetch("http://localhost:5000/save-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: input.trim() }),
            });
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: "💌 Thanks! Your email is saved." },
            ]);
            setMode("chat");
          } catch (err) {
            console.error(err);
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: "⚠️ Failed to save email." },
            ]);
          }
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "🚫 Enter a valid email or access key!" },
          ]);
        }
      }
      setInput("");
      return;
    }

    // Normal chat
    const userMessage = {
      role: "user",
      content: input + (attachedFile ? ` [File: ${attachedFile.name}]` : ""),
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setAttachedFile(null);
    setLoading(true);

    try {
      const formData = new FormData();
      if (attachedFile) formData.append("file", attachedFile);
      formData.append("message", input);

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      simulateStreaming(data.message || "✅ Got your message!");
    } catch (err) {
      console.error(err);

      // ✅ Fallback if server down
      const dummyReplies = [
        "🤖 (Offline mode) Hey! Server is sleeping but I’m still here ✨",
        "⚡ No server? No problem. Let’s keep talking 😎",
        "💡 Offline mode reply: I can still respond to you!",
      ];
      const randomReply =
        dummyReplies[Math.floor(Math.random() * dummyReplies.length)];

      simulateStreaming(randomReply);
    } finally {
      setMessageCount((prev) => prev + 1);
    }
  };

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    setAttachedFile(files[0]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#202222] overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#202222] flex-shrink-0 w-full">
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <img src="vite.png" alt="logo" />
          </div>
          <span className="text-white font-medium">Luna AI</span>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div className="min-h-full px-4 py-6">
          {messages.length === 0 && !streamingText && (
            <div className="text-center pt-20">
              <h1 className="text-3xl font-normal text-white mb-4">
                What can I help you with today? 💕
              </h1>
            </div>
          )}

          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className="animate-fade-in w-full">
                {msg.role === "user" ? (
                  <div className="flex items-start gap-3 mb-8">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">U</span>
                    </div>
                    <div className="flex-1 pt-1 overflow-hidden">
                      <p className="text-white text-base break-words">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 pt-1 overflow-hidden">
                      <div className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && !streamingText && (
              <div className="flex items-start gap-3 animate-fade-in w-full">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Moon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 pt-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {streamingText && (
              <div className="flex items-start gap-3 animate-fade-in w-full">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Moon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 pt-1 overflow-hidden">
                  <div className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap break-words">
                    {streamingText}
                    <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-gray-800 bg-[#202222] flex-shrink-0 w-full">
        <div className="px-4 py-4 max-w-3xl mx-auto">
          <div className="relative bg-[#2c2e2e] rounded-xl border border-gray-700 focus-within:border-gray-600 transition-colors flex items-center px-2">
            {attachedFile && (
              <div className="flex items-center bg-gray-700 text-white rounded px-2 py-1 mr-2">
                <Paperclip className="w-4 h-4 mr-1" />
                <span className="text-xs">{attachedFile.name}</span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="ml-1 text-gray-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-white px-2 py-3 resize-none outline-none placeholder-gray-500 max-h-[200px] text-base"
              placeholder={
                !hasAccess && messageCount >= 1
                  ? mode === "email"
                    ? "Enter your email 💌"
                    : "Ask anything..."
                  : "Ask anything..."
              }
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  loading ? stopStreaming() : sendMessage();
                }
              }}
            />
            <div className="relative w-8 h-8 ml-2">
              <input
                type="file"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center pointer-events-none">
                <Paperclip className="w-4 h-4 text-white" />
              </div>
            </div>
            <button
              onClick={loading ? stopStreaming : sendMessage}
              disabled={!input.trim() && !attachedFile && !loading}
              className="w-8 h-8 ml-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
            >
              {loading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <ArrowUp className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          <p className="text-gray-500 text-xs text-center mt-3">
            multiple file types (PDF, TXT, JS, JSON, etc.)
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
