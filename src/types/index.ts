export interface Project {
  id: string
  title: string
  clientName: string
  startDate?: string
  dueDate?: string
  description?: string
  status: 'completed' | 'in progress' | 'deleted'
  // Add other project properties as needed
}

export interface ProjectFormData {
  clientName: string
  title: string
  description: string
  startDate: string
  dueDate: string
}
