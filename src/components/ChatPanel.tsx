'use client'

import { useState, useRef, useEffect } from 'react'
import type { Message } from '@/lib/types'

interface Props {
  messages: Message[]
  onSend: (content: string) => void
  isStreaming: boolean
}

export default function ChatPanel({ messages, onSend, isStreaming }: Props) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isStreaming) return
    onSend(text)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400 select-none">
            <span className="text-5xl">💬</span>
            <p className="text-sm text-center leading-relaxed">
              Ask anything about this food —<br />
              calories, ingredients, substitutions, and more.
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed
                  ${m.role === 'user'
                    ? 'bg-zinc-900 text-white rounded-br-none'
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none shadow-sm'
                  }`}
              >
                {m.content || (isStreaming && i === messages.length - 1)
                  ? m.content || <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
                    </span>
                  : m.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-200 p-4 flex gap-2 bg-white shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this food..."
          className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-zinc-500 bg-white text-zinc-900 placeholder:text-zinc-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="rounded-full bg-zinc-900 text-white px-5 py-2 text-sm font-medium disabled:opacity-40 hover:bg-zinc-700 transition-colors shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  )
}
