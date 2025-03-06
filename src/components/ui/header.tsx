'use client'
import { Flex, Heading, HStack } from '@chakra-ui/react'
import SearchBar from './searchbar'
import { Avatar } from './avatar'
import { SearchIcon } from '../icons'
import { Button } from './button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useDebounce from '@/hooks/useDebounce'

export function Header() {
  const router = useRouter()

  const [searchValue, setSearchValue] = useState('')

  const debouncedTerm = useDebounce(searchValue, 1000)

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
        <Button
          fontSize="small"
          p={{ base: 2, lg: 3 }}
          onClick={() => router.push('/project/create')}
        >
          Create Project
        </Button>
        <Avatar name="John Doe" src={undefined} />
      </HStack>
    </HStack>
  )
}
