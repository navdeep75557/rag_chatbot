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

const ChatPanel: React.FC<ChatPanelProps> = ({ sessionId }) => {
  const { messages, isLoading, error } = useChatStore()
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
    if (input.trim()) {
      sendMessage(input)
      setInput("")
    }
  }

  return (
    <Card className="h-full flex flex-col bg-slate-800 border-slate-700">
      <CardContent className="flex flex-col h-full p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p className="text-center">
                No messages yet. Ask a question to get started!
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-100"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-slate-600 pt-2">
                      <p className="text-xs font-semibold text-slate-300">Sources:</p>
                      {message.sources.map((source, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs"
                        >
                          {source.platform.toUpperCase()} Chunk {source.chunk_index}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-100 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 bg-red-900 text-red-200 text-sm rounded">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatPanel
