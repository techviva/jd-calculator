'use client'

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function BarChart() {
  return <Bar options={config.options} data={config.data} />
}
