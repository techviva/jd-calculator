'use client'



import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react'


export function BarChart() {
  const labels = ['DEC', 'JAN', 'FEB', 'MAR', 'APR']

  const data = {
    labels,
    datasets: [
      {
        label: ' ',
        data: [1, 2, 3, 4],
        backgroundColor: '#598C61',
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.6,
      },
      {
        label: ' ',
        data: [4, 3, 2, 1],
        backgroundColor: '#9AA0F8',
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.6,
      },
    ],
  }

  const config = {
    type: 'bar',
    data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label: function (context: any) {
              const value = context.raw
              return value + 'M'
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          border: {
            dash: [5, 5],
            display: false,
            displayOffset: 5,
          },
          suggestedMin: 1,
          ticks: {
            stepSize: 1,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            callback: function (value: any) {
              return value + 'M'
            },
          },
          grid: {
            display: true,
            drawBorder: false,
            color: '#c0bcbc',
          },
        },
      },
    },
  }

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

  return (
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
      <Bar options={config.options} data={config.data} />
    </Box>
  )
}

