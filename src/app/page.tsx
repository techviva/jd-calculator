import { JobCard, JobStatsCard } from "@/components/ui";
import { VStack, Heading, Text, Flex, Stack } from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";


const dummyStats = [
  {
    title: "Total Jobs",
    stats: 431,
    iconColor: "blue.focusRing",
    iconBg: "total",
  },
  {
    title: "In progress",
    stats: 431,
    iconColor: "yellow.focusRing",
    iconBg: "progress",
  },
  {
    title: "Completed",
    stats: 431,
    iconColor: "green.focusRing",
    iconBg: "completed",
  }
];

export default function Home() {
  return (
    <Stack direction={{ base: "column", lg: "row" }} height="max-content" width="100%" alignItems="flex-start" gap={8} pt={4}>
      <VStack align="flex-start">
        <Heading as="h1" fontWeight="bold" >Welcome David ☁️</Heading>
        <Text color="fg.muted" fontWeight="semibold">Some Stats</Text>
        <Flex gap={4} width="100%" wrap="wrap">
          {dummyStats.map(({ title, stats, iconColor, iconBg }) => (
            <JobStatsCard key={title} title={title} stats={stats} iconColor={iconColor} iconBg={iconBg} />
          ))}
        </Flex>
      </VStack>
      <VStack gap={4} maxWidth={{ base: "100%", lg: "400px" }} minWidth="250px" width={{ base: "100%", lg: "fit-content" }} alignItems="center" p={4} borderRadius="3xl" bg="spot" maxHeight={{ lg: "80%" }} height={{ base: "100%", lg: "70dvh" }} overflowY={{ lg: "scroll" }} marginLeft={{ lg: "auto" }}>
        <Flex justifyContent="space-between" width="100%" alignItems="center" color="fg.muted">
          <Heading fontSize="medium">Recent Projects</Heading>
          <Flex gap={1} align="center">
            <Text fontVariant="contextual" fontSize="small">See all</Text>
            <BsArrowRight fontWeight="bold" />
          </Flex>
        </Flex>
        {Array.from({ length: 3 }).map((_, index) => (
          <JobCard key={index} title="Mr. Krasinski's House" description="He wants..." />
        ))}
      </VStack>
    </Stack>
  );
}

