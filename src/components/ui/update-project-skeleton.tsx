import {
    VStack,
    Flex,
    Box,
    HStack,
    Table,
} from '@chakra-ui/react'
import { Skeleton } from '@/components/ui/skeleton'

export function UpdateProjectSkeleton() {
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
                <Skeleton height="32px" width="250px" mb={2} />
                <Skeleton height="20px" width="300px" mb={4} />

                <HStack width="100%" gap={60} mb={4} rowGap={3}>
                    <Box width="150px">
                        <Skeleton height="16px" width="60px" mb={1} />
                        <Skeleton height="16px" width="120px" />
                    </Box>
                    <Box width="150px">
                        <Skeleton height="16px" width="80px" mb={1} />
                        <Skeleton height="16px" width="130px" />
                    </Box>
                </HStack>

                <Box
                    width="100%"
                    border="1.5px solid"
                    borderColor="border.muted"
                    mb={4}
                    mt={2}
                    p={3}
                >
                    <Table.Root size="sm">
                        <Table.ColumnGroup>
                            <Table.Column htmlWidth="40%" />
                            <Table.Column htmlWidth="20%" />
                            <Table.Column />
                        </Table.ColumnGroup>
                        <Table.Header bg="bg">
                            <Table.Row fontSize="small" fontWeight="light">
                                <Table.ColumnHeader>
                                    <Skeleton height="20px" width="80px" />
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    <Skeleton height="20px" width="60px" />
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    <Skeleton height="20px" width="40px" />
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell>
                                        <Skeleton height="36px" width="100%" my={2} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Skeleton height="36px" width="100%" my={2} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack>
                                            <Skeleton height="36px" width="80%" my={2} />
                                            <Skeleton height="20px" width="20px" borderRadius="full" />
                                            <Skeleton height="20px" width="20px" borderRadius="full" />
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                    <Skeleton height="32px" width="120px" mt={3} ml={2} mb={2} />
                </Box>

                <Flex width="100%" justifyContent="flex-end" mt="auto">
                    <Skeleton height="40px" width="150px" />
                </Flex>
            </VStack>

            <VStack
                width="15%"
                alignItems="flex-start"
                justifyContent="flex-start"
                height="100%"
                ml={{ base: 2, lg: 4 }}
                pt={{ base: 10, lg: 5 }}
                pl={1}
                gap={4}
            >
                <Box width="100%">
                    <Skeleton height="16px" width="100px" mb={1} />
                    <Skeleton height="36px" width="100%" mb={4} />
                </Box>

                <Box width="100%">
                    <Skeleton height="16px" width="80px" mb={1} />
                    <Skeleton height="24px" width="80px" />
                </Box>

                <Box width="100%">
                    <Skeleton height="16px" width="80px" mb={1} />
                    <Skeleton height="24px" width="80px" />
                </Box>

                <Box width="100%">
                    <Skeleton height="16px" width="120px" mb={1} />
                    <Skeleton height="24px" width="80px" />
                </Box>
            </VStack>
        </Flex>
    )
}