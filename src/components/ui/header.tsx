'use client'
import {
  Flex,
  Heading,
  HStack,
  Box,
  Text,
  VStack,
  Button as DefaultButton,
  DialogActionTrigger,
  Popover,
} from '@chakra-ui/react'
import SearchBar from './searchbar'
import { Avatar } from './avatar'
import { SearchIcon } from '../icons'
import { useEffect, useState } from 'react'
import useDebounce from '@/hooks/useDebounce'
import { ColorModeButton } from './color-mode'
import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

export function Header() {
  const [searchValue, setSearchValue] = useState('')
  const debouncedTerm = useDebounce(searchValue, 1000)
  const { logout } = useAuth()

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  // cleanup useEffect code: for demo purposes
  useEffect(() => {
    if (debouncedTerm) {
      window.alert('You searched for: ' + debouncedTerm)
    }
  }, [debouncedTerm])

  return (
    <HStack
      as="header"
      justifyContent="space-between"
      p={{ base: 2, lg: 4 }}
      alignItems="center"
      bg="bg"
      borderRadius="3xl"
    >
      <Heading as="h1" fontWeight="bold">
        Viva Landscape Design
      </Heading>
      <SearchBar
        onChange={e => handleSearchTermChange(e as React.ChangeEvent<HTMLInputElement>)}
        value={searchValue}
        minWidth="350px"
        display={{ base: 'none', lg: 'flex' }}
      />
      <HStack gap={2}>
        <Flex
          borderRadius="full"
          bg="gray.emphasized"
          p={2}
          width="fit-content"
          justify="center"
          align="center"
          mr={2}
          display={{ base: 'flex', lg: 'none' }}
        >
          <SearchIcon />
        </Flex>

        <ColorModeButton />
        <Popover.Root>
          <Popover.Trigger>
            <Box cursor="pointer">
              <Avatar name="John Doe" src={undefined} />
            </Box>
          </Popover.Trigger>
          <Popover.Positioner>
            <Popover.Content width="200px" p={3}>
              <Popover.Arrow>
                <Popover.ArrowTip />
              </Popover.Arrow>
              <Popover.Body>
                <VStack gap={3} align="stretch">
                  <DialogRoot placement="center">
                    <DialogTrigger asChild>
                      <DefaultButton variant="outline" size="sm" width="100%">
                        <HStack>
                          <FiLogOut />
                          <Text>Logout</Text>
                        </HStack>
                      </DefaultButton>
                    </DialogTrigger>
                    <DialogContent borderRadius="3xl">
                      <DialogHeader>
                        <DialogTitle textAlign="center">Logout</DialogTitle>
                      </DialogHeader>
                      <DialogBody pb="8" textAlign="center">
                        Are you sure you want to logout?
                        <Flex gap={4} mt={4} justifyContent="center">
                          <DialogActionTrigger>
                            <DefaultButton fontSize="small">Cancel</DefaultButton>
                          </DialogActionTrigger>
                          <DefaultButton fontSize="small" colorScheme="red" onClick={logout}>
                            Logout
                          </DefaultButton>
                        </Flex>
                      </DialogBody>
                    </DialogContent>
                  </DialogRoot>
                </VStack>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      </HStack>
    </HStack>
  )
}
