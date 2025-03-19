'use client'
import { Button } from '@/components/ui/button'
import {
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Button as DefaultButton,
  Table,
  useDisclosure,
  Input,
  Dialog,
  Field,
  Textarea,
  Box,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { doc, getDoc, setDoc, collection, deleteDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Project, ProjectFormData } from '@/types'
import {
  CreateProjectModal,
  DataListItem,
  DataListRoot,
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogTitle,
  DialogActionTrigger,
} from '@/components/ui'
import ProjectDetailsSkeleton from '@/components/ui/project-details-skeleton'
import { BlobProvider } from '@react-pdf/renderer'
import { ProjectPDFDocument } from '@/components/pdf'
import { DeleteIcon, EditIcon } from '@/components/icons'
import { formatDate } from '@/utils/functions'
import { toaster } from '@/components/ui/toaster'
import Link from 'next/link'

export default function ProjectDetails() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [saveTemplateLoading, setSaveTemplateLoading] = useState(false)
  const [isTemplate, setIsTemplate] = useState(false)
  const [projectStatus, setProjectStatus] = useState<string>('not started')
  const { open, onOpen, onClose, setOpen } = useDisclosure()
  const [isArchiving, setIsArchiving] = useState(false)
  const [isArchived, setIsArchived] = useState(false)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [createdBy, setCreatedBy] = useState('');
  const [otherInfo, setOtherInfo] = useState('');

  const fetchProject = async () => {
    try {
      const docRef = doc(db, 'projects', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const projectData = { id: docSnap.id, ...docSnap.data() } as Project
        setProject(projectData)
        // Set the status states
        setProjectStatus(projectData.status || 'not started')
        setIsArchived(projectData.status === 'archived')
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

  useEffect(() => {
    fetchProject()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const defaultValues = {
    clientName: project?.clientName || '',
    title: project?.title || '',
    description: project?.description || '',
    startDate: project?.startDate || '',
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
      fetchProject()
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const docRef = doc(db, 'projects', id)
      await deleteDoc(docRef)
      router.push('/jobs')
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const saveAsTemplate = async () => {
    if (!project || !templateName.trim()) return

    setSaveTemplateLoading(true)
    try {
      // Extract the properties we want to exclude, and collect the rest

      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, status, clientName, dueDate, ...rest } = project

      // Prepare the template data
      const templateData = {
        ...rest,
        title: templateName.trim(), // Changed from templateName to title
        name: templateName.trim(), // Including name for backward compatibility
        description: templateDescription.trim(),
        createdAt: new Date().toISOString(),
        originalProjectId: project.id,
      }

      // Save to templates collection with a new document ID
      const templateRef = doc(collection(db, 'templates'))
      await setDoc(templateRef, templateData)

      toaster.create({
        title: 'Template saved',
        description: 'Template saved successfully',
        type: 'success',
      })

      // Close the dialog and reset the form
      onClose()
      setTemplateName('')
      setTemplateDescription('')
    } catch (err) {
      console.error('Error saving template:', err)
    } finally {
      setSaveTemplateLoading(false)
      fetchProject()
    }
  }


  const checkIfProjectIsTemplate = useCallback(async () => {
    try {
      if (!project?.id) return

      const templatesRef = collection(db, 'templates')
      const q = query(templatesRef, where('originalProjectId', '==', project.id))
      const querySnapshot = await getDocs(q)

      setIsTemplate(!querySnapshot.empty)
    } catch (error) {
      console.error('Error checking if project is template:', error)
    }
  }, [project?.id])


  // Add this new useEffect
  useEffect(() => {
    if (project) {
      checkIfProjectIsTemplate()
    }
  }, [project, checkIfProjectIsTemplate])

  // Update the toggleProjectStatus function to handle all three states
  const toggleProjectStatus = async () => {
    if (!project) return

    try {
      setIsSubmitting(true)

      // Determine the next status based on current status
      let newStatus: Project['status'];
      let statusMessage: string;

      switch (projectStatus) {
        case 'archived':
          newStatus = 'not started';
          statusMessage = 'Project removed from archives';
          break;
        case 'not started':
          newStatus = 'in progress';
          statusMessage = 'Project marked as in progress';
          break;
        case 'in progress':
          newStatus = 'completed';
          statusMessage = 'Project marked as completed';
          break;
        case 'completed':
          newStatus = 'not started';
          statusMessage = 'Project status reset to not started';
          break;
        default:
          newStatus = 'not started';
          statusMessage = 'Project status updated';
      }

      // Update in Firestore
      const docRef = doc(db, 'projects', id)
      await setDoc(docRef, { ...project, status: newStatus }, { merge: true })

      // Update local state
      setProjectStatus(newStatus)
      setProject({ ...project, status: newStatus })
      setIsArchived((newStatus as string) === 'archived')

      // Show success message
      toaster.create({
        title: 'Status Updated',
        description: statusMessage,
        type: 'success',
      })
    } catch (error) {
      console.error('Error updating project status:', error)
      toaster.create({
        title: 'Update Failed',
        description: 'Failed to update project status',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add this new function to archive the project
  const handleArchive = async () => {
    try {
      setIsArchiving(true)
      const docRef = doc(db, 'projects', id)

      // Update the project status to 'archived' instead of deleting it
      await setDoc(docRef, { status: 'archived' }, { merge: true })

      toaster.create({
        title: 'Project Archived',
        description: 'Project has been moved to archives',
        type: 'success',
      })

      // Redirect to the jobs page
      router.push('/jobs')
    } catch (error) {
      console.error('Error archiving project:', error)
      toaster.create({
        title: 'Archive Failed',
        description: 'Failed to archive the project',
        type: 'error',
      })
    } finally {
      setIsArchiving(false)
      setDeleteModalOpen(false)
    }
  }

  // Function to handle PDF export button click
  const handleExportPDF = () => {
    setPdfDialogOpen(true);
  }

  if (loading) {
    return <ProjectDetailsSkeleton />
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

  // Format currency for display
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  // Calculate subtotal from materials
  const subtotal =
    project?.materials?.reduce((sum, item) => sum + item.quantity * item.price, 0) || 0

  // In the JSX, update the button display
  const getStatusButtonProps = () => {
    if (projectStatus === 'archived') {
      return {
        text: "Remove from Archive",
        colorPalette: "teal" as const
      };
    } else if (projectStatus === 'not started') {
      return {
        text: "Mark as In Progress",
        colorPalette: "blue" as const
      };
    } else if (projectStatus === 'in progress') {
      return {
        text: "Mark as Completed",
        colorPalette: "green" as const
      };
    } else {
      return {
        text: "Reset Status",
        colorPalette: "gray" as const
      };
    }
  };

  const statusButtonProps = getStatusButtonProps();

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
          <Flex gap={2} p={0} m={0}>
            {/* wrap edit button in CreateProjectModal component to trigger modal */}
            <CreateProjectModal
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              submitting={isSubmitting}
              mode="edit"
              open={editModalOpen}
              setOpen={setEditModalOpen}
            >
              <Button fontSize="small" variant="ghost" p={1} colorPalette="transparent">
                <EditIcon width="18px" height="18px" />
              </Button>
            </CreateProjectModal>

            <DefaultButton
              fontSize="small"
              colorPalette="red"
              borderRadius={10}
              mt={0.5}
              p={1}
              onClick={() => setDeleteModalOpen(true)}
            >
              <DeleteIcon width="18px" height="18px" />
            </DefaultButton>
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
                      {!isArchived && (
                        <Button
                          colorPalette="green"
                          mr={2}
                          fontSize="small"
                          loading={isArchiving}
                          onClick={handleArchive}
                        >
                          Archive Instead
                        </Button>
                      )}
                      <Button
                        colorPalette="red"
                        fontSize="small"
                        loading={isDeleting}
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

        <Flex gap={2} width="100%" alignItems="center" justifyContent="space-between">
          <Flex width="fit-content" p={0} m={0} gap={3}>
            {/* Replace the PDFDownloadLink with a button that opens the dialog */}
            <Button fontSize="small" colorPalette="green" onClick={handleExportPDF}>
              Export to PDF
            </Button>
            {!isTemplate && <Button fontSize="small" borderRadius="lg" colorPalette="default" onClick={onOpen}>
              Make this a Template
            </Button>}
            <Button fontSize="small" onClick={() => router.push(`/project/${id}/update`)}>
              Update Materials
            </Button>
          </Flex>
          <Button
            fontSize="small"
            onClick={toggleProjectStatus}
            colorPalette={statusButtonProps.colorPalette}
            loading={isSubmitting}
          >
            {statusButtonProps.text}
          </Button>
        </Flex>
      </VStack>

      {/* Template Name Dialog */}
      <Dialog.Root open={open} placement="center" onOpenChange={() => setOpen(!open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Save as Template</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Field.Root>
                  <Field.Label>Template Name</Field.Label>
                  <Input
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    placeholder="Enter a name for this template"
                  />
                  <Field.HelperText>
                    This name will help you identify the template later.
                  </Field.HelperText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Template Description</Field.Label>
                  <Textarea
                    value={templateDescription}
                    onChange={e => setTemplateDescription(e.target.value)}
                    placeholder="Enter a description for this template"
                    rows={3}
                  />
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button colorPalette="gray" fontSize="small" mr={2} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorPalette="green"
                fontSize="small"
                onClick={saveAsTemplate}
                loading={saveTemplateLoading}
                disabled={!templateName.trim()}
              >
                Save Template
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* PDF Export Dialog */}
      <Dialog.Root open={pdfDialogOpen} placement="center" onOpenChange={() => setPdfDialogOpen(!pdfDialogOpen)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Export to PDF</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Field.Root>
                  <Field.Label>Created By</Field.Label>
                  <Input
                    value={createdBy}
                    required
                    onChange={e => setCreatedBy(e.target.value)}
                    placeholder="Enter your name or company name"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Other Info</Field.Label>
                  <Input
                    value={otherInfo}
                    onChange={e => setOtherInfo(e.target.value)}
                    placeholder="Additional information (optional)"
                  />
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button colorPalette="gray" fontSize="small" mr={2} onClick={() => setPdfDialogOpen(false)}>
                Cancel
              </Button>

              {/* Use BlobProvider to generate the PDF on demand with company info */}
              <BlobProvider document={
                <ProjectPDFDocument
                  project={project}
                  companyInfo={{
                    createdBy: createdBy,
                    otherInfo: otherInfo || undefined
                  }}
                />
              }>
                {({ url }) => (
                  <Link href={url || "#"} target='_blank' download={`${project?.title || 'project'}.pdf`}>
                    <Button
                      colorPalette="green"
                      fontSize="small"
                      disabled={!createdBy.trim()}
                      onClick={() => setPdfDialogOpen(false)}
                    >

                      Download PDF
                    </Button>
                  </Link>
                )}
              </BlobProvider>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <HStack width="100%" gap={60} wrap="wrap" alignItems="flex-start" rowGap={2} pr={10}>
        <DataListRoot>
          <DataListItem label="Name" value={project?.clientName} />
        </DataListRoot>
        <DataListRoot>
          <DataListItem label="Due Date" value={formatDate(project?.dueDate)} />
        </DataListRoot>
        <DataListRoot>
          <DataListItem label="Job Description" value={project?.description} />
        </DataListRoot>
      </HStack>

      <VStack width="100%" border="1.5px solid" borderColor="border.muted" borderRadius="md" mb={4}>
        <HStack width="100%" justifyContent="space-between" p={4} bg="bg.subtle" borderRadius="md">
          <VStack alignItems="flex-start" gap={1}>
            <Text fontSize="sm" color="fg.subtle">
              Total Cost
            </Text>
            <Text fontWeight="bold">{formatCurrency(subtotal)}</Text>
          </VStack>
          <VStack alignItems="flex-start" gap={1}>
            <Text fontSize="sm" color="fg.subtle">
              Net Profit
            </Text>
            <Text fontWeight="bold" color="green.500">
              {formatCurrency(project?.netProfit)}
            </Text>
          </VStack>
          <VStack alignItems="flex-start" gap={1}>
            <Text fontSize="sm" color="fg.subtle">
              Amount for Clients
            </Text>
            <Text fontWeight="bold">{formatCurrency(project?.clientAmount)}</Text>
          </VStack>
        </HStack>
      </VStack>

      <VStack width="100%" border="1.5px solid" borderColor="border.muted" borderRadius="md">
        <Table.Root size="sm" variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" htmlWidth="65%">
                Material
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" htmlWidth="10%">
                Qty
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" htmlWidth="10%">
                Rate
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.subtle" fontSize="small" textAlign="end" pr={4} htmlWidth="15%">
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
        <VStack p={4} gap={2} width="100%">
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
