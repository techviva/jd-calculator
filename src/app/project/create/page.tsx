'use client'
import { Button } from '@/components/ui/button'
import TemplateCard from '@/components/ui/template-card'
import { Heading, HStack, Text, VStack, Input, Textarea, Field, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { toaster } from '@/components/ui/toaster'
import { parseError } from '@/utils/errorParser'

interface Template {
  id: string
  title: string
}

export default function CreateProject() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientName: '',
      title: '',
      description: '',
      startDate: '',
      dueDate: '',
      status: 'active',
    },
  })

  // Fetch templates from Firestore
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesCollection = collection(db, 'templates')
        const templatesSnapshot = await getDocs(templatesCollection)
        const templatesList = templatesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
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
      <DialogRoot placement="center">
        <DialogTrigger asChild>
          <Button fontSize="small" p={2} py={0} mt={3}>
            Create Blank Project
          </Button>
        </DialogTrigger>
        <DialogContent borderRadius="3xl">
          <DialogHeader>
            <DialogTitle>New Project Details</DialogTitle>
          </DialogHeader>
          <DialogBody pb="8">
            <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={4} align="stretch">
                <Field.Root invalid={!!errors.clientName}>
                  <Field.Label>
                    Client Name
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    {...register('clientName', {
                      required: 'Client name is required',
                    })}
                    placeholder="Enter client name"
                  />
                  {errors.clientName && (
                    <Field.ErrorText>{errors.clientName.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.title}>
                  <Field.Label>
                    Job Title
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    {...register('title', {
                      required: 'Job title is required',
                    })}
                    placeholder="Enter job title"
                  />
                  {errors.title && <Field.ErrorText>{errors.title.message}</Field.ErrorText>}
                </Field.Root>

                <Field.Root invalid={!!errors.description}>
                  <Field.Label>
                    Job Description
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Textarea {...register('description')} placeholder="Enter job description" />
                  {errors.description && (
                    <Field.ErrorText>{errors.description.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.startDate}>
                  <Field.Label>
                    Start Date
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input type="date" {...register('startDate')} />
                  {errors.startDate && (
                    <Field.ErrorText>{errors.startDate.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.startDate}>
                  <Field.Label>
                    Due Date
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input type="date" {...register('dueDate')} />
                  {errors.dueDate && <Field.ErrorText>{errors.dueDate.message}</Field.ErrorText>}
                </Field.Root>

                <HStack justify="space-between" pt={4}>
                  <DialogCloseTrigger asChild></DialogCloseTrigger>
                  <Button
                    type="submit"
                    form="project-form"
                    loading={isSubmitting}
                    loadingText="Creating..."
                    fontSize="small"
                  >
                    Create Project
                  </Button>
                </HStack>
              </VStack>
            </form>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      <Text color="fg.muted" fontWeight="light" mt={2} width="fit-content" fontSize="small">
        or pick a template from one of these
      </Text>
      {isLoadingTemplates ? (
        <Spinner mt={4} />
      ) : templates.length > 0 ? (
        <HStack wrap="wrap" gap={4} mt={4} justifyContent="center">
          {templates.map(template => (
            <TemplateCard name={template.title} key={template.id} />
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
