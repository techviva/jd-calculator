'use client'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Field, HStack, Input, Textarea, VStack } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'

interface ProjectFormData {
  clientName: string
  title: string
  description: string
  startDate: string
  dueDate: string
}

interface ProjectFormDialogProps {
  open?: boolean
  onClose?: () => void
  onSubmit: (data: ProjectFormData) => Promise<void>
  initialData: ProjectFormData
  isSubmitting?: boolean
  register?: UseFormRegister<any>
  errors?: FieldErrors<any>
  title: string
  submitLabel: string
  trigger?: ReactNode
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  formId?: string
}

export default function ProjectFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  register,
  errors = {},
  title,
  submitLabel,
  trigger,
  handleChange,
  formId = 'project-form',
}: ProjectFormDialogProps) {
  const isControlled = open !== undefined

  // If using react-hook-form
  const renderFormWithRegister = () => (
    <form id={formId} onSubmit={onSubmit as any}>
      <VStack gap={4} align="stretch">
        <Field.Root invalid={!!errors.clientName}>
          <Field.Label>
            Client Name
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            {...register!('clientName', {
              required: 'Client name is required',
            })}
            placeholder="Enter client name"
          />
          {errors.clientName && (
            <Field.ErrorText>{errors.clientName.message as string}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.title}>
          <Field.Label>
            Job Title
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            {...register!('title', {
              required: 'Job title is required',
            })}
            placeholder="Enter job title"
          />
          {errors.title && <Field.ErrorText>{errors.title.message as string}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.description}>
          <Field.Label>
            Job Description
            <Field.RequiredIndicator />
          </Field.Label>
          <Textarea {...register!('description')} placeholder="Enter job description" />
          {errors.description && (
            <Field.ErrorText>{errors.description.message as string}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.startDate}>
          <Field.Label>
            Start Date
            <Field.RequiredIndicator />
          </Field.Label>
          <Input type="date" {...register!('startDate')} />
          {errors.startDate && (
            <Field.ErrorText>{errors.startDate.message as string}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.dueDate}>
          <Field.Label>
            Due Date
            <Field.RequiredIndicator />
          </Field.Label>
          <Input type="date" {...register!('dueDate')} />
          {errors.dueDate && <Field.ErrorText>{errors.dueDate.message as string}</Field.ErrorText>}
        </Field.Root>
      </VStack>
    </form>
  )

  // If using controlled form
  const renderControlledForm = () => (
    <VStack gap={4} align="stretch">
      <Field.Root>
        <Field.Label>
          Client Name
          <Field.RequiredIndicator />
        </Field.Label>
        <Input
          name="clientName"
          value={initialData.clientName}
          onChange={handleChange}
          placeholder="Enter client name"
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>
          Job Title
          <Field.RequiredIndicator />
        </Field.Label>
        <Input
          name="title"
          value={initialData.title}
          onChange={handleChange}
          placeholder="Enter job title"
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Job Description</Field.Label>
        <Textarea
          name="description"
          value={initialData.description}
          onChange={handleChange}
          placeholder="Enter job description"
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Start Date</Field.Label>
        <Input type="date" name="startDate" value={initialData.startDate} onChange={handleChange} />
      </Field.Root>

      <Field.Root>
        <Field.Label>Due Date</Field.Label>
        <Input type="date" name="dueDate" value={initialData.dueDate} onChange={handleChange} />
      </Field.Root>
    </VStack>
  )

  const dialogContent = (
    <DialogContent borderRadius="3xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogBody pb="8">
        {register ? renderFormWithRegister() : renderControlledForm()}
        <HStack justify="space-between" pt={4}>
          <DialogCloseTrigger onClick={onClose} />

          {register ? (
            <Button
              type="submit"
              form={formId}
              loading={isSubmitting}
              loadingText="Submitting..."
              fontSize="small"
            >
              {submitLabel}
            </Button>
          ) : (
            <Button
              onClick={async () => {
                await onSubmit(initialData)
                onClose?.()
              }}
              loading={isSubmitting}
              loadingText="Submitting..."
              fontSize="small"
            >
              {submitLabel}
            </Button>
          )}
        </HStack>
      </DialogBody>
    </DialogContent>
  )

  if (isControlled) {
    return (
      <DialogRoot open={open} onOpenChange={open => !open && onClose?.()}>
        {dialogContent}
      </DialogRoot>
    )
  }

  return (
    <DialogRoot placement="center">
      <DialogTrigger>{trigger}</DialogTrigger>
      {dialogContent}
    </DialogRoot>
  )
}
