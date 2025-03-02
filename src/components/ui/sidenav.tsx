"use client";

import { Box, useDisclosure, VStack } from "@chakra-ui/react";
import { HomeIcon, JobsIcon, ManagementIcon, TrendsIcon } from "../icons";
import NavItem from "./nav-item";
import { ColorModeButton } from "./color-mode";
import { Button } from "./button";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const navItems = [
    {
        title: "Home",
        linkTo: "/",
        icon: <HomeIcon />,
    },
    {
        title: "Trends",
        linkTo: "/trends",
        icon: <TrendsIcon />,
    },
    {
        title: "Jobs",
        linkTo: "/jobs",
        icon: <JobsIcon />,
    },

    {
        title: "Cost Management",
        linkTo: "/cost-management",
        icon: <ManagementIcon />,
    },
];

export const Sidenav = () => {

    const { open, setOpen } = useDisclosure();

    return (
        <VStack as="nav" gap={4} alignItems="center" justifyContent="flex-start" bg="bg" p={4} pt="60px" w={!open ? "100%" : "70px"} height="70dvh" borderRadius="3xl" transition="width 0.4s ease-in-out" position="relative" maxWidth="300px">
            {navItems.map((item) => (
                <NavItem
                    key={item.title}
                    title={item.title}
                    linkTo={item.linkTo}
                    icon={item.icon}
                    isExtended={!open}
                />
            ))}
            <Button mt={5} mx="auto" p={0} onClick={() => setOpen(!open)}>
                <Box width="fit-content" transform={!open ? "rotate(0deg)" : " rotate(180deg)"} transition="transform 0.3s ease-in-out">
                    <MdKeyboardDoubleArrowLeft style={{ padding: "0px" }} />
                </Box>
            </Button>
            <ColorModeButton mt="auto" position="absolute" bottom="20px" left={5} />
        </VStack>
    );
}