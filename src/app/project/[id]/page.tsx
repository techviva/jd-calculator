'use client'
import { Button } from '@/components/ui/button'
import { Heading, Text, VStack, HStack, Flex, Table, Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Project, ProjectFormData } from '@/types'
import {
  CreateProjectModal, DataListItem, DataListRoot, DialogRoot,
  DialogBody, DialogContent, DialogTitle,
  DialogActionTrigger,
} from '@/components/ui'
import ProjectDetailsSkeleton from '@/components/ui/project-details-skeleton'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ProjectPDFDocument } from '@/components/pdf'
import { DeleteIcon, EditIcon } from '@/components/icons'
import { formatDate } from '@/utils/functions'

export default function ProjectDetails() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
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
  }, [id, isSubmitting])

  const defaultValues = {
    clientName: project?.clientName || '',
    title: project?.title || '',
    description: project?.description || '',
    startDate: '2025-02-24',
    dueDate: project?.dueDate || '',
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true)
      const docRef = doc(db, 'projects', id)
      await setDoc(docRef, data)
      router.push(`/project/${id}`)
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setIsSubmitting(false)
      setEditModalOpen(false)
    }
  }

  const handleDelete = async () => {
    try {
      const docRef = doc(db, 'projects', id)
      await deleteDoc(docRef)
      router.push('/jobs')
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }


  if (loading) {
    return (
      <ProjectDetailsSkeleton />
    )
  }

  if (error) {
    return (
      <VStack
        alignItems="center"
        width="100%"
        justifyContent="center"
        borderRadius="4xl"
        bg="bg"
        p={5}
        alignSelf="stretch"
      >
        <Heading size="md" color="red.500">
          Error
        </Heading>
        <Text>{error}</Text>
        <Button onClick={() => router.push('/jobs')}>Back to Projects</Button>
      </VStack>
    )
  }


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

      <VStack alignItems="flex-start" width="100%" gap={4}>
        <HStack width="100%" justifyContent="space-between">
          <Heading as="h1" fontWeight="bold" fontSize="larger">
            {project?.title || 'Unnamed Project'}
          </Heading>
          <Flex gap={0} p={0} m={0}>
            { /* wrap edit button in CreateProjectModal component to trigger modal */}
            <CreateProjectModal defaultValues={defaultValues} onSubmit={onSubmit} submitting={isSubmitting} mode="edit" open={editModalOpen} setOpen={setEditModalOpen}>
              <Button fontSize="small" variant="ghost" p={1} colorPalette="transparent">
                <EditIcon width="18px" height="18px" />
              </Button>
            </CreateProjectModal>

            <Button
              fontSize="small"
              variant="ghost"
              p={1}
              colorPalette="transparent"
              onClick={() => setDeleteModalOpen(true)}
            >
              <DeleteIcon width="18px" height="18px" />
            </Button>
            <DialogRoot
              placement="center"
              open={deleteModalOpen}
              onOpenChange={() => setDeleteModalOpen(!deleteModalOpen)}
              unmountOnExit
            >
              <DialogContent borderRadius="3xl" py={4} width="fit-content">
                <DialogBody pb="2">
                  <DialogTitle mb={2}>Delete Project</DialogTitle>
                  <Text>Are you sure? You can&apos;t undo this action afterwards</Text>
                  <HStack justify="space-between" pt={4}>
                    <Box width="fit-content" p={0} m={0}>
                      <DialogActionTrigger>
                        <Button fontSize="small" colorPalette="gray">
                          Cancel
                        </Button>
                      </DialogActionTrigger>
                    </Box>
                    <Box width="fit-content" p={0} m={0}>
                      <Button
                        colorPalette="red"
                        fontSize="small"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </Box>
                  </HStack>
                </DialogBody>
              </DialogContent>
            </DialogRoot>
          </Flex>
        </HStack>

        <Flex width="fit-content" gap={2} alignItems="center">
          <Button fontSize="small" colorPalette="green">
            <PDFDownloadLink
              document={<ProjectPDFDocument project={project} />}
              fileName={`${project?.clientName}_Project_Details.pdf`}
            >
              {({ loading }) =>
                loading ? 'Loading document...' : 'Export to PDF'
              }
            </PDFDownloadLink>
          </Button>
          <Button fontSize="small" borderRadius="lg" colorPalette="default" onClick={() => window.alert('Feature coming soon!')}>Make this a Template</Button>
          <Button fontSize="small" onClick={() => router.push(`/project/${id}/update`)}>Update Materials</Button>
        </Flex>

      </VStack>
      <HStack width="100%" justifyContent="flex-start" wrap="wrap" alignItems="flex-start" gap={60} rowGap={2} pr={10} _first={{ justifySelf: 'flex-start' }}>
        <DataListRoot >
          <DataListItem label="Name" value={project?.clientName} />
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
              <Table.ColumnHeader color="fg.subtle" fontSize="small" htmlWidth="70%">Material</Table.ColumnHeader>
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
    </VStack>
  )
}
