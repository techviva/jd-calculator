'use client'
import { Button } from '@/components/ui/button'
import TemplateCard from '@/components/ui/template-card'
import { Heading, HStack, Text, VStack, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { toaster } from '@/components/ui/toaster'
import { parseError } from '@/utils/errorParser'
import { Template } from '@/types'
import { CreateProjectModal } from '@/components/ui'

export default function CreateProject() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)

  const [openModal, setOpenModal] = useState(false)


  // Fetch templates from Firestore
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesCollection = collection(db, 'templates')
        const templatesSnapshot = await getDocs(templatesCollection)
        const templatesList = templatesSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          ...doc.data(),
        })) as Template[]

        setTemplates(templatesList)
      } catch (error) {
        console.error('Error fetching templates:', error)
        toaster.create({
          title: 'Error fetching templates',
          description: parseError(error),
          type: 'error',
        })
      } finally {
        setIsLoadingTemplates(false)
      }
    }

    fetchTemplates()
  }, [])

  interface ProjectFormData {
    clientName: string
    title: string
    description: string
    startDate: string
    dueDate: string
  }

  const onSubmit = async (data: ProjectFormData) => {
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
    <VStack
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      borderRadius="4xl"
      bg="spot"
      p={4}
      alignSelf="stretch"
    >
      <Heading as="h1" fontWeight="bold" width="fit-content">
        Create project
      </Heading>
      <Text color="fg.muted" fontWeight="light" width="fit-content" fontSize="small">
        You can start afresh with a blank project
      </Text>
      <CreateProjectModal onSubmit={onSubmit} submitting={isSubmitting} mode="create" open={openModal} setOpen={setOpenModal}>
        <Button fontSize="small" p={2} py={0} mt={3}>
          Create Blank Project
        </Button>
      </CreateProjectModal>
      <Text color="fg.muted" fontWeight="light" mt={2} width="fit-content" fontSize="small">
        or pick a template from one of these
      </Text>
      {isLoadingTemplates ? (
        <Spinner mt={4} />
      ) : templates.length > 0 ? (
        <HStack wrap="wrap" gap={4} mt={4} width="100%" justifyContent="center">
          {templates.map(template => (
            <TemplateCard template={template} key={template.id} />
          ))}
        </HStack>
      ) : (
        <Text color="fg.muted" mt={4}>
          No templates available
        </Text>
      )}
    </VStack>
  )
}
