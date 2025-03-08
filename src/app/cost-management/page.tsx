"use client"
import { Button, DialogActionTrigger, NativeSelectField, NativeSelectRoot } from "@/components/ui";
import { Box, DialogTitle, Field, Flex, Heading, HStack, Input, Table, Text, Textarea, VStack } from "@chakra-ui/react";
import {
    DialogBody,
    DialogContent,
    DialogRoot,
} from '@/components/ui'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "@/components/icons";

export default function CostManagement() {


    const [addMaterialModalOpen, setAddMaterialModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [materialToDelete, setMaterialToDelete] = useState<string | null>(null)


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            'jobType': '',
            'jobTypeDescription': '',
            'rate': 0,
            'unit': '',
        },
    })

    interface CostFormData {
        jobType: string,
        jobTypeDescription: string,
        rate: number,
        unit?: string,
    }


    const onSubmit = async (data: CostFormData) => {
        try {
            console.log('data: ', data)

        } catch (error) {
            console.error('Error adding project: ', error)
        } finally {
            setAddMaterialModalOpen(false)
        }
    }

    const handleDeleteMaterial = async (id: string) => {
        try {
            console.log('deleting material with id: ', id)
        } catch (error) {
            console.error('Error deleting material: ', error)
        } finally {
            setDeleteModalOpen(false)
        }

    }

    return (
        <VStack
            alignItems="flex-start"
            width="100%"
            alignSelf="stretch"
            borderRadius="4xl"
            bg="bg"
            gap={6}
            p={5}
        >
            <HStack width="100%" justifyContent="space-between">
                <Heading as="h1" fontWeight="bold">
                    Cost Management
                </Heading>
                <DialogRoot placement="center" open={addMaterialModalOpen} onOpenChange={() => setAddMaterialModalOpen(!addMaterialModalOpen)} unmountOnExit>
                    <Button colorPalette="green" fontSize="small" onClick={() => setAddMaterialModalOpen(true)}>Add a new cost</Button>
                    <DialogContent borderRadius="3xl" py={4}>
                        <DialogBody pb="2">
                            <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
                                <VStack gap={4} align="stretch">
                                    <Field.Root invalid={!!errors.jobType}>
                                        <Field.Label>
                                            Job Type *
                                            <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input
                                            {...register('jobType', {
                                                required: 'Job type is required',
                                            })}
                                            placeholder="Enter job type name"
                                        />
                                        {errors.jobType && (
                                            <Field.ErrorText>{errors.jobType.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root invalid={!!errors.jobTypeDescription}>
                                        <Field.Label>
                                            Job Type Description *
                                            <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Textarea {...register('jobTypeDescription')} placeholder="Enter job type description" />
                                        {errors.jobTypeDescription && (
                                            <Field.ErrorText>{errors.jobTypeDescription.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>
                                    <HStack>
                                        <Field.Root invalid={!!errors.rate}>
                                            <Field.Label>
                                                Rate *
                                                <Field.RequiredIndicator />
                                            </Field.Label>
                                            <Input type="number" {...register('rate')} />
                                            {errors.rate && <Field.ErrorText>{errors.rate.message}</Field.ErrorText>}
                                        </Field.Root>
                                        <Field.Root invalid={!!errors.unit}>
                                            <Field.Label>
                                                Unit<Text fontSize="xs" fontWeight="light">(optional)</Text>
                                                <Field.RequiredIndicator />
                                            </Field.Label>
                                            <NativeSelectRoot>
                                                <NativeSelectField {...register('unit')} items={unitOptions} />
                                            </NativeSelectRoot>
                                            {errors.unit && <Field.ErrorText>{errors.unit.message}</Field.ErrorText>}
                                        </Field.Root>
                                    </HStack>

                                    <HStack justify="space-between" pt={4} >
                                        <Box width="fit-content" p={0} m={0}>
                                            <Button
                                                type="submit"
                                                form="project-form"
                                                loadingText="Creating..."
                                                fontSize="small"
                                                colorPalette="default"
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                        <Box width="fit-content" p={0} m={0}>
                                            <Button
                                                colorPalette="gray" fontSize="small"
                                                onClick={() => {
                                                    reset()
                                                    setAddMaterialModalOpen(false)
                                                }}
                                            >Cancel</Button>
                                        </Box>
                                    </HStack>
                                </VStack>
                            </form>
                        </DialogBody>
                    </DialogContent>
                </DialogRoot>
            </HStack>

            <VStack width="100%" border="1.5px solid" borderColor="border.muted" borderRadius="md">
                <Table.Root size="sm" variant="line">
                    <Table.Header>
                        <Table.Row >
                            <Table.ColumnHeader color="fg.subtle" fontSize="xs" htmlWidth="35%" fontWeight="medium">Job Type</Table.ColumnHeader>
                            <Table.ColumnHeader color="fg.subtle" fontSize="xs" htmlWidth="35%" fontWeight="medium">Job Type Options</Table.ColumnHeader>
                            <Table.ColumnHeader color="fg.subtle" fontSize="xs" htmlWidth="25%" fontWeight="medium">Rate</Table.ColumnHeader>
                            <Table.ColumnHeader htmlWidth="5%"></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {jobData.map((job) => (
                            <Table.Row key={job.id}>
                                <Table.Cell py={0}>{job.jobType}</Table.Cell>
                                <Table.Cell py={0}>{job.jobOptions}</Table.Cell>
                                <Table.Cell py={0}>{job.rate}</Table.Cell>
                                <Table.Cell py={0} >
                                    <Flex gap={1} p={0} m={0}>
                                        <Button fontSize="small" variant="ghost" p={1} colorPalette="transparent"><EditIcon width="18px" height="18px" /></Button>
                                        <Button
                                            fontSize="small"
                                            variant="ghost"
                                            p={1}
                                            colorPalette="transparent"
                                            onClick={() => {
                                                setMaterialToDelete(job.id);
                                                setDeleteModalOpen(true);
                                            }}
                                        >
                                            <DeleteIcon width="18px" height="18px" />
                                        </Button>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </VStack>

            <DialogRoot placement="center" open={deleteModalOpen} onOpenChange={() => setDeleteModalOpen(!deleteModalOpen)} unmountOnExit>
                <DialogContent borderRadius="3xl" py={4} width="fit-content">
                    <DialogBody pb="2">
                        <DialogTitle mb={2}>Delete Material</DialogTitle>
                        <Text>Are you sure? You can&apos;t undo this action afterwards</Text>
                        <HStack justify="space-between" pt={4}>
                            <Box width="fit-content" p={0} m={0}>
                                <DialogActionTrigger>
                                    <Button fontSize="small" colorPalette="gray">Cancel</Button>
                                </DialogActionTrigger>
                            </Box>
                            <Box width="fit-content" p={0} m={0}>
                                <Button
                                    colorPalette="red"
                                    onClick={() => {

                                        setDeleteModalOpen(false);
                                        handleDeleteMaterial(materialToDelete as string);
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </HStack>
                    </DialogBody>
                </DialogContent>
            </DialogRoot>
        </VStack>
    )
}

const unitOptions = [
    { label: "none", value: "" },
    { label: "$/sqft (per square foot)", value: "$/sqft" },
    { label: "$/hr (per hour)", value: "$/hr" },
    { label: "$/day (per day)", value: "$/day" },
    { label: "$/item (per unit)", value: "$/item" },
    { label: "$/linear ft (per linear foot)", value: "$/linear ft" },
    { label: "$/cubic yd (per cubic yard)", value: "$/cubic yd" },
    { label: "$/acre (per acre)", value: "$/acre" },
    { label: "$/mile (per mile)", value: "$/mile" },
    { label: "$/project (flat rate)", value: "$/project" },
    { label: "$/week (per week)", value: "$/week" }
];

const jobData = [
    {
        id: "job-001",
        jobType: "Pavers",
        jobOptions: "Phoenix Pavers",
        rate: "$4.00/sqft"
    },
    {
        id: "job-002",
        jobType: "Pavers",
        jobOptions: "Economy Pavers 1x1",
        rate: "$2.75/sqft"
    },
    {
        id: "job-003",
        jobType: "Artificial Turf",
        jobOptions: "80 oz or similar turf",
        rate: "$2.75/sqft"
    },
    {
        id: "job-004",
        jobType: "Travertine",
        jobOptions: "Higher Tier Turf",
        rate: "$3.25/sqft"
    },
    {
        id: "job-005",
        jobType: "Sod (Natural Sod)",
        jobOptions: "Bermuda Grass Sod",
        rate: "$0.78/sqft"
    },
    {
        id: "job-006",
        jobType: "Sod (Natural Sod)",
        jobOptions: "St Augustine Sod",
        rate: "$1.00/sqft"
    }
];