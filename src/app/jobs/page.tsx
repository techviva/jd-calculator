"use client";
import { JobCard } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { Project } from "@/types";
import { Box, Card, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

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
        <VStack
            alignItems="center"
            width="100%"
            alignSelf="stretch"
            gap={6}
        >
            <Box width="100%" bg="bg" borderRadius="4xl" p={5}>
                <Heading as="h1" fontWeight="bold">
                    Projects
                </Heading>
            </Box>

            <HStack width="100%" alignItems="center" gap={4}>
                {loading ? (
                    // Skeleton loaders that better mimic the JobCard design
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card.Root
                            key={`skeleton-${index}`}
                            borderRadius="3xl"
                            minWidth="200px"
                            width="100%"
                            maxWidth="300px"
                            bg="white"
                            p={4}
                            boxShadow="sm"
                        >
                            <Card.Body gap="1" pb={1}>
                                <VStack align="flex-start" gap="1" pb={1}>
                                    {/* Card header with icon placeholder */}
                                    <Box p={2} borderRadius="full" bg="gray.100" width="28px" height="28px" />

                                    {/* Card title */}
                                    <Box mt="5">
                                        <Skeleton height="20px" width="70%" />
                                    </Box>

                                    {/* Card description */}
                                    <Box width="100%">
                                        <Skeleton height="16px" width="90%" />
                                    </Box>

                                    {/* Card footer */}
                                    <Box mt={1} width="40px">
                                        <Skeleton height="14px" />
                                    </Box>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    ))
                ) : projects.length > 0 ? (
                    projects
                        .slice(0, 3)
                        .map(project => (
                            <JobCard
                                key={project.id}
                                projectId={project.id}
                                title={project.title || 'Unnamed Project'}
                                clientName={project.clientName || 'Unnamed Client'}
                                description={project.description || 'No description available'}
                                dueDate={project.dueDate}
                            />
                        ))
                ) : (
                    <Text color="fg.muted">No projects found</Text>
                )}
            </HStack>

        </VStack>
    )
}