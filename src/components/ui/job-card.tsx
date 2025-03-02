import { Card, Flex } from "@chakra-ui/react"
import { JobsIcon } from "../icons"

export const JobCard = ({ title, description }: { title: string, description: string, }) => {
    return (
        <Card.Root width="300px" borderRadius="3xl">
            <Card.Body gap="1" pb={1}>
                <Card.Header p={0}>
                    <Flex p={2} borderRadius="full" bg="total" align="center" justify="center" width="fit-content" >
                        <JobsIcon width={"14px"} height={"14px"} color="blue.focusRing" />
                    </Flex>
                </Card.Header>
                <Card.Title mt="5" fontSize="20px">{title}</Card.Title>
                <Card.Description fontSize="sm" lineClamp={1}>
                    {`Job description: ${description}`}
                </Card.Description>
            </Card.Body>
            <Card.Footer justifyContent="flex-start" fontSize="xs" fontWeight="semibold" mt={1}>
                5 days
            </Card.Footer>
        </Card.Root>
    )
}
