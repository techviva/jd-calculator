import { BarChart } from "@/components/chart"
import { Heading, HStack, VStack } from "@chakra-ui/react"


export default function Trends() {
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
            <Heading as="h1" fontWeight="bold">
                Trends
            </Heading>
            <HStack width="60%" justifyContent="flex-start" alignItems="center" gap={4} mt="auto" >
                <BarChart />
            </HStack>
        </VStack>
    )
}