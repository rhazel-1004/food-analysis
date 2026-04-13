'use client'

import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'

interface Props {
  onImageSelect: (file: File) => void
}

export default function ImageUploader({ onImageSelect }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) onImageSelect(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload food image"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`w-full max-w-sm mx-auto border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-colors select-none
        ${isDragging
          ? 'border-zinc-500 bg-zinc-100'
          : 'border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50'
        }`}
    >
      <span className="text-5xl">🍽️</span>
      <div className="text-center">
        <p className="font-semibold text-zinc-700">Drop a food photo here</p>
        <p className="text-zinc-400 text-sm mt-0.5">or click to browse</p>
      </div>
      <p className="text-xs text-zinc-400">JPG · PNG · WEBP</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
