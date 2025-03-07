import { Box, Heading, VStack } from "@chakra-ui/react";

export default function CostManagement() {
    return (
        <VStack
            alignItems="center"
            width="100%"
            alignSelf="stretch"
            gap={6}
        >
            <Box width="100%" bg="bg" borderRadius="4xl" p={5}>
                <Heading as="h1" fontWeight="bold">
                    Cost Management
                </Heading>
            </Box>
        </VStack>
    )
}  