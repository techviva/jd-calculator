'use client'

import { Box, Flex, Text, VStack, Button as DefaultButton, DialogActionTrigger } from '@chakra-ui/react'
import { HomeIcon, JobsIcon, ManagementIcon, TrendsIcon, } from '../icons'
import NavItem from './nav-item'
import { ColorModeButton } from './color-mode'
import { Button } from './button'
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md'
import { FiLogOut } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

const navItems = [
  {
    title: 'Home',
    linkTo: '/',
    icon: <HomeIcon width="20px" height="18px" />,
  },
  {
    title: 'Jobs',
    linkTo: '/jobs',
    icon: <JobsIcon width="20px" height="18px" />,
  },
  {
    title: 'Trends',
    linkTo: '/trends',
    icon: <TrendsIcon width="20px" height="18px" />,
  },

  {
    title: 'Cost Management',
    linkTo: '/cost-management',
    icon: <ManagementIcon width="20px" height="18px" />,
  },
]

export const Sidenav = () => {
  const [isExtended, setIsExtended] = useState(true)

  const currentPath = usePathname()

  const { logout } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsExtended(false)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  console.log('currentPath', currentPath)

  return (
    <VStack
      as="nav"
      gap={0.5}
      justifyContent="flex-start"
      bg="bg"
      p={4}
      pt="30px"
      w={isExtended ? '100%' : '70px'}
      height={{ base: '85dvh', lg: '80vh' }}
      borderRadius="3xl"
      transition="width 0.4s ease-in-out"
      position="sticky"
      top="100px"
      maxWidth="250px"
      alignItems={isExtended ? 'flex-start' : 'center'}
      mr={6}
    >
      {navItems.map(item => (
        <NavItem
          key={item.title}
          title={item.title}
          linkTo={item.linkTo}
          icon={item.icon}
          isExtended={isExtended}
          active={currentPath === item.linkTo}
        />
      ))}
      <Flex
        direction={isExtended ? 'row' : 'column'}
        alignItems={isExtended ? 'center' : 'flex-start'}
        justifyContent={isExtended ? 'space-between' : 'center'}
        width="100%"
        mt="auto"
        gap={3}
        mr="auto"
        mb="50px">
        <Button
          p={1}
          ml={1}
          onClick={() => setIsExtended(!isExtended)}
          minWidth="24px"
          height="32px"
          borderRadius="md"
        >
          <Box
            width="fit-content"
            transform={isExtended ? 'rotate(0deg)' : ' rotate(180deg)'}
            transition="transform 0.3s ease-in-out"
            p={0}
          >
            <MdKeyboardDoubleArrowLeft style={{ padding: '0px' }} />
          </Box>
        </Button>

        <DialogRoot placement="center" >
          <DialogTrigger asChild>
            <DefaultButton variant="outline" size="sm" justifyContent="center" p={2}>
              <FiLogOut /> <Text display={isExtended ? 'block' : 'none'}>Logout</Text>
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
                  <Button
                    fontSize="small"
                    colorPalette="default"
                  >
                    Cancel
                  </Button>
                </DialogActionTrigger>
                <Button
                  fontSize="small"
                  colorPalette="red"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Flex>
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </Flex>
      <ColorModeButton mt="auto" position="absolute" bottom="20px" left={4} />
    </VStack>
  )
}
