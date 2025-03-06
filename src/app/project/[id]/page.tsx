'use client'
import { Button } from '@/components/ui/button'
import { Heading, Text, VStack, HStack, Spinner, Flex, Table } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Project } from '@/types'
import { DataListItem, DataListRoot } from '@/components/ui'

export default function ProjectDetails() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project)
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
      <VStack justifyContent="center" alignItems="center" h="100vh" gap={4} width="100%">
        <Spinner size="xl" />
        <Text>Loading project details...</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <VStack justifyContent="center" alignItems="center" h="100vh" gap={4}>
        <Heading size="md" color="red.500">
          Error
        </Heading>
        <Text>{error}</Text>
        <Button onClick={() => router.push('/create-project')}>Back to Projects</Button>
      </VStack>
    )
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <VStack
      alignItems="flex-start"
      width="100%"
      borderRadius="4xl"
      bg="bg"
      p={5}
      alignSelf="stretch" gap={6}>

      <HStack justifyContent="space-between" width="100%">
        <Heading as="h1" fontWeight="bold" fontSize="larger">
          Project Details
        </Heading>

        <Flex width="fit-content" gap={2} alignItems="center">
          <Button fontSize="small">Export to PDF</Button>
          <Button fontSize="small" borderRadius="lg" colorPalette="default">Make this a Template</Button>
        </Flex>

      </HStack>

      <Text fontWeight="bold" fontSize="small">Client Details</Text>
      <HStack width="100%" justifyContent="space-between" wrap="wrap" alignItems="flex-start" rowGap={2} pr={10}>
        <DataListRoot>
          <DataListItem label="Name" value={project?.clientName} />
        </DataListRoot>
        <DataListRoot>
          <DataListItem label="Job Title" value={project?.title} />
        </DataListRoot>
        <DataListRoot>
          <DataListItem label="Due Date" value={formatDate(project?.dueDate)} />
        </DataListRoot>
        <DataListRoot>
          <DataListItem label="Job Description" value={project?.description} />
        </DataListRoot>
      </HStack>

      <VStack width="100%" border="1.5px solid" borderColor="border.muted" borderRadius="md">
        <Table.Root size="sm" variant="line">
          <Table.Header>
            <Table.Row >
              <Table.ColumnHeader color="fg.subtle" fontSize="small" htmlWidth="70%">Product</Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" htmlWidth="10%">Qty</Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small">Rate</Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" textAlign="end" pr={4}>Total Price</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Array.from({ length: 10 }).map((_, index) => (
              <Table.Row key={index} p={4}>
                <Table.Cell>Cost for trees including delivery</Table.Cell>
                <Table.Cell>1</Table.Cell>
                <Table.Cell >$316.00</Table.Cell>
                <Table.Cell textAlign="end" pr={4}>$316.00</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <HStack p={4} justifyContent="space-between" width="100%">
          <Text fontWeight="bold" textTransform="uppercase" fontSize="small">Subtotal</Text>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="small">$316.00</Text>
        </HStack>
      </VStack>
      <HStack mt="auto">
        <Button onClick={() => router.push('/create-project')} fontSize="small">Back to Projects</Button>
        <Button onClick={() => router.push(`/project/${id}/update`)} fontSize="small">Update Materials</Button>
      </HStack>

    </VStack>
  )
}
