'use client'

import { useState, useEffect } from 'react'
import { useProjects } from './useProjects'

interface MonthlyStats {
  month: string
  revenue: number // clientAmount in millions
  profit: number // netProfit in millions
  costs: number // totalCost in millions
}

export function useProjectStats() {
  const { projects, isLoading, error } = useProjects()
  const [projectData, setProjectData] = useState<MonthlyStats[]>([])

  useEffect(() => {
    if (projects.length > 0) {
      const monthlyData = aggregateByMonth(projects)
      setProjectData(monthlyData)
    }
  }, [projects])

  function aggregateByMonth(projects: ReturnType<typeof useProjects>['projects']) {
    const monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ]
    const monthlyStats: Record<string, MonthlyStats> = {}

    // Initialize last 12 months with empty data
    const today = new Date()
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (today.getMonth() - i + 12) % 12
      const monthKey = `${today.getFullYear() - (monthIndex > today.getMonth() ? 1 : 0)}-${monthIndex.toString().padStart(2, '0')}`
      monthlyStats[monthKey] = {
        month: monthNames[monthIndex],
        revenue: 0,
        profit: 0,
        costs: 0,
      }
    }

    // Aggregate project data by month
    projects.forEach(project => {
      const date = project.createdAt.toDate()

      const monthKey = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`

      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].revenue += project.clientAmount ?? 0
        monthlyStats[monthKey].profit += project.netProfit ?? 0
        monthlyStats[monthKey].costs += project.totalCost ?? 0
      }
    })

    // Convert to array and sort chronologically
    return Object.entries(monthlyStats)
      .map(([key, value]) => value)
      .sort((a, b) => {
        const monthA = monthNames.indexOf(a.month)
        const monthB = monthNames.indexOf(b.month)
        return monthA - monthB
      })
  }

  return { projectData, isLoading, error }
}
