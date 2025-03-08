export interface Project {
  id: string
  title: string
  clientName: string
  dueDate?: string
  description?: string
  status: 'completed' | 'in progress' | 'deleted'
  // Add other project properties as needed
}
