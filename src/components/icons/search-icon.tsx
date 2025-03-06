import * as React from 'react'
import { Icon, IconProps } from '@chakra-ui/react'

const SearchIcon = ({ color = '', ...rest }: IconProps) => (
  <Icon color={color} width="20px" height="18px" {...rest}>
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15.864 8.682a7.182 7.182 0 1 1-14.364 0 7.182 7.182 0 0 1 14.364 0m-1.761 6.128a8.182 8.182 0 1 1 .707-.707l5.135 5.134a.5.5 0 0 1-.708.708z"
        clipRule="evenodd"
      ></path>
    </svg>
  </Icon>
)

export default SearchIcon
