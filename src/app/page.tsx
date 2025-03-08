'use client'
import { BarChart } from '@/components/chart'
import { Button, JobCard, JobStatsCard } from '@/components/ui'
import { VStack, Heading, Text, Flex, HStack } from '@chakra-ui/react'
import { BsArrowRight } from 'react-icons/bs'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { Project } from '@/types'
import { db } from '@/lib/firebase'
import HomeSkeleton from '@/components/ui/home-skeleton'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const projectsCollection = collection(db, 'projects')
        const projectSnapshot = await getDocs(projectsCollection)
        const projectList = projectSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[]

        // Calculate stats from projects
        const total = projectList.length
        const inProgress = projectList.filter(project => project.status === 'in progress').length
        const completed = projectList.filter(project => project.status === 'completed').length

        setStats({
          total,
          inProgress,
          completed,
        })

        setProjects(projectList)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Stats configuration based on real data
  const statsConfig = [
    {
      title: 'Total Jobs',
      stats: stats.total,
      iconColor: 'stale',
      iconBg: 'total',
    },
    {
      title: 'In progress',
      stats: stats.inProgress,
      iconColor: 'yellow.focusRing',
      iconBg: 'progress',
    },
    {
      title: 'Completed',
      stats: stats.completed,
      iconColor: 'green.focusRing',
      iconBg: 'completed',
    },
  ]

  if (loading) {
    return <HomeSkeleton />
  }

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
          {statsConfig.map(({ title, stats, iconColor, iconBg }) => (
            <JobStatsCard
              key={title}
              title={title}
              stats={stats}
              iconColor={iconColor}
              iconBg={iconBg}
            />
          ))}
        </Flex>
        <BarChart />
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
          <Button
            colorPalette="transparent"
            variant="ghost"
            size="sm"
            onClick={() => router.push('/jobs')}
          >
            <Flex gap={1} align="center">
              <Text fontVariant="contextual" fontSize="small">
                See all
              </Text>
              <BsArrowRight fontWeight="bold" />
            </Flex>
          </Button>
        </Flex>
        {projects.length > 0 ? (
          projects
            .slice(0, 5)
            .map(project => (
              <JobCard
                key={project.id}
                projectId={project.id}
                title={project.title || 'Unnamed Project'}
                clientName={project.clientName || 'Unnamed Client'}
                description={project.description}
                startDate={'2025-02-24'}
                dueDate={project.dueDate}
              />
            ))
        ) : (
          <Text color="fg.muted">No projects found</Text>
        )}
      </VStack>
    </HStack>
  )
}
