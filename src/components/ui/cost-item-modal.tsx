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
import CreatableSelect from "react-select/creatable"
import { CostFormData } from "@/types"
import { useForm, Controller } from "react-hook-form"
import { capitalizeFirstLetter } from "@/utils/functions"
import { GroupBase } from 'react-select';

interface CostItemModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onSubmit: (data: CostFormData) => void
    submitting: boolean
    mode?: 'create' | 'edit'
    defaultValues?: CostFormData
    children?: React.ReactNode
}

type SelectOption = {
    label: string;
    value: string;  // Add this missing property
};

type SelectOptionGroup = GroupBase<SelectOption>;

type OptionType = {
    label: string;
    value: string;
};

export const CostItemModal = ({ open, setOpen, onSubmit, submitting, mode = 'create', children, defaultValues = {
    category: '',
    description: '',
    rate: 0,
    unit: '',
} }: CostItemModalProps) => {

    const {
        control,
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
                        <VStack gap={4} align="stretch" width="100%">
                            <Field.Root invalid={!!errors.category} required>
                                <Field.Label>
                                    Category
                                    <Field.RequiredIndicator />
                                </Field.Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    render={({ field }) => (
                                        <CreatableSelect<OptionType, false, GroupBase<OptionType>>
                                            {...field}
                                            value={field.value ? { label: field.value, value: field.value } : null}
                                            onChange={(newValue) => field.onChange(newValue ? newValue.value : '')}
                                            options={categoryOptions[0].options} // Use the options from your first group
                                            isClearable
                                            styles={{
                                                control: baseStyles => ({
                                                    ...baseStyles,
                                                    width: '100%',
                                                    backgroundColor: 'var(--chakra-colors-bg)',
                                                    borderColor: 'var(--chakra-colors-border)',
                                                }),
                                                menu: baseStyles => ({
                                                    ...baseStyles,
                                                    backgroundColor: 'var(--chakra-colors-bg)',
                                                    border: '1px solid var(--chakra-colors-border)',
                                                    boxShadow: '0 0 0 1px var(--chakra-colors-border)',
                                                }),
                                                option: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    backgroundColor: state.isFocused
                                                        ? 'var(--chakra-colors-gray-100)'
                                                        : 'var(--chakra-colors-bg)',
                                                    color: state.isFocused
                                                        ? 'var(--chakra-colors-yellow-contrast)'
                                                        : 'var(--chakra-colors-text)',
                                                    boxShadow: '0 0 0 1px var(--chakra-colors-bg)',
                                                    ':active': {
                                                        ...baseStyles[':active'],
                                                        backgroundColor: 'var(--chakra-colors-gray-200)',
                                                    },
                                                    ':hover': {
                                                        ...baseStyles[':hover'],
                                                        backgroundColor: 'var(--chakra-colors-gray-100)',
                                                        color: 'var(--chakra-colors-yellow-contrast)',
                                                    },
                                                }),
                                                container: baseStyles => ({
                                                    ...baseStyles,
                                                    width: '100%',
                                                }),
                                                input: baseStyles => ({
                                                    ...baseStyles,
                                                    caretColor: 'var(--chakra-colors-fg)',
                                                }),
                                                singleValue: baseStyles => ({
                                                    ...baseStyles,
                                                    color: 'var(--chakra-colors-text)',
                                                }),
                                            }}
                                        />
                                    )}
                                />
                                {errors.category && (
                                    <Field.ErrorText>{errors.category.message}</Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.description} required>
                                <Field.Label>Description</Field.Label>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: "Description is required" }}
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder="Enter description" />
                                    )}
                                />
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
                                    <Controller
                                        name="rate"
                                        control={control}
                                        rules={{
                                            required: "Rate is required"
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                            />
                                        )}
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
                                    <Controller
                                        name="unit"
                                        control={control}
                                        render={({ field }) => (
                                            <NativeSelectRoot>
                                                <NativeSelectField {...field} items={unitOptions} />
                                            </NativeSelectRoot>
                                        )}
                                    />
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

const categoryOptions: SelectOptionGroup[] = [
    {
        label: "Group 1",
        options: [
            { label: "Fertilizante", value: "fertilizante" },
            { label: "Travertine", value: "travertine" },
            { label: "Lead Cost", value: "lead_cost" },
            { label: "Sod (Natural Sod)", value: "sod_natural_sod" },
            { label: "Pavers", value: "pavers" },
            { label: "Artificial Turf", value: "artificial_turf" },
            { label: "Fuel Options", value: "fuel_options" },
            { label: "Labor Cost Daily", value: "labor_cost_daily" }
        ]
    },
];