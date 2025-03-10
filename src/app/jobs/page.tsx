'use client'
import { JobCard, JobPageSkeleton } from '@/components/ui'
import { db } from '@/lib/firebase'
import { Project } from '@/types'
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function Jobs() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true)
            try {
                const projectsCollection = collection(db, 'projects')
                const projectSnapshot = await getDocs(projectsCollection)
                const projectList = projectSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Project[]
                setProjects(projectList)
            } catch (error) {
                console.error('Error fetching projects:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    return (
        <VStack alignItems="center" width="100%" alignSelf="stretch" gap={6}>
            <Box width="100%" bg="bg" borderRadius="4xl" p={5}>
                <Heading as="h1" fontWeight="bold">
                    Projects
                </Heading>
            </Box>
            <Text color="fg.muted" fontSize="xs" textAlign="center">
                Here you can find all the projects you have created or are working on.
            </Text>
            {loading ? (
                <JobPageSkeleton />
            ) : (
                <HStack width="100%" alignItems="center" gap={4} flexWrap="wrap">
                    {projects.length > 0 ? (
                        projects.map(project => (
                            <JobCard
                                key={project.id}
                                projectId={project.id}
                                title={project.title || 'Unnamed Project'}
                                clientName={project.clientName || 'Unnamed Client'}
                                status={project.status}
                                description={project.description}
                                startDate={'2025-02-24'}
                                dueDate={project.dueDate}
                            />
                        ))
                    ) : (
                        <Text color="fg.muted">No projects found</Text>
                    )}
                </HStack>
            )}
        </VStack>
    )
}
