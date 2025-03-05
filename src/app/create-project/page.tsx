"use client"
import { Button } from "@/components/ui/button";
import TemplateCard from "@/components/ui/template-card";
import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";


const dummyTemplates = [
    {
        id: 1,
        name: "Standard Paver Blocks",
    },
    {
        id: 2,
        name: "Standard Paver Blocks Deluxe",
    },
    {
        id: 3,
        name: "Double Paver Blocks Standard",
    },
    {
        id: 4,
        name: "Double Paver Blocks Deluxe",
    },
    {
        id: 5,
        name: "Double Paver Blocks Deluxe",
    }

]
export default function CreateProject() {

    const router = useRouter();

    return (
        <VStack alignItems="center" justifyContent="center" width="100%" borderRadius="4xl" bg="spot" p={4} alignSelf="stretch">
            <Heading as="h1" fontWeight="bold" width="fit-content">Create project</Heading>
            <Text color="fg.muted" fontWeight="semibold" mt={-2} width="fit-content" fontSize="small">Pick a template</Text>
            <Text color="fg.muted" fontWeight="light" mt={2} width="fit-content" fontSize="small">You can pick a template from one of these</Text>
            <HStack wrap="wrap" gap={4} mt={4} justifyContent="center">
                {dummyTemplates.map(({ id, name }) => (
                    <TemplateCard name={name} key={id} />
                ))}
            </HStack>

            <Button fontSize="small" p={2} py={0} mt={3} onClick={() => router.push("/create-project/blank")}>Create Blank Project</Button>
        </VStack>
    )
}