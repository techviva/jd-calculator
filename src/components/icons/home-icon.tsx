import * as React from 'react'
import { Icon, IconProps } from '@chakra-ui/react'

const HomeIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="20px" height="18px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="21"
            fill="none"
            viewBox="0 0 24 21"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M11.2.449a.6.6 0 0 1 .841 0l11.02 10.84a.6.6 0 0 1-.841.856l-1.936-1.905v9.984a.5.5 0 0 1-.5.5H3.457a.5.5 0 0 1-.5-.5V10.24l-1.936 1.905a.6.6 0 1 1-.842-.855zm.42 1.27 7.664 7.538v10.467h-3.898v-6.031a.5.5 0 0 0-.5-.5H9.988a.5.5 0 0 0-.5.5v6.03h-5.53V9.258zm-1.132 18.005h3.898v-5.531h-3.898z"
                clipRule="evenodd"
            ></path>
        </svg>
    </Icon>
)

export default HomeIcon
