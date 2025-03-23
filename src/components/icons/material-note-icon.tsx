import { Icon, IconProps } from '@chakra-ui/react'
import * as React from 'react'

const MaterialNoteIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="24px" height="22px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="20"
            fill="none"
            viewBox="0 0 16 20"
        >
            <path
                fill="currentColor"
                d="M9 9H7v3H4v2h3v3h2v-3h3v-2H9zm1-9H2C.9 0 0 .9 0 2v16c0 1.1.89 2 1.99 2H14c1.1 0 2-.9 2-2V6zm4 18H2V2h7v5h5z"
            ></path>
        </svg>
    </Icon>
)

export default MaterialNoteIcon
