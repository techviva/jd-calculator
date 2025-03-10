import {
    Flex,
    Heading,
    HStack,
    Table,
    VStack,
} from '@chakra-ui/react'
import { Skeleton } from './skeleton'

export const CostManagementSkeleton = () => {
    // Create an array to represent rows of skeleton loading items
    const skeletonRows = Array(6).fill(0)

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
                <Skeleton height="36px" width="150px" borderRadius="md" />
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
                                Description
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
                        {skeletonRows.map((_, index) => (
                            <Table.Row key={index}>
                                <Table.Cell py={2}>
                                    <Skeleton height="16px" width="80%" />
                                </Table.Cell>
                                <Table.Cell py={2}>
                                    <Skeleton height="16px" width="90%" />
                                </Table.Cell>
                                <Table.Cell py={2}>
                                    <Skeleton height="16px" width="60%" />
                                </Table.Cell>
                                <Table.Cell py={2}>
                                    <Flex gap={1} p={0} m={0}>
                                        <Skeleton height="18px" width="18px" />
                                        <Skeleton height="18px" width="18px" />
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </VStack>
        </VStack>
    )
}