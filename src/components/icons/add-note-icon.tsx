import { Icon, IconProps } from '@chakra-ui/react'
import * as React from 'react'

const AddNoteIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="24px" height="22px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 18 18"
        >
            <path
                fill="currentColor"
                d="M8.297.563h1.406q.188 0 .188.187v16.5q0 .188-.188.188H8.297q-.188 0-.188-.188V.75q0-.187.188-.187"
            ></path>
            <path
                fill="currentColor"
                d="M1.125 8.11h15.75q.188 0 .188.187v1.406q0 .188-.188.188H1.125q-.187 0-.187-.188V8.297q0-.188.187-.188"
            ></path>
        </svg>
    </Icon>
)

export default AddNoteIcon
