"use client";
import { Heading, HStack } from "@chakra-ui/react";
import SearchBar from "./searchbar";
import { Button } from "./button";
import { Avatar } from "./avatar";

export function Header() {
    return (
        <HStack as="header" justifyContent="space-between" p={8} alignItems="center" bg="bg" borderRadius="3xl">
            <Heading as="h1" fontSize="3xl" fontWeight="bold">Viva Landscape Design</Heading>
            <SearchBar onChange={() => { }} value={""} minWidth="350px" />
            <HStack gap={2}>
                <Button fontSize="sm" p={3}>Create Project</Button>
                <Avatar name="John Doe" src={undefined} />
            </HStack>
        </HStack>
    );
}