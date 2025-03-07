import { Icon, IconProps } from '@chakra-ui/react'
import * as React from 'react'

const EditIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="24px" height="22px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 22 22"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                d="M10 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M17.5 1.5a2.121 2.121 0 1 1 3 3L11 14l-4 1 1-4z"
            ></path>
        </svg>
    </Icon>
)

export default EditIcon
