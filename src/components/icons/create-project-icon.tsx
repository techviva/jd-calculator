import * as React from 'react'
import { Icon, IconProps } from '@chakra-ui/react'

const CreateProjectIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="20px" height="18px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1"
                d="M10 6v8m-4-4h8M3 1h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z"
            ></path>
        </svg>
    </Icon>
)

export default CreateProjectIcon
