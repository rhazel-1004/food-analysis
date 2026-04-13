export type NutritionData = {
  foodName: string
  servingSize: string
  calories: number
  totalFat: { g: number; dv: number }
  saturatedFat: { g: number; dv: number }
  transFat: { g: number }
  cholesterol: { mg: number; dv: number }
  sodium: { mg: number; dv: number }
  totalCarbs: { g: number; dv: number }
  dietaryFiber: { g: number; dv: number }
  totalSugars: { g: number }
  addedSugars: { g: number; dv: number }
  protein: { g: number }
  vitaminD: { mcg: number; dv: number }
  calcium: { mg: number; dv: number }
  iron: { mg: number; dv: number }
  potassium: { mg: number; dv: number }
}

export type Message = {
  role: 'user' | 'assistant'
  content: string
}
