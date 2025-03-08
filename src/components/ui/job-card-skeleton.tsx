import { Box, Card, VStack } from "@chakra-ui/react"
import { Skeleton } from "./skeleton"

export const JobCardSkeleton = () => {
    return (
        <Card.Root
            borderRadius="3xl"
            minWidth="200px"
            width="100%"
            maxWidth="300px"
            bg="bg"
            p={4}
            boxShadow="sm"
        >
            <Card.Body gap="1" pb={1}>
                <VStack align="flex-start" gap="1" pb={1}>
                    {/* Card header with icon placeholder */}
                    <Box p={2} borderRadius="full" bg="bg.emphasized" width="28px" height="28px" />

                    {/* Card title */}
                    <Box mt="5">
                        <Skeleton height="20px" width="70%" />
                    </Box>

                    {/* Card description */}
                    <Box width="100%">
                        <Skeleton height="16px" width="90%" />
                    </Box>

                    {/* Card footer */}
                    <Box mt={1} width="40px">
                        <Skeleton height="14px" />
                    </Box>
                </VStack>
            </Card.Body>
        </Card.Root>
    )
}