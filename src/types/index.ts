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
  materials: Material[]
  // Add other project properties as needed
}
