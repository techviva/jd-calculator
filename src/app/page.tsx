import { JobCard, JobStatsCard } from "@/components/ui";
import { VStack, Heading, Text, Grid, GridItem, HStack, Flex, Span } from "@chakra-ui/react";
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
    <HStack height="100%" width="100%" alignItems="flex-start" gap={8} pt={4}>
      <VStack gap={4} width="100%" align="flex-start">
        <Heading as="h1" fontSize="3xl" fontWeight="bold" >Welcome David ☁️</Heading>
        <Text color="fg.muted" fontSize="2xl" fontWeight="semibold">Some Stats</Text>
        <Grid gap={4} templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(200px, 1fr))" }} width="100%">
          {dummyStats.map(({ title, stats, iconColor, iconBg }) => (
            <GridItem key={title} >
              <JobStatsCard title={title} stats={stats} iconColor={iconColor} iconBg={iconBg} />
            </GridItem>
          ))}
        </Grid>

      </VStack>
      <VStack gap={4} width="fit-content" align="flex-start" p={4} borderRadius="3xl" bg="spot">
        <Flex justifyContent="space-between" width="100%" alignItems="center" color="fg.muted">
          <Heading as="h2">Recent Projects</Heading>
          <Flex gap={1} align="center"><Text fontSize="md">See all</Text> <BsArrowRight fontWeight="bold" /></Flex>
        </Flex>
        {Array.from({ length: 3 }).map((_, index) => (
          <JobCard key={index} title="Mr. Krasinski's House" description="He wants..." />
        ))}
      </VStack>
    </HStack>
  );
}

