import { Flex, Card } from '@chakra-ui/react'
import { JobsIcon } from '../icons'

export const JobStatsCard = ({
  title,
  stats,
  iconColor,
  iconBg,
}: {
  title: string
  stats: number
  iconColor?: string
  iconBg?: string
}) => {
  return (
    <Card.Root borderRadius="3xl" width="150px">
      <Card.Header px={4} py={2}>
        <Flex
          p={2}
          borderRadius="full"
          bg={iconBg}
          align="center"
          justify="center"
          width="fit-content"
        >
          <JobsIcon width={'14px'} height={'14px'} color={iconColor} strokeWidth="10px" />
        </Flex>
      </Card.Header>
      <Card.Body py={1} pb={2} px={4}>
        <Card.Title fontSize="smaller" fontWeight="light">
          {title}
        </Card.Title>
        <Card.Description fontSize="large" fontWeight="bold" color="fg">
          {stats}
        </Card.Description>
      </Card.Body>
    </Card.Root>
  )
}
