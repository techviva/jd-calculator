"use client"
import { useForm } from "react-hook-form"
import {
    DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTrigger, DialogRoot,
    DialogTitle
} from "./dialog"
import { Button } from "./button"
import { Field, HStack, Input, Textarea, VStack } from "@chakra-ui/react"
import { ProjectFormData } from "@/types"
import { capitalizeFirstLetter } from "@/utils/functions"


interface CreateProjectModalProps {
    defaultValues?: ProjectFormData
    open: boolean
    setOpen: (open: boolean) => void
    onSubmit: (data: ProjectFormData) => void
    mode?: 'create' | 'edit'
    submitting?: boolean
    children: React.ReactNode
}
export function CreateProjectModal({ defaultValues = {
    clientName: '',
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
}, mode = 'create', onSubmit, open, setOpen, submitting = false, children }: CreateProjectModalProps) {



    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            ...defaultValues,
            status: 'in progress',
        }
    })

    const currentMode = capitalizeFirstLetter(mode);

    return (
        <DialogRoot placement="center" open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
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

                            <HStack justify="space-between" pt={4}>
                                <DialogCloseTrigger asChild></DialogCloseTrigger>
                                <Button
                                    type="submit"
                                    form="project-form"
                                    loading={submitting}
                                    fontSize="small"
                                >
                                    {currentMode} Project
                                </Button>
                            </HStack>
                        </VStack>
                    </form>
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    )
}