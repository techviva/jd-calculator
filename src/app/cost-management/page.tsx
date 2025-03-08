'use client'
import { Button, NativeSelectField, NativeSelectRoot } from '@/components/ui'
import {
  Box,
  Field,
  Heading,
  HStack,
  Input,
  Table,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { DialogBody, DialogContent, DialogRoot, DialogTrigger } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { EditIcon } from '@/components/icons'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toaster } from '@/components/ui/toaster'
import { parseError } from '@/utils/errorParser'

export default function CostManagement() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { open, onOpen, onClose, setOpen } = useDisclosure()

  const handleOpenChange = (details: { open: boolean }) => {
    setOpen(details.open)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: '',
      description: '',
      rate: 0,
      unit: '',
    },
  })

  interface CostFormData {
    category: string
    description: string
    rate: number
    unit?: string
  }

  const onSubmit = async (data: CostFormData) => {
    try {
      setIsSubmitting(true)

      // Add timestamp and prepare data for Firestore
      const costData = {
        ...data,
        createdAt: serverTimestamp(),
      }

      // Add document to Firestore
      await addDoc(collection(db, 'costs'), costData)

      toaster.create({
        title: 'Cost item added',
        description: `${data.category} has been added successfully`,
        type: 'success',
      })

      // Reset form and close dialog
      reset()
      onClose()
    } catch (error) {
      console.error('Error adding cost item: ', error)
      toaster.create({
        title: 'Error adding cost item',
        description: parseError(error),
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <VStack
      alignCategorys="flex-start"
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
        <DialogRoot placement="center" open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button colorPalette="green" fontSize="small" onClick={onOpen}>
              Add New Cost Item
            </Button>
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
                      <Input type="number" {...register('rate')} />
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
                        loading={isSubmitting}
                        loadingText="Creating..."
                        fontSize="small"
                        colorPalette="default"
                      >
                        Save
                      </Button>
                    </Box>
                    <Box width="fit-content" p={0} m={0}>
                      <Button
                        colorPalette="red"
                        fontSize="small"
                        onClick={() => {
                          reset()
                          onClose()
                        }}
                      >
                        Delete
                      </Button>
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
            <Table.Row>
              <Table.ColumnHeader
                color="fg.subtle"
                fontSize="xs"
                htmlWidth="35%"
                fontWeight="medium"
              >
                Category
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="fg.subtle"
                fontSize="xs"
                htmlWidth="35%"
                fontWeight="medium"
              >
                Options
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="fg.subtle"
                fontSize="xs"
                htmlWidth="25%"
                fontWeight="medium"
              >
                Rate
              </Table.ColumnHeader>
              <Table.ColumnHeader htmlWidth="5%"></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {jobData.map(job => (
              <Table.Row key={job.id}>
                <Table.Cell py={0}>{job.category}</Table.Cell>
                <Table.Cell py={0}>{job.jobOptions}</Table.Cell>
                <Table.Cell py={0}>{job.rate}</Table.Cell>
                <Table.Cell py={0}>
                  <Button fontSize="small" variant="ghost" p={1} colorPalette="transparent">
                    <EditIcon width="18px" height="18px" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </VStack>
    </VStack>
  )
}

const unitOptions = [
  { label: 'none', value: '' },
  { label: '$/sqft (per square foot)', value: '$/sqft' },
  { label: '$/hr (per hour)', value: '$/hr' },
  { label: '$/day (per day)', value: '$/day' },
  { label: '$/category (per unit)', value: '$/category' },
  { label: '$/linear ft (per linear foot)', value: '$/linear ft' },
  { label: '$/cubic yd (per cubic yard)', value: '$/cubic yd' },
  { label: '$/acre (per acre)', value: '$/acre' },
  { label: '$/mile (per mile)', value: '$/mile' },
  { label: '$/project (flat rate)', value: '$/project' },
  { label: '$/week (per week)', value: '$/week' },
]

const jobData = [
  {
    id: 'job-001',
    category: 'Pavers',
    jobOptions: 'Phoenix Pavers',
    rate: '$4.00/sqft',
  },
  {
    id: 'job-002',
    category: 'Pavers',
    jobOptions: 'Economy Pavers 1x1',
    rate: '$2.75/sqft',
  },
  {
    id: 'job-003',
    category: 'Artificial Turf',
    jobOptions: '80 oz or similar turf',
    rate: '$2.75/sqft',
  },
  {
    id: 'job-004',
    category: 'Travertine',
    jobOptions: 'Higher Tier Turf',
    rate: '$3.25/sqft',
  },
  {
    id: 'job-005',
    category: 'Sod (Natural Sod)',
    jobOptions: 'Bermuda Grass Sod',
    rate: '$0.78/sqft',
  },
  {
    id: 'job-006',
    category: 'Sod (Natural Sod)',
    jobOptions: 'St Augustine Sod',
    rate: '$1.00/sqft',
  },
]
