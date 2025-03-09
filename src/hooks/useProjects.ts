import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase' // Adjust import path based on your Firebase setup

interface Project {
  id: string
  clientAmount: number
  totalCost: number
  netProfit: number
  createdAt: Timestamp
  // Add any other project fields you need
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)

        // Calculate date 12 months ago from today
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

        const projectsRef = collection(db, 'projects') // Adjust collection name as needed
        const q = query(projectsRef, where('createdAt', '>=', Timestamp.fromDate(twelveMonthsAgo)))

        const querySnapshot = await getDocs(q)
        const fetchedProjects: Project[] = []

        querySnapshot.forEach(doc => {
          fetchedProjects.push({
            id: doc.id,
            ...(doc.data() as Omit<Project, 'id'>),
          })
        })

        // Sort projects by date
        fetchedProjects.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())

        setProjects(fetchedProjects)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch projects'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, isLoading, error }
}
