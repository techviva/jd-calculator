"use client";

import { Box, VStack } from "@chakra-ui/react";
import { HomeIcon, JobsIcon, ManagementIcon, TrendsIcon } from "../icons";
import NavItem from "./nav-item";
import { ColorModeButton } from "./color-mode";
import { Button } from "./button";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useEffect, useState } from "react";

const navItems = [
    {
        title: "Home",
        linkTo: "/",
        icon: <HomeIcon width="20px" height="18px" />,
    },
    {
        title: "Jobs",
        linkTo: "/jobs",
        icon: <JobsIcon width="20px" height="18px" />,
    },
    {
        title: "Trends",
        linkTo: "/trends",
        icon: <TrendsIcon width="20px" height="18px" />,
    },

    {
        title: "Cost Management",
        linkTo: "/cost-management",
        icon: <ManagementIcon width="20px" height="18px" />,
    },
];

export const Sidenav = () => {

    const [isExtended, setIsExtended] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1200) {
                setIsExtended(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <VStack as="nav" gap={0.5} justifyContent="flex-start" bg="bg" p={4} pt="30px" w={isExtended ? "100%" : "70px"} height="70dvh" borderRadius="3xl" transition="width 0.4s ease-in-out" position="sticky" top="15%" maxWidth="250px" alignItems={isExtended ? "flex-start" : "center"} mr={6} >
            {navItems.map((item) => (
                <NavItem
                    key={item.title}
                    title={item.title}
                    linkTo={item.linkTo}
                    icon={item.icon}
                    isExtended={isExtended}
                />
            ))}
            <Button mt={5} mx="auto" p={1} onClick={() => setIsExtended(!isExtended)} minWidth="24px" height="32px" borderRadius="md">
                <Box width="fit-content" transform={isExtended ? "rotate(0deg)" : " rotate(180deg)"} transition="transform 0.3s ease-in-out" p={0}>
                    <MdKeyboardDoubleArrowLeft style={{ padding: "0px" }} />
                </Box>
            </Button>
            <ColorModeButton mt="auto" position="absolute" bottom="20px" left={4} />
        </VStack>
    );
}