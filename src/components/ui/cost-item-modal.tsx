"use client"
import { Box, Field, HStack, Input, Text, Textarea, VStack } from "@chakra-ui/react"
import { Button } from "./button"
import {
    DialogRoot,
    DialogContent,
    DialogBody,
    DialogTrigger,

} from "./dialog"
import { NativeSelectField, NativeSelectRoot } from "./native-select"
import { CostFormData } from "@/types"
import { useForm } from "react-hook-form"
import { capitalizeFirstLetter } from "@/utils/functions"


interface CostItemModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onSubmit: (data: CostFormData) => void
    submitting: boolean
    mode?: 'create' | 'edit'
    defaultValues?: CostFormData
    children?: React.ReactNode
}

export const CostItemModal = ({ open, setOpen, onSubmit, submitting, mode = 'create', children, defaultValues = {
    category: '',
    description: '',
    rate: 0,
    unit: '',
} }: CostItemModalProps) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues,
    })

    return (
        <DialogRoot placement="center" open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent borderRadius="3xl" py={4}>
                <DialogBody pb="2">
                    <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
                        <VStack gap={4} align="stretch">
                            <Field.Root invalid={!!errors.category} required>
                                <Field.Label>
                                    Category
                                    <Field.RequiredIndicator />
                                </Field.Label>
                                <Input
                                    {...register('category', {
                                        required: 'Category is required',
                                    })}
                                    placeholder="Enter category name"
                                />
                                {errors.category && (
                                    <Field.ErrorText>{errors.category.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.description} required>
                                <Field.Label> Description</Field.Label>
                                <Textarea {...register('description')} placeholder="Enter description" />
                                {errors.description && (
                                    <Field.ErrorText>{errors.description.message}</Field.ErrorText>
                                )}
                            </Field.Root>
                            <HStack>
                                <Field.Root invalid={!!errors.rate} required>
                                    <Field.Label>
                                        Rate
                                        <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...register('rate', { valueAsNumber: true })}
                                    />
                                    {errors.rate && <Field.ErrorText>{errors.rate.message}</Field.ErrorText>}
                                </Field.Root>
                                <Field.Root invalid={!!errors.unit}>
                                    <Field.Label>
                                        Unit
                                        <Text fontSize="xs" fontWeight="light">
                                            (optional)
                                        </Text>
                                        <Field.RequiredIndicator />
                                    </Field.Label>
                                    <NativeSelectRoot>
                                        <NativeSelectField {...register('unit')} items={unitOptions} />
                                    </NativeSelectRoot>
                                    {errors.unit && <Field.ErrorText>{errors.unit.message}</Field.ErrorText>}
                                </Field.Root>
                            </HStack>

                            <HStack justify="space-between" pt={4}>
                                <Box width="fit-content" p={0} m={0}>
                                    <Button
                                        type="submit"
                                        form="project-form"
                                        loading={submitting}
                                        loadingText={`${capitalizeFirstLetter(mode)}ing...`}
                                        fontSize="small"
                                        colorPalette="default"
                                    >
                                        Save
                                    </Button>
                                </Box>
                                <Box width="fit-content" p={0} m={0}>
                                    <Button
                                        colorPalette="gray"
                                        fontSize="small"
                                        onClick={() => {
                                            reset()
                                            setOpen(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </HStack>
                        </VStack>
                    </form>
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    )
}

const unitOptions = [
    { label: 'none', value: '' },
    { label: '/sqft (per square foot)', value: '/sqft' },
    { label: '/hr (per hour)', value: '/hr' },
    { label: '/day (per day)', value: '/day' },
    { label: '/category (per unit)', value: '/category' },
    { label: '/linear ft (per linear foot)', value: '/linear ft' },
    { label: '/cubic yd (per cubic yard)', value: '/cubic yd' },
    { label: '/acre (per acre)', value: '/acre' },
    { label: '/mile (per mile)', value: '/mile' },
    { label: '/project (flat rate)', value: '/project' },
    { label: '/week (per week)', value: '/week' },
]