"use client"

import React, { useRef, useEffect } from "react"
import { Card, CardContent } from "./ui/Card"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { useChatStore } from "@/hooks/useChatStore"
import { useChat } from "@/hooks/useChat"
import { Input } from "./ui/Input"

interface ChatPanelProps {
  sessionId: string
}

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20L21 12L4 4L4 10L15 12L4 14L4 20Z" fill="currentColor" />
  </svg>
)

const ChatPanel: React.FC<ChatPanelProps> = ({ sessionId }) => {
  const { messages, isLoading, error, setError } = useChatStore()
  const { sendMessage } = useChat()
  const [input, setInput] = React.useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input.trim())
      setInput("")
    }
  }

  return (
    <Card className="h-full flex flex-col bg-slate-800/60 backdrop-blur border-slate-700 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-white">Comparison Chat</h2>
        </div>
        <Badge variant="secondary" className="bg-slate-700 text-slate-200">
          {messages.filter((m) => m.role === "user").length} questions asked
        </Badge>
      </div>

      <CardContent className="flex flex-col flex-1 p-0 min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 text-center px-4">
              <div className="text-3xl">💬</div>
              <p className="font-medium text-slate-300">No messages yet</p>
              <p className="text-sm">
                Try asking: <span className="italic">"Why did Video A get more engagement?"</span>
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isUser = message.role === "user"
              const isEmptyAssistant =
                !isUser && message.content === "" && isLoading && index === messages.length - 1

              return (
                <div key={index} className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      isUser
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                        : "bg-slate-700/80 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    {isEmptyAssistant ? (
                      <div className="flex space-x-1.5 py-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    )}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 border-t border-white/10 pt-2">
                        {message.sources.map((source, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] bg-slate-900/40 text-slate-200">
                            {source.platform.toUpperCase()} · chunk {source.chunk_index}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {isUser && (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">
                      You
                    </div>
                  )}
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mb-2 flex items-start gap-2 rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-200">
            <span>⚠️</span>
            <p className="flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask a question about the videos..."
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 rounded-full px-4"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 rounded-full h-10 w-10 p-0 flex items-center justify-center"
              aria-label="Send message"
            >
              <SendIcon />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatPanel
