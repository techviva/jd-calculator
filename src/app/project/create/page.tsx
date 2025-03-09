'use client'
import { Button } from '@/components/ui/button'
import TemplateCard from '@/components/ui/template-card'
import { Heading, HStack, Text, VStack } from '@chakra-ui/react'
import {
  CreateProjectModal,
} from '@/components/ui'
import { useState } from 'react'
import { ProjectFormData } from '@/types'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toaster } from '@/components/ui/toaster'
import { useRouter } from 'next/router'
import { parseError } from '@/utils/errorParser'

const dummyTemplates = [
  {
    id: 1,
    name: 'Standard Paver Blocks',
  },
  {
    id: 2,
    name: 'Standard Paver Blocks Deluxe',
  },
  {
    id: 3,
    name: 'Double Paver Blocks Standard',
  },
  {
    id: 4,
    name: 'Double Paver Blocks Deluxe',
  },
  {
    id: 5,
    name: 'Double Paver Blocks Deluxe',
  },
]

export default function CreateProject() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [openModal, setOpenModal] = useState(false)

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
      <HStack wrap="wrap" gap={4} mt={4} justifyContent="center">
        {dummyTemplates.map(({ id, name }) => (
          <TemplateCard name={name} key={id} />
        ))}
      </HStack>
    </VStack>
  )
}
