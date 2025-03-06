import { Flex, Presence, Text } from '@chakra-ui/react'
import Link from 'next/link'

interface NavItemProps {
  icon: React.ReactNode
  title: string
  active?: boolean
  linkTo: string
  isExtended?: boolean
}

export default function NavItem({ icon, title, linkTo, isExtended, active }: NavItemProps) {

  return (
    <Flex bg={active ? 'spot' : 'transparent'} borderRadius={isExtended ? '2xl' : 'lg'} alignItems="center" justifyContent="flex-start" width="100%">
      <Link
        href={linkTo}
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: isExtended ? '10px' : '8px',
          paddingBottom: '10px',
          paddingTop: '10px',
          gap: '10px',
          minHeight: '44px',
          width: '100%',
          justifyContent: 'flex-start',
          backgroundColor: active ? 'spot' : 'transparent',
        }}
      >
        {icon}
        <Presence
          present={isExtended}
          animationName={{ _open: 'slide-from-right, fade-in', _closed: 'slide-to-right, fade-out' }}
          animationDuration="0.6s"
          unmountOnExit
        >
          <Text textWrap="nowrap" transform="translateY(1px)" fontSize="sm">
            {title}
          </Text>
        </Presence>
      </Link>
    </Flex>
  )
}
