'use client'
import { Card, Flex, HStack, Text } from '@chakra-ui/react'
import { JobsIcon } from '../icons'
import { ProgressCircle } from './progress-circle'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaCheckCircle, FaClock, FaArrowRight, FaArchive } from 'react-icons/fa'

interface ProjectType {
  id: string | number
  title: string
  clientName: string
  status?: 'not started' | 'in progress' | 'completed' | 'archived' | string
  description?: string
  startDate?: string
  dueDate?: string
  createdAt?: any // Could be a Firestore timestamp or string
  [key: string]: any // For any additional properties
}

interface JobCardProps {
  project: ProjectType
  shouldDisplay?: boolean
}

export const JobCard = ({ project, shouldDisplay = true }: JobCardProps) => {
  const router = useRouter()

  const {
    id: projectId,
    title,
    clientName,
    description,
    status = 'not started',
    startDate,
    dueDate,
    createdAt,
  } = project

  // If shouldDisplay is false, don't render the component
  if (!shouldDisplay) {
    return null
  }

  // Status configuration
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          color: 'green',
          checked: true,
          disabled: false,
          label: 'Completed',
          icon: FaCheckCircle,
        }
      case 'in progress':
        return {
          color: 'orange',
          checked: false,
          disabled: false,
          label: 'In Progress',
          icon: FaClock,
        }
      case 'archived':
        return {
          color: 'gray',
          checked: true,
          disabled: true,
          label: 'Archived',
          icon: FaArchive,
        }
      case 'not started':
      default:
        return {
          color: 'yellow',
          checked: false,
          disabled: false,
          label: 'Not Started',
          icon: FaArrowRight,
        }
    }
  }

  const statusConfig = getStatusConfig()

  const getRemainingDays = (dueDate: string | undefined) => {
    if (!dueDate) {
      return undefined
    }
    const dueDateTime = new Date(dueDate).getTime()
    const currentTime = new Date().getTime()
    const remainingDays = Math.floor((dueDateTime - currentTime) / (1000 * 60 * 60 * 24))

    return remainingDays
  }

  const remainingDays = getRemainingDays(dueDate)

  const calculateProgressPercentage = (
    startDate: string | undefined,
    dueDate: string | undefined
  ) => {
    // If either date is missing, we can't calculate progress
    if (!startDate || !dueDate) {
      return undefined
    }

    const startDateTime = new Date(startDate).getTime()
    const dueDateTime = new Date(dueDate).getTime()
    const currentTime = new Date().getTime()

    // Calculate total project duration
    const totalDuration = dueDateTime - startDateTime

    // If total duration is zero or negative, handle appropriately
    if (totalDuration <= 0) {
      return 100
    }

    // Calculate elapsed time since project start
    const elapsedDuration = currentTime - startDateTime

    // Calculate progress as a percentage
    const progressPercentage = (elapsedDuration / totalDuration) * 100

    // Clamp the value between 0 and 100
    return Math.min(Math.max(progressPercentage, 0), 100)
  }

  const progressValue = calculateProgressPercentage(startDate, dueDate)

  const daysToDisplay = () => {
    if (!remainingDays) {
      return undefined
    } else if (remainingDays < 0) {
      return `${Math.abs(remainingDays)} days overdue`
    } else if (remainingDays === 0) {
      return 'Due today'
    } else if (remainingDays === 1) {
      return '1 day remaining'
    } else {
      return `${remainingDays} days remaining`
    }
  }

  const formatCreatedDate = (createdAt: any) => {
    if (!createdAt) return ''

    // Handle Firestore timestamp objects
    if (createdAt && typeof createdAt.toDate === 'function') {
      const date = createdAt.toDate()
      return `Created on ${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
    }

    // Handle date strings
    if (typeof createdAt === 'string') {
      const date = new Date(createdAt)
      return `Created on ${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
    }

    return ''
  }

  return (
    <Card.Root
      borderRadius="3xl"
      minWidth="200px"
      width="100%"
      maxWidth="300px"
      transition="all 0.2s ease-in-out"
      alignSelf="stretch"
      _hover={{
        cursor: 'pointer',
        bg: 'gray.subtle',
        scale: 1.05,
        transition: 'all 0.3s ease-in-out',
      }}
      onClick={() => {
        router.push(`/project/${projectId}`)
      }}
    >
      <Card.Body gap="1" pb={1}>
        <HStack width="100" justifyContent="space-between">
          <Flex
            p={2}
            borderRadius="full"
            bg="total"
            align="center"
            justify="center"
            width="fit-content"
          >
            <JobsIcon width="14px" height="14px" color="stale" />
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            {React.createElement(statusConfig.icon, {
              color: statusConfig.color,
              size: 16,
              'aria-label': statusConfig.label,
              title: statusConfig.label,
            })}
          </Flex>
        </HStack>
        <Card.Title fontSize="medium">{title}</Card.Title>
        <Text fontSize="small" color="stale" fontWeight="bold">
          {clientName}
        </Text>
        {description && (
          <Card.Description lineClamp={1} fontSize="xs">
            {description}
          </Card.Description>
        )}{' '}
      </Card.Body>
      <Card.Footer
        justifyContent="flex-start"
        fontSize="xs"
        fontWeight="semibold"
        mt={1}
        color={remainingDays && remainingDays < 0 ? 'red' : 'stale'}
        gap={1}
      >
        {dueDate && daysToDisplay() && (
          <>
            <ProgressCircle
              size="xs"
              color={remainingDays && remainingDays < 0 ? 'red' : 'stale'}
              trackColor="total"
              style={{ transform: 'scale(0.7)', marginRight: '2px' }}
              value={progressValue}
            />
            {daysToDisplay()}{' '}
          </>
        )}
        {createdAt && (
          <Text ml="auto" color="stale" fontSize="xs">
            {formatCreatedDate(createdAt)}
          </Text>
        )}
      </Card.Footer>
    </Card.Root>
  )
}
