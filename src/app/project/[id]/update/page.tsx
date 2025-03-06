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
import { createListCollection } from '@chakra-ui/react'
import { IoIosClose } from 'react-icons/io'
import { NativeSelectField, NativeSelectRoot } from '@/components/ui'

export default function BlankProject() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      materials: [{ material: '', quantity: '', price: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materials',
  })

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
          onSubmit={handleSubmit(data => console.log(data))}
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Heading as="h1" fontWeight="bold" fontSize="larger">
            Update project
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
                  <Table.ColumnHeader color="fg.muted">price</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fields?.map((field, index) => (
                  <Table.Row key={field.id}>
                    <Table.Cell>
                      <Controller
                        name={`materials.${index}.material`}
                        control={control}
                        render={({ field }) => (
                          <NativeSelectRoot {...field} variant="outline">
                            <NativeSelectField items={materials.items} fontSize="small" />
                          </NativeSelectRoot>
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
                          />
                        )}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end" display="flex" gap={3}>
                      <Controller
                        name={`materials.${index}.price`}
                        control={control}
                        render={({ field }) => (
                          <Group attached>
                            <InputAddon bg="bg" borderRight={0}>
                              $
                            </InputAddon>
                            <Input
                              {...field}
                              placeholder="price"
                              variant="outline"
                              borderLeft={0}
                              type="number"
                              fontSize="small"
                            />
                          </Group>
                        )}
                      />
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
              onClick={() => append({ material: '', quantity: '', price: '' })}
            >
              Add a material
            </Button>
          </VStack>
          <HStack
            mt="auto"
            mb={2}
            borderRadius="lg"
            justifyContent="space-between"
            widows="100%"
            alignItems="center"
          >
            <Button
              fontSize="small"
              colorPalette="default"
            >
              Save as draft
            </Button>
            <Button
              fontSize="small"
              colorPalette="default"
              borderRadius="lg"
              type="submit"
              minWidth="150px"
            >
              Next
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
      >
        <Box>
          <Text fontWeight="light" fontSize="xx-small">
            Total Cost
          </Text>
          <Text fontSize="larger">$8000</Text>
        </Box>
        <Box>
          <Text fontWeight="light" fontSize="xx-small">
            Net Profit
          </Text>
          <Text fontSize="larger">$8000</Text>
        </Box>
        <Box>
          <Text fontWeight="light" fontSize="xx-small">
            Amount for Clients
          </Text>
          <Text fontSize="larger">$8000</Text>
        </Box>
      </VStack>
    </Flex>
  )
}

const materials = createListCollection({
  items: [
    { value: 'Plywood', label: 'Plywood' },
    { value: 'MDF', label: 'MDF' },
    { value: 'Laminated Wood', label: 'Laminated Wood' },
    { value: 'Vinyl', label: 'Vinyl' },
    { value: 'Metal', label: 'Metal' },
    { value: 'Plastic', label: 'Plastic' },
    { value: 'Glass', label: 'Glass' },
    { value: 'Ceramic', label: 'Ceramic' },
  ],
})
