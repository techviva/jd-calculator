import { Box, Card, Flex, Text } from "@chakra-ui/react"

export default function TemplateCard({ name }: { name: string }) {
    return (
        <Card.Root borderRadius="3xl" maxWidth="220px" width="100%">
            <Card.Body gap="1" pt={4}>
                <Card.Header p={0}>
                    <Flex py={0.5} px={2} borderRadius="full" bg="green.subtle" align="center" justify="center" width="fit-content" gap={0.5}>
                        <Box width="5px" height="5px" borderRadius="full" bg="green.focusRing" mr={2} />
                        <Text fontSize="xx-small" color="green.focusRing" fontWeight="medium" >
                            Template
                        </Text>
                    </Flex>
                </Card.Header>
                <Text fontWeight="bold" fontSize="small" truncate>{name}</Text>
            </Card.Body>
        </Card.Root>
    )
};