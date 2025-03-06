'use client'
import { BarChart } from '@/components/chart'
import { JobCard, JobStatsCard } from '@/components/ui'
import { VStack, Heading, Text, Flex, HStack, Box, Button } from '@chakra-ui/react'
import { BsArrowRight } from 'react-icons/bs'
import { useAuth } from '@/contexts/AuthContext'

const dummyStats = [
  {
    title: 'Total Jobs',
    stats: 431,
    iconColor: 'blue.focusRing',
    iconBg: 'total',
  },
  {
    title: 'In progress',
    stats: 431,
    iconColor: 'yellow.focusRing',
    iconBg: 'progress',
  },
  {
    title: 'Completed',
    stats: 431,
    iconColor: 'green.focusRing',
    iconBg: 'completed',
  },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <HStack
      height="max-content"
      width="100%"
      alignItems="flex-start"
      gap={4}
      py={2}
      wrap={{ base: 'wrap', lg: 'nowrap' }}
    >
      <VStack
        align="flex-start"
        width={{ base: '80%', lg: '60%' }}
        gap={2}
        pb={2}
        mt={{ base: 4, lg: 0 }}
        mr={{ base: 4, lg: 'auto' }}
      >
        <Heading as="h1" fontWeight="bold">
          Welcome {user?.profile?.username} ☁️
        </Heading>
        <Text color="fg.muted" fontWeight="semibold" mt={-1}>
          Some Stats
        </Text>
        <Flex gap={4} width="100%" wrap="wrap">
          {dummyStats.map(({ title, stats, iconColor, iconBg }) => (
            <JobStatsCard
              key={title}
              title={title}
              stats={stats}
              iconColor={iconColor}
              iconBg={iconBg}
            />
          ))}
        </Flex>
        <Box width="100%" p={6} borderRadius="3xl" bg="bg">
          <HStack
            pb={4}
            borderBottom="2px solid"
            borderColor="gray.subtle"
            mb={2}
            justifyContent="space-between"
          >
            <Box width="fit-content">
              <Text color="fg.muted" fontWeight="semibold">
                Statistics
              </Text>
              <Heading as="h2" fontWeight="bold">
                Profit vs Revenue
              </Heading>
            </Box>
            <Box>
              <Flex alignItems="center">
                <Box width="10px" height="10px" borderRadius="full" bg="revenue" mr={2} />
                <Text color="fg.muted" fontSize="small">
                  Revenue
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Box width="10px" height="10px" borderRadius="full" bg="profit" mr={2} />
                <Text color="fg.muted" fontSize="small">
                  Profit
                </Text>
              </Flex>
            </Box>
          </HStack>
          <BarChart />
        </Box>
      </VStack>
      <VStack
        gap={4}
        maxWidth={{ lg: '400px' }}
        minWidth="200px"
        width={{ base: '80%', lg: 'fit-content' }}
        alignItems="center"
        p={4}
        borderRadius="3xl"
        bg="spot"
        maxHeight={{ lg: '80dvh' }}
        height="100%"
        overflowY="auto"
        alignSelf={{ lg: 'flex-start' }}
      >
        <Flex justifyContent="space-between" width="100%" alignItems="center" color="fg.muted">
          <Heading fontSize="medium">Recent Projects</Heading>
          <Flex gap={1} align="center">
            <Text fontVariant="contextual" fontSize="small">
              See all
            </Text>
            <BsArrowRight fontWeight="bold" />
          </Flex>
        </Flex>
        {Array.from({ length: 3 }).map((_, index) => (
          <JobCard key={index} title="Mr. Krasinski's House" description="He wants..." />
        ))}
      </VStack>
    </HStack>
  )
}
