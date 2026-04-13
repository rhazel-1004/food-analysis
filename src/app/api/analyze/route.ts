import type { NextRequest } from 'next/server'
import { GoogleGenAI, Type } from '@google/genai'
import type { NutritionData } from '@/lib/types'

type AnalyzeResult = NutritionData & { openingMessage: string }

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM =
  'You are a nutrition expert. Analyze food images and estimate FDA Nutrition Facts for a standard single serving. ' +
  'All numeric values must be non-negative numbers.'

// Response schema mirrors NutritionData + openingMessage
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: [
    'foodName', 'servingSize', 'calories',
    'totalFat', 'saturatedFat', 'transFat',
    'cholesterol', 'sodium', 'totalCarbs',
    'dietaryFiber', 'totalSugars', 'addedSugars',
    'protein', 'vitaminD', 'calcium', 'iron', 'potassium',
    'openingMessage',
  ],
  properties: {
    foodName:       { type: Type.STRING },
    servingSize:    { type: Type.STRING },
    calories:       { type: Type.NUMBER },
    totalFat:       { type: Type.OBJECT, required: ['g','dv'],   properties: { g:   { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    saturatedFat:   { type: Type.OBJECT, required: ['g','dv'],   properties: { g:   { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    transFat:       { type: Type.OBJECT, required: ['g'],         properties: { g:   { type: Type.NUMBER } } },
    cholesterol:    { type: Type.OBJECT, required: ['mg','dv'],  properties: { mg:  { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    sodium:         { type: Type.OBJECT, required: ['mg','dv'],  properties: { mg:  { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    totalCarbs:     { type: Type.OBJECT, required: ['g','dv'],   properties: { g:   { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    dietaryFiber:   { type: Type.OBJECT, required: ['g','dv'],   properties: { g:   { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    totalSugars:    { type: Type.OBJECT, required: ['g'],         properties: { g:   { type: Type.NUMBER } } },
    addedSugars:    { type: Type.OBJECT, required: ['g','dv'],   properties: { g:   { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    protein:        { type: Type.OBJECT, required: ['g'],         properties: { g:   { type: Type.NUMBER } } },
    vitaminD:       { type: Type.OBJECT, required: ['mcg','dv'], properties: { mcg: { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    calcium:        { type: Type.OBJECT, required: ['mg','dv'],  properties: { mg:  { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    iron:           { type: Type.OBJECT, required: ['mg','dv'],  properties: { mg:  { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    potassium:      { type: Type.OBJECT, required: ['mg','dv'],  properties: { mg:  { type: Type.NUMBER }, dv:  { type: Type.NUMBER } } },
    openingMessage: { type: Type.STRING },
  },
}

export async function POST(request: NextRequest) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('image')
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    return Response.json({ error: 'No valid image provided' }, { status: 400 })
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64')

  const models = ['gemini-2.5-flash-lite', 'gemini-2.5-pro']
  const contents = [{
    role: 'user',
    parts: [
      { inlineData: { mimeType: file.type, data: base64 } },
      { text: 'Analyze this food image and report its nutrition facts.' },
    ],
  }]
  const config = {
    systemInstruction: SYSTEM,
    responseMimeType: 'application/json',
    responseSchema: RESPONSE_SCHEMA,
  }

  let lastErr: unknown
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({ model, contents, config })
      const raw = response.text
      if (!raw) continue
      const { openingMessage, ...nutrition } = JSON.parse(raw) as AnalyzeResult
      return Response.json({ nutrition, openingMessage })
    } catch (err) {
      console.error(`[analyze] ${model} failed:`, err)
      lastErr = err
    }
  }

  console.error('[analyze] all models failed:', lastErr)
  return Response.json({ error: 'Analysis failed' }, { status: 500 })
}
