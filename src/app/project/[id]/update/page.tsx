'use client'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Heading,
  Text,
  VStack,
  Table,
  Input,
  Group,
  InputAddon,
  Button as DefaultButton,
  Box,
  Flex,
  HStack,
} from '@chakra-ui/react'
import { IoIosClose } from 'react-icons/io'
import Select from 'react-select'
import { useState, useEffect } from 'react'
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useParams } from 'next/navigation'
import { CostItem } from '@/app/cost-management/page'

interface MaterialOption {
  value: string
  label: string
  price: number
  quantity: string
}

export default function UpdateProject() {
  const [materials, setMaterials] = useState<MaterialOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCost, setTotalCost] = useState(0)
  const [netProfit, setNetProfit] = useState(0)
  const [clientAmount, setClientAmount] = useState(0)
  const [profitMargin, setProfitMargin] = useState(20) // Default 20% profit margin
  const [formUpdateTrigger, setFormUpdateTrigger] = useState(0) // Add trigger state
  const params = useParams()
  const projectId = params.id as string

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      materials: [{ value: '', label: '', quantity: '', price: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materials',
  })

  // Watch all material inputs to calculate totals
  const watchMaterials = watch('materials')

  // Fetch materials from Firestore
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const costsCollection = collection(db, 'costs')
        const materialsSnapshot = await getDocs(costsCollection)

        const materialOptions: MaterialOption[] = []

        materialsSnapshot.forEach(doc => {
          const materialData = doc.data() as CostItem
          materialOptions.push({
            value: doc.id,
            label: materialData.description,
            price: materialData.rate,
            quantity: '',
          })
        })

        setMaterials(materialOptions)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching materials:', error)
        setIsLoading(false)
      }
    }

    // Fetch existing project data if available
    const fetchProjectData = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId)
        const projectSnapshot = await getDoc(projectRef)

        if (projectSnapshot.exists()) {
          const projectData = projectSnapshot.data()
          // TODO: Add logic to populate form with existing project data
        }
      } catch (error) {
        console.error('Error fetching project data:', error)
      }
    }

    fetchMaterials()
    fetchProjectData()
  }, [projectId])

  // Calculate totals whenever materials change or profit margin changes
  useEffect(() => {
    let cost = 0

    watchMaterials.forEach(material => {
      if (material.value && material.quantity) {
        const selectedMaterial = materials.find(m => m.value === material.value)
        if (selectedMaterial) {
          const quantity = parseFloat(material.quantity) || 0
          const itemCost = selectedMaterial.price * quantity
          cost += itemCost
        }
      }
    })

    setTotalCost(cost)
    // Use the profitMargin state to calculate profit
    const profitRate = profitMargin / 100
    setNetProfit(cost * profitRate)
    setClientAmount(cost * (1 + profitRate)) // Cost + profit
  }, [watchMaterials, materials, profitMargin, formUpdateTrigger]) // Add trigger to dependencies

  const onSubmit = async (data: { materials: MaterialOption[] }) => {
    try {
      // Format data for Firestore
      const materialsToSave = data.materials.map(item => {
        const selectedMaterial = materials.find(m => m.value === item.value)
        const quantity = parseFloat(item.quantity) || 0
        const price = selectedMaterial ? selectedMaterial.price * quantity : 0

        return {
          value: item.value,
          quantity: quantity,
          calculatedPrice: price,
        }
      })

      // Save to Firestore
      const projectRef = doc(db, 'projects', projectId)
      await updateDoc(projectRef, {
        materials: materialsToSave,
        totalCost,
        netProfit,
        clientAmount,
        profitMargin, // Save the profit margin
      })

      console.log('Project updated successfully')
      // Navigate or show success message
    } catch (error) {
      console.error('Error updating project:', error)
      // Show error message
    }
  }

  if (isLoading) {
    return <Text>Loading materials...</Text>
  }

  return (
    <Flex
      width="100%"
      borderRadius="4xl"
      bg="bg"
      p={4}
      alignItems="flex-start"
      alignSelf="stretch"
      direction={{ base: 'column', lg: 'row' }}
      position="relative"
    >
      <VStack
        alignItems="flex-start"
        width={{
          base: '100%',
          lg: '80%',
        }}
        height="100%"
        pr={4}
        borderRight="1.5px solid"
        borderColor={{ base: 'transparent', lg: 'border.muted' }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          onChange={() => setFormUpdateTrigger(prev => prev + 1)} // Add form-level change handler
        >
          <Heading as="h1" fontWeight="bold" fontSize="larger">
            Update Project Details
          </Heading>
          <Text color="fg.muted" fontWeight="semibold" mt={1} fontSize="small">
            Enter the details of the materials
          </Text>
          <VStack
            alignItems="flex-start"
            border="1.5px solid"
            borderColor="border.muted"
            mb={4}
            mt={2}
          >
            <Table.Root size="sm">
              <Table.ColumnGroup>
                <Table.Column htmlWidth="40%" />
                <Table.Column htmlWidth="20%" />
                <Table.Column />
              </Table.ColumnGroup>
              <Table.Header bg="bg">
                <Table.Row fontSize="small" fontWeight="light">
                  <Table.ColumnHeader color="fg.muted">Material</Table.ColumnHeader>
                  <Table.ColumnHeader color="fg.muted">Quantity</Table.ColumnHeader>
                  <Table.ColumnHeader color="fg.muted">Price</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fields?.map((field, index) => (
                  <Table.Row key={field.id}>
                    <Table.Cell>
                      <Controller
                        name={`materials.${index}`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={materials}
                            placeholder="Select material"
                            onChange={val => {
                              field.onChange(val)
                              setFormUpdateTrigger(prev => prev + 1) // Trigger update on select change
                            }}
                            styles={{
                              // ...existing code...
                              control: baseStyles => ({
                                ...baseStyles,
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
                    </Table.Cell>
                    <Table.Cell>
                      <Controller
                        name={`materials.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="quantity"
                            variant="outline"
                            type="number"
                            fontSize="small"
                            onChange={e => {
                              field.onChange(e)
                              setFormUpdateTrigger(prev => prev + 1) // Trigger update on quantity change
                            }}
                          />
                        )}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end" display="flex" gap={3}>
                      <Box flexGrow={1}>
                        {(() => {
                          const material = watchMaterials[index]
                          const selectedMaterial = material.value
                            ? materials.find(m => m.value === material.value)
                            : null
                          const quantity = parseFloat(material.quantity) || 0
                          const price = selectedMaterial
                            ? (selectedMaterial.price * quantity).toFixed(2)
                            : '0.00'

                          return (
                            <Group attached>
                              <InputAddon bg="bg" borderRight={0}>
                                $
                              </InputAddon>
                              <Input
                                value={price}
                                readOnly
                                placeholder="0.00"
                                variant="outline"
                                borderLeft={0}
                                fontSize="small"
                              />
                            </Group>
                          )
                        })()}
                      </Box>
                      <DefaultButton
                        size="xs"
                        variant="subtle"
                        colorPalette="red"
                        borderRadius="full"
                        minWidth="fit-content"
                        width="20px"
                        height="20px"
                        p={0}
                        ml="auto"
                        fontSize="sm"
                        onClick={() => remove(index)}
                      >
                        <IoIosClose />
                      </DefaultButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Button
              fontSize="small"
              minHeight="fit-content"
              colorPalette="green"
              mt={3}
              ml={2}
              mb={2}
              onClick={() => append({ value: '', quantity: '', price: '', label: '' })} // Append a new empty material
            >
              Add a material
            </Button>
          </VStack>
          <HStack
            mt="auto"
            mb={2}
            borderRadius="lg"
            justifyContent="flex-end"
            widows="100%"
            alignItems="center"
            pl={3}
          >
            <Button
              fontSize="small"
              colorPalette="default"
              borderRadius="lg"
              type="submit"
              minWidth="150px"
            >
              Submit
            </Button>
          </HStack>
        </form>
      </VStack>
      <VStack
        width="15%"
        alignItems="flex-start"
        justifyContent="flex-start"
        height="100%"
        ml={{ base: 2, lg: 4 }}
        pt={{ base: 10, lg: 5 }}
        pl={1}
        spacing={4}
      >
        <Box width="100%">
          <Text fontWeight="light" fontSize="xx-small">
            Profit Margin (%)
          </Text>
          <Input
            type="number"
            value={profitMargin}
            onChange={e => {
              setProfitMargin(Number(e.target.value))
              setFormUpdateTrigger(prev => prev + 1) // Trigger update on profit margin change
            }}
            min={0}
            max={100}
            step={1}
            fontSize="small"
            mb={4}
          />
        </Box>
        <Box>
          <Text fontWeight="light" fontSize="xx-small">
            Total Cost
          </Text>
          <Text fontSize="larger">${totalCost.toFixed(2)}</Text>
        </Box>
        <Box>
          <Text fontWeight="light" fontSize="xx-small">
            Net Profit
          </Text>
          <Text fontSize="larger">${netProfit.toFixed(2)}</Text>
        </Box>
        <Box>
          <Text fontWeight="light" fontSize="xx-small">
            Amount for Clients
          </Text>
          <Text fontSize="larger">${clientAmount.toFixed(2)}</Text>
        </Box>
      </VStack>
    </Flex>
  )
}
