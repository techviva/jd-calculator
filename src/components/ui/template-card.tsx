'use client'
import { ProjectFormData, Template } from '@/types'
import { Box, Card, Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toaster } from '@/components/ui/toaster'
import { parseError } from '@/utils/errorParser'
import { useRouter } from 'next/navigation'
import { CreateProjectModal } from './create-project-modal'

interface TemplateCardProps {
  template: Template
  onDeleteSuccess?: () => void
}

export default function TemplateCard({ template, onDeleteSuccess }: TemplateCardProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const defaultValues = {
    clientName: '',
    title: template.title || '',
    description: template.description || '',
    startDate: '',
    dueDate: '',
  }

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true)

      // Add timestamp and format data for Firestore
      const projectData = {
        ...data,
        materials: template.materials,
        createdAt: serverTimestamp(),
        status: 'in progress',
      }

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'projects'), projectData)

      toaster.create({
        title: 'Project created',
        description: `Project ${data.title} has been created successfully`,
        type: 'success',
      })

      setOpen(false)

      // Navigate to the project details page with the new ID
      router.push(`/project/${docRef.id}`)
    } catch (error) {
      console.error('Error adding project: ', error)
      toaster.create({
        title: 'Error creating project',
        description: parseError(error),
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTemplate = async () => {
    if (!template.id) {
      toaster.create({
        title: 'Error deleting template',
        description: 'Template ID is missing',
        type: 'error',
      })
      return
    }

    try {
      setIsDeleting(true)

      // Get reference to the template document using its ID
      const templateRef = doc(db, 'templates', template.id)

      // Delete the document
      await deleteDoc(templateRef)

      toaster.create({
        title: 'Template deleted',
        description: 'Template has been deleted successfully',
        type: 'success',
      })

      setOpen(false)

      // Call the callback to notify parent component about successful deletion
      if (onDeleteSuccess) {
        onDeleteSuccess()
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toaster.create({
        title: 'Error deleting template',
        description: parseError(error),
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <CreateProjectModal
      open={open}
      setOpen={setOpen}
      submitting={isSubmitting}
      mode="create"
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      removeTemplate={handleDeleteTemplate}
      isDeleting={isDeleting}
    >
      <Card.Root
        borderRadius="3xl"
        maxWidth="220px"
        width="100%"
        transition="all 0.2s ease-in-out"
        _hover={{
          cursor: 'pointer',
          bg: 'gray.subtle',
          scale: 1.05,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Card.Body gap="1" pt={4}>
          <Card.Header p={0}>
            <Flex
              py={0.5}
              px={2}
              borderRadius="full"
              bg="green.subtle"
              align="center"
              justify="center"
              width="fit-content"
              gap={0.5}
            >
              <Box width="5px" height="5px" borderRadius="full" bg="green.focusRing" mr={2} />
              <Text fontSize="xx-small" color="green.focusRing" fontWeight="medium">
                Template
              </Text>
            </Flex>
          </Card.Header>
          <Text fontWeight="bold" fontSize="small" truncate>
            {template.title}
          </Text>
        </Card.Body>
      </Card.Root>
    </CreateProjectModal>
  )
}
