"use client"
import { BarChart } from "@/components/chart"
import { Heading, HStack, Input, VStack, Fieldset, Box } from "@chakra-ui/react"
import { useState } from "react"


export default function Trends() {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [dateError, setDateError] = useState<string | null>(null)

    const validateDates = (start: string, end: string) => {
        if (!start || !end) return true

        const startDateObj = new Date(start)
        const endDateObj = new Date(end)

        if (endDateObj < startDateObj) {
            setDateError("End date cannot be before start date")
            return false
        }

        setDateError(null)
        return true
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value
        setStartDate(newStartDate)
        validateDates(newStartDate, endDate)
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value
        setEndDate(newEndDate)
        validateDates(startDate, newEndDate)
    }

    return (
        <VStack
            alignItems="flex-start"
            width="100%"
            alignSelf="stretch"
            borderRadius="4xl"
            bg="bg"
            gap={6}
            p={5}
        >
            <Heading as="h1" fontWeight="bold">
                Trends
            </Heading>

            <Fieldset.Root invalid={!!dateError}>
                <Fieldset.Content display="flex" gap={4} flexDirection="row" justifyContent="flex-start" width="60%">
                    <Box width="100%">
                        <Fieldset.Legend fontSize="x-small" fontWeight="light">Start Date</Fieldset.Legend>
                        <Input
                            type="date"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </Box>

                    <Box width="100%">
                        <Fieldset.Legend fontSize="x-small" fontWeight="light">End Date</Fieldset.Legend>
                        <Input
                            type="date"
                            placeholder="End Date"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </Box>

                </Fieldset.Content>
                <Fieldset.ErrorText fontSize="small">{dateError}</Fieldset.ErrorText>
            </Fieldset.Root>
            <HStack width="100%" justifyContent="flex-start" alignItems="center" gap={4} mt="auto" >
                <BarChart startDate={startDate} endDate={endDate} />
            </HStack>
        </VStack>
    )
}