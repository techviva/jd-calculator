'use client'
import { Template } from '@/types'
import ProjectFormDialog from '@/components/ui/project-form-dialog'
import { Box, Card, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toaster } from '@/components/ui/toaster'
import { parseError } from '@/utils/errorParser'
import { useRouter } from 'next/navigation'

export default function TemplateCard({ template }: { template: Template }) {
  const router = useRouter()
  const { open, onOpen, onClose } = useDisclosure()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    title: template.title || '',
    description: template.description || '',
    startDate: '',
    dueDate: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true)

      // Add timestamp and format data for Firestore
      const projectData = {
        ...data,
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

      onClose()

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

  return (
    <>
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
        onClick={onOpen}
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

      <ProjectFormDialog
        open={open}
        onClose={onClose}
        title="Create Project from Template"
        submitLabel="Create Project"
        initialData={formData}
        handleChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  )
}
