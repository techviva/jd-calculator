'use client'
import { Button } from '@/components/ui/button'
import { Heading, Text, VStack, HStack, Flex, Table } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Project } from '@/types'
import { DataListItem, DataListRoot } from '@/components/ui'
import ProjectDetailsSkeleton from '@/components/ui/project-details-skeleton'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ProjectPDFDocument } from '@/components/pdf'

// Define the ProjectData interface
interface ProjectData {
  name?: string
  materials?: {
    id: string
    quantity: number
    price: number
    name: string
  }[]
  totalCost?: number
  netProfit?: number
  clientAmount?: number
  profitMargin?: number
}

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
        console.log('🚀 ~ page.tsx:42 ~ docSnap:', docSnap.data())

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
    return <ProjectDetailsSkeleton />
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

  // Format currency for display
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  // Calculate subtotal from materials
  const subtotal =
    project?.materials?.reduce((sum, item) => sum + item.quantity * item.price, 0) || 0

  return (
    <VStack
      alignItems="center"
      width="100%"
      borderRadius="4xl"
      bg="bg"
      p={5}
      alignSelf="stretch"
      gap={6}
    >
      <VStack alignItems="center">
        <Heading as="h1" fontWeight="bold" fontSize="larger">
          Project Details
        </Heading>

        <Flex width="fit-content" gap={2} alignItems="center">
          <Button fontSize="small" colorPalette="green">
            <PDFDownloadLink
              document={<ProjectPDFDocument project={project} />}
              fileName={`${project?.clientName}_Project_Details.pdf`}
            >
              {({ loading }) => (loading ? 'Loading document...' : 'Export to PDF')}
            </PDFDownloadLink>
          </Button>
          <Button
            fontSize="small"
            borderRadius="lg"
            colorPalette="default"
            onClick={() => window.alert('Feature coming soon!')}
          >
            Make this a Template
          </Button>
          <Button fontSize="small" onClick={() => router.push(`/project/${id}/update`)}>
            Update Materials
          </Button>
        </Flex>
      </VStack>
      <HStack
        width="100%"
        justifyContent="space-between"
        wrap="wrap"
        alignItems="flex-start"
        rowGap={2}
        pr={10}
      >
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
            <Table.Row>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" htmlWidth="70%">
                Material
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" htmlWidth="10%">
                Qty
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small">
                Rate
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" textAlign="end" pr={4}>
                Total Price
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {project?.materials && project.materials.length > 0 ? (
              project.materials.map(material => (
                <Table.Row key={material.id} p={4}>
                  <Table.Cell>{material.name}</Table.Cell>
                  <Table.Cell>{material.quantity}</Table.Cell>
                  <Table.Cell>{formatCurrency(material.price)}</Table.Cell>
                  <Table.Cell textAlign="end" pr={4}>
                    {formatCurrency(material.quantity * material.price)}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center">
                  No materials found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
        <VStack p={4} spacing={2} width="100%">
          <HStack justifyContent="space-between" width="100%">
            <Text fontWeight="bold" textTransform="uppercase" fontSize="small">
              Subtotal
            </Text>
            <Text fontWeight="bold" textTransform="uppercase" fontSize="small">
              {formatCurrency(subtotal)}
            </Text>
          </HStack>

          {project?.profitMargin && (
            <HStack justifyContent="space-between" width="100%">
              <Text fontSize="small">Profit Margin ({project.profitMargin}%)</Text>
              <Text fontSize="small">
                {formatCurrency((project.profitMargin / 100) * subtotal)}
              </Text>
            </HStack>
          )}

          {project?.clientAmount && (
            <HStack justifyContent="space-between" width="100%">
              <Text fontWeight="bold" fontSize="small">
                Client Total
              </Text>
              <Text fontWeight="bold" fontSize="small">
                {formatCurrency(project.clientAmount)}
              </Text>
            </HStack>
          )}

          {project?.netProfit !== undefined && (
            <HStack justifyContent="space-between" width="100%">
              <Text fontSize="small" color="green.500">
                Net Profit
              </Text>
              <Text fontSize="small" color="green.500">
                {formatCurrency(project.netProfit)}
              </Text>
            </HStack>
          )}
        </VStack>
      </VStack>
    </VStack>
  )
}
