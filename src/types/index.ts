import { Timestamp } from 'firebase/firestore'

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
  startDate?: string
  dueDate?: string
  description?: string
  status: 'not started' | 'completed' | 'in progress' | 'deleted' | 'archived'
  totalCost?: number
  netProfit?: number
  clientAmount?: number
  profitMargin?: number
  materials: Material[]
  createdAt: Timestamp
  // Add other project properties as needed
}

export interface ProjectFormData {
  clientName: string
  title: string
  description: string
  startDate: string
  dueDate: string
}
export interface Template {
  id: string
  description: string
  originalProjectId: string
  totalCost: number
  title: string
  status: 'completed' | 'in progress' | 'deleted' | 'archived' | 'not started'
  templateName: string
  profitMargin: number
  clientAmount: number
  netProfit: number
  materials: Material[]
}

export interface CostFormData {
  category: string
  description: string
  rate: number
  unit?: string
}

export interface CostItem {
  id: string
  category: string
  description: string
  rate: number
  unit?: string
}

export interface NoteType {
  id: string
  content: string
  createdAt: Timestamp
  updatedAt?: Timestamp
  projectId: string
  createdBy: string
}
