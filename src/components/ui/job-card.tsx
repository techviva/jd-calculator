'use client'
import { Card, Flex, Text } from '@chakra-ui/react'
import { JobsIcon } from '../icons'
import { ProgressCircle } from './progress-circle'
import { useRouter } from 'next/navigation'

export const JobCard = ({ projectId, title, clientName, description, dueDate }: { projectId: string | number, title: string, clientName: string, description: string, dueDate: string | undefined }) => {

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

  const calculateProgressPercentage = (dueDate: string | undefined) => {

    if (!dueDate) {
      return undefined;
    }
    const dueDateTime = new Date(dueDate).getTime()
    const currentTime = new Date().getTime()
    const totalDuration = dueDateTime - new Date().setDate(new Date().getDate() - 30) // Assuming 30 days ago as start
    const elapsedDuration = currentTime - new Date().setDate(new Date().getDate() - 30) // Assuming 30 days ago as start
    const progressPercentage = (elapsedDuration / totalDuration) * 100

    return Math.min(Math.max(progressPercentage, 0), 100); // Clamp the value between 0 and 100
  }

  const progressValue = calculateProgressPercentage(dueDate);

  console.log('ProgressValue', progressValue);


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
          <JobsIcon width="14px" height="14px" color="blue.focusRing" />
        </Flex>
        <Card.Title fontSize="medium">
          {title}
        </Card.Title>
        <Text fontSize="small" color="fg.info" fontWeight="bold">{clientName}</Text>
        <Card.Description lineClamp={1} fontSize="xs">{`Job description: ${description}`}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-start" fontSize="xs" fontWeight="semibold" mt={1} color="fg.info">
        {dueDate && (
          <ProgressCircle
            size="xs"
            color="fg.info"
            trackColor="transparent"
            style={{ transform: 'scale(0.7)', marginRight: '2px' }}
            value={progressValue}
          />
        )}
        {daysToDisplay()}
      </Card.Footer>
    </Card.Root>
  )
}
