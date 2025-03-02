import { Flex, Card } from "@chakra-ui/react"
import { JobsIcon } from "../icons"

export const JobStatsCard = ({ title, stats, iconColor, iconBg }: { title: string, stats: number, iconColor?: string, iconBg?: string }) => {
    return (
        <Card.Root borderRadius="3xl">
            <Card.Header px={5} pt={5}>
                <Flex p={2} borderRadius="full" bg={iconBg} align="center" justify="center" width="fit-content" >
                    <JobsIcon width={"14px"} height={"14px"} color={iconColor} strokeWidth="10px" />
                </Flex>
            </Card.Header>
            <Card.Body py={1} pb={5} px={5}>
                <Card.Title mt="1" fontSize="smaller" fontWeight="light">{title}</Card.Title>
                <Card.Description fontSize="3xl" fontWeight="bold" color="fg">
                    {stats}
                </Card.Description>
            </Card.Body>
        </Card.Root>
    )
}
