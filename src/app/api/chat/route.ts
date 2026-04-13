import type { NextRequest } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { NutritionData, Message } from '@/lib/types'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-pro']

function buildSystem(n: NutritionData): string {
  return `You are a friendly, conversational nutrition assistant. The user uploaded a food photo that was analyzed by AI.

Food identified: ${n.foodName} — serving size: ${n.servingSize}
Estimated nutrition (per serving):
  Calories ${n.calories} | Protein ${n.protein.g}g | Total Fat ${n.totalFat.g}g (sat. ${n.saturatedFat.g}g, trans ${n.transFat.g}g) | Carbs ${n.totalCarbs.g}g (fiber ${n.dietaryFiber.g}g, sugars ${n.totalSugars.g}g, added ${n.addedSugars.g}g) | Sodium ${n.sodium.mg}mg | Cholesterol ${n.cholesterol.mg}mg | Vitamin D ${n.vitaminD.mcg}mcg | Calcium ${n.calcium.mg}mg | Iron ${n.iron.mg}mg | Potassium ${n.potassium.mg}mg

These are rough estimates from visual analysis — real values vary with preparation, brand, and portion. Be honest about this uncertainty when it matters. Keep replies short and conversational.`
}

export async function POST(request: NextRequest) {
  let messages: Message[], nutrition: NutritionData
  try {
    ;({ messages, nutrition } = await request.json())
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!messages?.length || !nutrition) {
    return Response.json({ error: 'messages and nutrition are required' }, { status: 400 })
  }

  // Gemini uses 'model' instead of 'assistant'
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }))

  const config = { systemInstruction: buildSystem(nutrition) }

  let lastErr: unknown
  for (const model of MODELS) {
    try {
      const stream = await ai.models.generateContentStream({ model, contents, config })

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text))
          }
          controller.close()
        },
      })

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    } catch (err) {
      console.error(`[chat] ${model} failed:`, err)
      lastErr = err
    }
  }

  console.error('[chat] all models failed:', lastErr)
  return Response.json({ error: 'Chat failed' }, { status: 500 })
}
