'use client'
import { JobCard, JobPageSkeleton } from '@/components/ui'
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPageText,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@/components/ui"
import { db } from '@/lib/firebase'
import { Project } from '@/types'
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSearch } from '@/contexts/SearchContext'

export default function Jobs() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15
    const { searchTerm } = useSearch()

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

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Get current page's projects
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentProjects = filteredProjects.slice(startIndex, endIndex)

    // Handle page change
    const handlePageChange = (details: { page: number }) => {
        setCurrentPage(details.page)
    }

    return (
        <VStack
            alignItems="center"
            width="100%"
            height="100%"
            flex="1"
            alignSelf="stretch"
            gap={6}
            pt={4}
            pb={8}
            position="relative"
        >
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
                <VStack width="100%" gap={6} height="100%" overflow="auto">
                    <HStack width="100%" alignItems="center" gap={4} flexWrap="wrap">
                        {currentProjects.length > 0 ? (
                            currentProjects.map(project => (
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

                            <Text color="fg.muted" textAlign="center" fontSize="small" width="100%" mt={3}>No projects found</Text>
                        )}
                    </HStack>

                    {filteredProjects.length > pageSize && (
                        <Box width="100%" display="flex" justifyContent="center" pt={4} mt="auto">
                            <PaginationRoot
                                count={filteredProjects.length}
                                pageSize={pageSize}
                                page={currentPage}
                                onPageChange={handlePageChange}
                                siblingCount={1}
                            >
                                <HStack gap={2} >
                                    <PaginationPrevTrigger />
                                    <PaginationItems />
                                    <PaginationPageText fontSize="small" />
                                    <PaginationNextTrigger />
                                </HStack>
                            </PaginationRoot>
                        </Box>
                    )}
                </VStack>
            )}
        </VStack>
    )
}
