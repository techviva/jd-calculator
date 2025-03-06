'use client'
import { Button } from '@/components/ui/button'
import { Heading, Text, VStack, HStack, Spinner, Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ProjectDetails({ params }) {
  const router = useRouter()
  const { id } = params
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError('Project not found')
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project details')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return (
      <VStack justifyContent="center" alignItems="center" h="100vh" spacing={4}>
        <Spinner size="xl" />
        <Text>Loading project details...</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <VStack justifyContent="center" alignItems="center" h="100vh" spacing={4}>
        <Heading size="md" color="red.500">
          Error
        </Heading>
        <Text>{error}</Text>
        <Button onClick={() => router.push('/create-project')}>Back to Projects</Button>
      </VStack>
    )
  }

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <VStack alignItems="flex-start" width="100%" p={5} spacing={6}>
      <Button variant="outline" onClick={() => router.push('/create-project')}>
        Back to Projects
      </Button>

      <Heading as="h1" size="xl">
        {project.jobTitle}
      </Heading>

      <Box w="100%" p={5} borderWidth="1px" borderRadius="lg">
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Text fontWeight="bold">Client:</Text>
            <Text>{project.clientName}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontWeight="bold">Due Date:</Text>
            <Text>{formatDate(project.dueDate)}</Text>
          </HStack>

          <VStack align="stretch">
            <Text fontWeight="bold">Description:</Text>
            <Box p={3} bg="gray.50" borderRadius="md">
              <Text>{project.jobDescription}</Text>
            </Box>
          </VStack>
        </VStack>
      </Box>

      {/* Add more project details and functionality here */}
    </VStack>
  )
}
