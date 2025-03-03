"use client";
import { Flex, Heading, HStack } from "@chakra-ui/react";
import SearchBar from "./searchbar";
import { Avatar } from "./avatar";
import { SearchIcon } from "../icons";
import { Button } from "./button";

export function Header() {
    return (
        <HStack as="header" justifyContent="space-between" p={{ base: 4, lg: 8 }} alignItems="center" bg="bg" borderRadius="3xl">
            <Heading as="h1" fontWeight="bold">Viva Landscape Design</Heading>
            <SearchBar onChange={() => { }} value={""} minWidth="350px" display={{ base: "none", lg: "flex" }} />
            <HStack gap={2}>
                <Flex borderRadius="full" bg="gray.emphasized" p={2} width="fit-content" justify="center" align="center" mr={2} display={{ base: "flex", lg: "none" }}>
                    <SearchIcon />
                </Flex>
                <Button fontSize="small" p={{ base: 2, lg: 3 }}>Create Project</Button>
                <Avatar name="John Doe" src={undefined} />
            </HStack>
        </HStack>
    );
}