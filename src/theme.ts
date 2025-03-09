import { createSystem, defaultConfig } from '@chakra-ui/react'

const customTheme = createSystem(defaultConfig, {
  globalCss: {
    body: {
      fontFamily: 'Inter, sans-serif',
      height: '100%',
    },
    html: {
      bg: 'bg.muted',
      scrollBehavior: 'smooth',
      height: '100%',
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        total: { value: { base: '{colors.blue.50}', _dark: '{colors.blue.900}' } },
        progress: { value: { base: '{colors.yellow.50}', _dark: '{colors.yellow.900}' } },
        completed: { value: { base: '{colors.green.50}', _dark: '{colors.green.900}' } },
        spot: {
          value: { base: '{colors.green.50}', _dark: '{colors.green.900}' },
        },
        profit: {
          value: { base: '#598C61', _dark: '#1DA768' },
        },
        revenue: {
          value: { base: '#9AA0F8', _dark: '#B0B6FF' },
        },
        stale: {
          value: { base: '#3C8AEF', _dark: '#8EC8FF' },
        },
      },
    },
  },
})

export default customTheme
