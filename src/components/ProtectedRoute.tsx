'use client'

import React, { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from './LoginForm'
import { Center, VStack, Box, Heading } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated && typeof window !== 'undefined') {
    return (
      <Center minH="100vh" bg="bg.subtle">
        <VStack gap={8}>
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={2}>
              Viva Job Calculator
            </Heading>
            {/* Optionally add a logo here */}
            {/* <Image src="/logo.png" alt="Logo" boxSize="100px" /> */}
          </Box>
          <LoginForm />
        </VStack>
      </Center>
    )
  }

  return <>{children}</>
}
