'use client'
import React, { useState } from 'react'
import { JobCard } from './ui/job-card'
import { Box, Flex, Text, SimpleGrid, NativeSelect } from '@chakra-ui/react'
import { Project } from '@/types'

interface ProjectListProps {
  projects: Project[]
}

export const ProjectList = ({ projects }: ProjectListProps) => {
  // State for the status filter
  const [statusFilter, setStatusFilter] = useState('active') // Default to showing active projects

  // Filter options
  const filterOptions = [
    { value: 'active', label: 'Active Projects' },
    { value: 'not started', label: 'Not Started' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
    { value: 'all', label: 'All Projects' },
  ]

  // Filter the projects based on the selected filter
  const displayedProjects = projects.filter(project => {
    if (statusFilter === 'active') {
      // Active filter shows all non-archived projects
      return project.status !== 'archived'
    } else if (statusFilter === 'all') {
      // All means literally all projects including archived
      return true
    } else {
      // Specific status filter
      return project.status === statusFilter
    }
  })

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Projects
        </Text>
        <NativeSelect.Root width="200px">
          <NativeSelect.Field value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        {displayedProjects.map(project => (
          <JobCard key={project.id} project={project} />
        ))}
      </SimpleGrid>

      {statusFilter !== 'archived' && projects.some(p => p.status === 'archived') && (
        <Text fontSize="sm" color="gray.500" mt={4} textAlign="center">
          Archived projects are hidden. Select &apos;Archived&apos; to view them.
        </Text>
      )}
    </Box>
  )
}
