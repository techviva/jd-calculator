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
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Box, Flex, Heading, HStack, Spinner, Text } from '@chakra-ui/react'
import { useProjectStats } from '@/hooks/useProjectStats'

export function BarChart() {
  const { projectData, isLoading, error } = useProjectStats()
  // Extract last 5 months from the current month
  const currentMonth = new Date().getMonth()
  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]
  // Calculate month labels for last 5 months (including current month)
  const labels = Array.from({ length: 5 }, (_, i) => {
    // Start from (current month - 4) and go up to current month
    const monthIndex = (currentMonth - 4 + i + 12) % 12
    return monthNames[monthIndex]
  })

  // Filter data for the last 5 months from current month
  const filteredData = labels.map(month => {
    const monthData = projectData.find(item => item.month === month) || { revenue: 0, profit: 0 }
    return monthData
  })

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: filteredData.map(item => item.revenue),
        backgroundColor: '#9AA0F8', // Revenue color
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.6,
      },
      {
        label: 'Profit',
        data: filteredData.map(item => item.profit),
        backgroundColor: '#598C61', // Profit color
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.6,
      },
    ],
  }
  const maxYValue =
    Math.max(...filteredData.map(item => Math.max(item.revenue, item.profit))) * 1.25

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
              return value
            },
          },
        },
        datalabels: {
          display: true,
          align: 'top' as const,
          anchor: 'end' as const,
          formatter: (value: number) => (value !== 0 ? value.toLocaleString() : ''),
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
            displayOffset: 10,
          },
          suggestedMin: 1,
          suggestedMax: maxYValue,
          ticks: {
            stepSize: 1,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            callback: function (value: any) {
              return value
            },
          },

          grid: {
            display: false,
            drawBorder: false,
            color: '#c0bcbc',
          },
        },
      },
    },
  }

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

  return (
    <Box width="100%" p={6} borderRadius="3xl" bg="bg">
      <HStack
        pb={4}
        borderBottom="2px solid"
        borderColor="gray.subtle"
        mb={5}
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
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Text color="red.500">Failed to load chart data</Text>
        </Flex>
      ) : (
        <Bar options={config.options} data={config.data} />
      )}
    </Box>
  )
}
