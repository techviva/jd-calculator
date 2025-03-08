import { Icon, IconProps } from '@chakra-ui/react'
import * as React from 'react'

const DeleteIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="24px" height="22px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="21"
            fill="none"
            viewBox="0 0 19 21"
        >
            <path
                fill="currentColor"
                d="M16.026 6.288H3.53a.42.42 0 0 0-.419.456L4.19 18.595a1.677 1.677 0 0 0 1.67 1.525h7.836a1.677 1.677 0 0 0 1.67-1.525l1.077-11.85a.42.42 0 0 0-.417-.458M8.313 17.185a.629.629 0 1 1-1.258 0V9.64a.629.629 0 1 1 1.258 0zm4.192 0a.629.629 0 0 1-1.258 0V9.64a.629.629 0 1 1 1.258 0zm5.657-13.833H14.18a.21.21 0 0 1-.21-.21V2.097A2.096 2.096 0 0 0 11.874 0H7.682a2.096 2.096 0 0 0-2.095 2.096v1.048a.21.21 0 0 1-.21.21H1.395a.838.838 0 0 0 0 1.676h16.767a.838.838 0 1 0 0-1.677m-10.899-.21V2.097a.42.42 0 0 1 .42-.42h4.191a.42.42 0 0 1 .42.42v1.048a.21.21 0 0 1-.21.21H7.473a.21.21 0 0 1-.21-.21"
            ></path>
        </svg>
    </Icon>
)

export default DeleteIcon
