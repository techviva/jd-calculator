'use client'
import { useForm } from 'react-hook-form'
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogRoot,
  DialogTitle,
  DialogFooter,
} from './dialog'
import { Button } from './button'
import {
  Field,
  HStack,
  Input,
  Textarea,
  VStack,
  useDisclosure,
  Button as DefaultButton,
} from '@chakra-ui/react'
import { ProjectFormData } from '@/types'
import { capitalizeFirstLetter } from '@/utils/functions'
import { useRef } from 'react'

interface CreateProjectModalProps {
  defaultValues?: ProjectFormData
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: ProjectFormData) => void
  mode?: 'create' | 'edit'
  submitting?: boolean
  children: React.ReactNode
  removeTemplate?: () => Promise<void>
  isDeleting?: boolean
}

export function CreateProjectModal({
  defaultValues = {
    clientName: '',
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    clickupId: '', // Add default value
  },
  mode = 'create',
  onSubmit,
  open,
  setOpen,
  submitting = false,
  children,
  removeTemplate,
  isDeleting = false,
}: CreateProjectModalProps) {
  // Confirmation dialog state
  const {
    open: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
    setOpen: onDeleteSetOpen,
  } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...defaultValues,
      status: 'in progress',
    },
  })

  const currentMode = capitalizeFirstLetter(mode)

  return (
    <>
      <DialogRoot placement="center" open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent borderRadius="3xl">
          <DialogHeader>
            <DialogTitle>{currentMode} Project</DialogTitle>
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

                {/* ClickUp ID Field */}
                <Field.Root invalid={!!errors.clickupId}>
                  <Field.Label>ClickUp Task ID</Field.Label>
                  <Input
                    {...register('clickupId')}
                    placeholder="Enter ClickUp Task ID (optional)"
                  />
                </Field.Root>

                <HStack justify="space-between" pt={4}>
                  <HStack gap={2} width="100%" justifyContent="space-between">
                    <Button type="submit" form="project-form" loading={submitting} fontSize="small">
                      {currentMode} Project
                    </Button>
                    {removeTemplate && (
                      <DefaultButton
                        borderRadius={10}
                        colorPalette="red"
                        size="lg"
                        fontSize="small"
                        onClick={onDeleteConfirmOpen}
                        loading={isDeleting}
                      >
                        Delete Template
                      </DefaultButton>
                    )}
                  </HStack>
                </HStack>
              </VStack>
            </form>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Confirmation Dialog for Template Deletion */}
      <DialogRoot
        placement="center"
        open={isDeleteConfirmOpen}
        onOpenChange={() => onDeleteSetOpen(!isDeleteConfirmOpen)}
      >
        <DialogContent borderRadius="xl">
          <DialogHeader fontSize="lg" fontWeight="bold">
            Delete Template
          </DialogHeader>

          <DialogBody>
            Are you sure you want to delete this template? This action cannot be undone.
          </DialogBody>

          <DialogFooter justifyContent="space-between">
            <DefaultButton
              ref={cancelRef}
              onClick={onDeleteConfirmClose}
              fontSize="small"
              borderRadius={10}
              size="lg"
              colorPalette="gray"
            >
              Cancel
            </DefaultButton>
            <DefaultButton
              onClick={async () => {
                if (removeTemplate) {
                  await removeTemplate()
                  onDeleteConfirmClose()
                }
              }}
              borderRadius={10}
              size="lg"
              colorPalette="red"
              ml={3}
              loading={isDeleting}
              fontSize="small"
            >
              Delete
            </DefaultButton>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  )
}
