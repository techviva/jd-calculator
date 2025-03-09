export interface MaterialOption {
  value: string
  label: string
  price: number
  quantity: string
}

export interface Material {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Project {
  id: string
  title: string
  clientName: string
  dueDate?: string
  description?: string
  status: 'completed' | 'in progress' | 'deleted'
  totalCost?: number
  netProfit?: number
  clientAmount?: number
  profitMargin?: number
  materials: Material[]
  // Add other project properties as needed
}

export interface Template {
  id: string
  description: string
  originalProjectId: string
  totalCost: number
  title: string
  status: 'completed' | 'in progress' | 'deleted'
  templateName: string
  profitMargin: number
  clientAmount: number
  netProfit: number
  materials: Material[]
}
