'use client'

import React, { useState } from 'react'
import { Box, Button, Input, VStack, Heading, Text, IconButton, Field } from '@chakra-ui/react'
import { useAuth } from '@/contexts/AuthContext'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { LuUser, LuLock } from 'react-icons/lu'
import { toaster } from '@/components/ui/toaster'
import { InputGroup } from '@/components/ui/input-group'

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Basic validation
    const newErrors: { username?: string; password?: string } = {}
    if (!username.trim()) {
      newErrors.username = 'Username is required'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const success = await login(username, password)

      if (!success) {
        toaster.create({
          title: 'Login failed',
          description: 'Please check your credentials and try again.',
          type: 'error',
        })
        setErrors({
          username: 'Invalid username or password',
          password: 'Invalid username or password',
        })
      }
    } catch (error) {
      toaster.create({
        title: 'An error occurred',
        description: 'Unable to log in at this time.',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box width="100%" maxWidth="400px" p={6} borderRadius="xl" bg="bg" boxShadow="md">
      <VStack gap={6} align="stretch">
        <VStack gap={2} align="center">
          <Heading as="h1" size="xl">
            Welcome
          </Heading>
          <Text color="fg.muted">Sign in to continue</Text>
        </VStack>

        <form onSubmit={handleSubmit}>
          <VStack gap={4}>
            <Field.Root invalid={!!errors.username}>
              <Field.Label>Username</Field.Label>
              <InputGroup startElement={<LuUser />}>
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </InputGroup>
              {errors.username && <Field.ErrorText>{errors.username}</Field.ErrorText>}
              <Field.HelperText>Enter your registered username</Field.HelperText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <InputGroup
                startElement={<LuLock />}
                endElement={
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    size="sm"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                }
              >
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </InputGroup>
              {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
            </Field.Root>

            <Button type="submit" colorScheme="blue" width="100%" loading={isLoading} mt={2}>
              Sign In
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  )
}
