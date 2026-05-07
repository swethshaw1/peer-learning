import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;

const SYSTEM_PROMPT = `You are a helpful AI learning assistant for PeerLearn LMS — a modern peer-to-peer learning management system. You help students with:
- Understanding course content and concepts
- Navigating the platform (courses, cohorts, quizzes, leaderboards, discussions, projects)
- Learning strategies and study tips
- Quiz preparation and practice
- Project collaboration advice
Keep responses concise, friendly, and educational. Use emojis occasionally to keep the tone engaging.`;

async function callGroq(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to get response');
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! 👋 I'm your PeerLearn AI assistant. Ask me anything about your courses, quizzes, or how to use the platform!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await callGroq(history);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Sorry, I ran into an issue: ${err.message || 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Chat Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.45)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.6)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.45)';
          }}
        >
          <MessageCircle size={26} color="white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--chat-bg, #fff)',
            border: '1px solid rgba(99,102,241,0.15)',
            transition: 'height 0.3s ease',
            height: isMinimized ? '64px' : '520px',
          }}
          className="dark:[--chat-bg:#0f172a] [--chat-bg:#ffffff]"
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
              cursor: 'pointer',
            }}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bot size={20} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: 'white', lineHeight: 1.2 }}>
                PeerLearn Assistant
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.2 }}>
                {isLoading ? 'Thinking...' : 'Always here to help'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: '8px',
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: msg.role === 'assistant'
                          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                          : 'linear-gradient(135deg, #10b981, #059669)',
                      }}
                    >
                      {msg.role === 'assistant'
                        ? <Bot size={14} color="white" />
                        : <User size={14} color="white" />}
                    </div>

                    {/* Bubble */}
                    <div style={{ maxWidth: '75%' }}>
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: msg.role === 'user'
                            ? '16px 4px 16px 16px'
                            : '4px 16px 16px 16px',
                          background: msg.role === 'user'
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                            : 'var(--bubble-bg, #f1f5f9)',
                          color: msg.role === 'user' ? 'white' : 'var(--bubble-text, #1e293b)',
                          fontSize: '13px',
                          lineHeight: '1.5',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                        }}
                        className={msg.role === 'assistant' ? 'dark:[--bubble-bg:#1e293b] dark:[--bubble-text:#e2e8f0]' : ''}
                      >
                        {msg.content}
                      </div>
                      <p
                        style={{
                          margin: '4px 4px 0',
                          fontSize: '10px',
                          color: '#94a3b8',
                          textAlign: msg.role === 'user' ? 'right' : 'left',
                        }}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      }}
                    >
                      <Bot size={14} color="white" />
                    </div>
                    <div
                      style={{
                        padding: '10px 16px',
                        borderRadius: '4px 16px 16px 16px',
                        background: 'var(--bubble-bg, #f1f5f9)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      className="dark:[--bubble-bg:#1e293b]"
                    >
                      <Loader2 size={14} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                      <span style={{ fontSize: '13px', color: '#6366f1' }}>Thinking…</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border-color, #e2e8f0)',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  flexShrink: 0,
                  background: 'var(--input-area-bg, #f8fafc)',
                }}
                className="dark:[--border-color:#1e293b] dark:[--input-area-bg:#0f172a]"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    border: '1px solid var(--input-border, #e2e8f0)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    outline: 'none',
                    background: 'var(--input-bg, #fff)',
                    color: 'var(--input-text, #1e293b)',
                    transition: 'border-color 0.2s',
                  }}
                  className="dark:[--input-border:#334155] dark:[--input-bg:#1e293b] dark:[--input-text:#e2e8f0] dark:[--border-color:#334155] focus:[border-color:#6366f1]"
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--input-border, #e2e8f0)'; }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isLoading || !input.trim()
                      ? '#e2e8f0'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    transition: 'background 0.2s, transform 0.1s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  }}
                >
                  <Send
                    size={16}
                    color={isLoading || !input.trim() ? '#94a3b8' : 'white'}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
