'use client'
import { Card, Flex, Text } from '@chakra-ui/react'
import { JobsIcon } from '../icons'
import { ProgressCircle } from './progress-circle'
import { useRouter } from 'next/navigation'

export const JobCard = ({ projectId, title, clientName, description, startDate, dueDate }: { projectId: string | number, title: string, clientName: string, description: string, startDate: string | undefined, dueDate: string | undefined }) => {

  const router = useRouter();
  const getRemainingDays = (dueDate: string | undefined) => {

    if (!dueDate) {
      return undefined;
    }
    const dueDateTime = new Date(dueDate).getTime()
    const currentTime = new Date().getTime()
    const remainingDays = Math.floor((dueDateTime - currentTime) / (1000 * 60 * 60 * 24))

    return remainingDays;
  }

  const remainingDays = getRemainingDays(dueDate);

  const calculateProgressPercentage = (startDate: string | undefined, dueDate: string | undefined) => {
    // If either date is missing, we can't calculate progress
    if (!startDate || !dueDate) {
      return undefined;
    }

    const startDateTime = new Date(startDate).getTime();
    const dueDateTime = new Date(dueDate).getTime();
    const currentTime = new Date().getTime();

    // Calculate total project duration
    const totalDuration = dueDateTime - startDateTime;

    // If total duration is zero or negative, handle appropriately
    if (totalDuration <= 0) {
      return 100;
    }

    // Calculate elapsed time since project start
    const elapsedDuration = currentTime - startDateTime;

    // Calculate progress as a percentage
    const progressPercentage = (elapsedDuration / totalDuration) * 100;

    // Clamp the value between 0 and 100
    return Math.min(Math.max(progressPercentage, 0), 100);
  }

  const progressValue = calculateProgressPercentage(startDate, dueDate);

  const daysToDisplay = () => {
    if (!remainingDays) {
      return 'No Due date';
    } else if (remainingDays < 0) {
      return `${Math.abs(remainingDays)} days overdue`;
    } else if (remainingDays === 0) {
      return 'Due today';
    } else if (remainingDays === 1) {
      return '1 day remaining';
    } else {
      return `${remainingDays} days remaining`;
    }
  }


  return (
    <Card.Root
      borderRadius="3xl"
      minWidth="200px"
      width="100%"
      maxWidth="300px"
      transition="all 0.2s ease-in-out"
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
        <Card.Title fontSize="medium">
          {title}
        </Card.Title>
        <Text fontSize="small" color="stale" fontWeight="bold">{clientName}</Text>
        <Card.Description lineClamp={1} fontSize="xs">{description}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-start" fontSize="xs" fontWeight="semibold" mt={1} color={remainingDays && remainingDays < 0 ? 'red' : 'stale'} gap={1}>
        {dueDate && (
          <ProgressCircle
            size="xs"
            color={remainingDays && remainingDays < 0 ? 'red' : 'stale'}
            trackColor="total"
            style={{ transform: 'scale(0.7)', marginRight: '2px' }}
            value={progressValue}
          />
        )}
        {daysToDisplay()}
      </Card.Footer>
    </Card.Root>
  )
}
