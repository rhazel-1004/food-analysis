'use client'

import { useState, useCallback } from 'react'
import ImageUploader from './ImageUploader'
import NutritionLabel from './NutritionLabel'
import ChatPanel from './ChatPanel'
import type { NutritionData, Message } from '@/lib/types'

type Phase = 'idle' | 'analyzing' | 'ready'

export default function FoodApp() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null)
  const [nutrition, setNutrition] = useState<NutritionData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const handleImageSelect = useCallback(async (file: File) => {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    setImageObjectUrl(URL.createObjectURL(file))
    setNutrition(null)
    setMessages([])
    setPhase('analyzing')

    try {
      const body = new FormData()
      body.append('image', file)
      const res = await fetch('/api/analyze', { method: 'POST', body })
      if (!res.ok) throw new Error(await res.text())

      const { nutrition, openingMessage } =
        await res.json() as { nutrition: NutritionData; openingMessage: string }

      setNutrition(nutrition)
      setMessages([{ role: 'assistant', content: openingMessage }])
      setPhase('ready')
    } catch (err) {
      console.error('[analyze]', err)
      setPhase('idle')
    }
  }, [imageObjectUrl])

  const handleReset = useCallback(() => {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    setImageObjectUrl(null)
    setNutrition(null)
    setMessages([])
    setPhase('idle')
  }, [imageObjectUrl])

  if (phase === 'idle') {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-zinc-50 p-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Food Analyzer</h1>
            <p className="text-zinc-500 text-sm mt-1">Upload a photo to get a nutrition estimate</p>
          </div>
          <ImageUploader onImageSelect={handleImageSelect} />
        </div>
      </div>
    )
  }

  if (phase === 'analyzing') {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-zinc-50 gap-3 text-zinc-500">
        <svg className="animate-spin w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm">Analyzing image…</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen bg-zinc-50">
      {/* Left panel */}
      <div className="flex flex-col gap-4 p-6 bg-white border-b lg:border-b-0 lg:border-r border-zinc-200 lg:w-80 lg:overflow-y-auto shrink-0">
        {imageObjectUrl && (
          <img
            src={imageObjectUrl}
            alt="Uploaded food"
            className="w-full rounded-xl object-cover max-h-56 border border-zinc-100"
          />
        )}
        <button
          onClick={handleReset}
          className="text-xs text-zinc-400 hover:text-zinc-600 underline self-start"
        >
          Upload different image
        </button>
        <NutritionLabel nutrition={nutrition} />
      </div>

      {/* Right panel — chat */}
      <div className="flex flex-col flex-1 overflow-hidden min-h-[60vh] lg:min-h-0">
        <ChatPanel messages={messages} onSend={() => {}} isStreaming={false} />
      </div>
    </div>
  )
}
