'use client'

import { useState, useCallback } from 'react'
import ImageUploader from './ImageUploader'
import NutritionLabel from './NutritionLabel'
import ChatPanel from './ChatPanel'

type Phase = 'idle' | 'ready'

export default function FoodApp() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null)

  const handleImageSelect = useCallback((file: File) => {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    setImageObjectUrl(URL.createObjectURL(file))
    setPhase('ready')
  }, [imageObjectUrl])

  const handleReset = useCallback(() => {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    setImageObjectUrl(null)
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

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen bg-zinc-50">
      {/* Left panel — image preview + nutrition label */}
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
        <NutritionLabel nutrition={null} />
      </div>

      {/* Right panel — chat */}
      <div className="flex flex-col flex-1 overflow-hidden min-h-[60vh] lg:min-h-0">
        <ChatPanel messages={[]} onSend={() => {}} isStreaming={false} />
      </div>
    </div>
  )
}
