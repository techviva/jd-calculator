import * as React from 'react'
import { Icon, IconProps } from '@chakra-ui/react'

const TrendsIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="20px" height="18px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M18.962 0a.5.5 0 0 1 .5.5v22.154a.5.5 0 1 1-1 0V.5a.5.5 0 0 1 .5-.5m-3.693 3.692a.5.5 0 0 1 .5.5v18.462a.5.5 0 1 1-1 0V4.192a.5.5 0 0 1 .5-.5m7.385 0a.5.5 0 0 1 .5.5v18.462a.5.5 0 1 1-1 0V4.192a.5.5 0 0 1 .5-.5M7.884 5.538a.5.5 0 0 1 .5.5v16.616a.5.5 0 1 1-1 0V6.038a.5.5 0 0 1 .5-.5M.5 7.385a.5.5 0 0 1 .5.5v14.769a.5.5 0 1 1-1 0V7.884a.5.5 0 0 1 .5-.5m11.077 0a.5.5 0 0 1 .5.5v14.769a.5.5 0 1 1-1 0V7.884a.5.5 0 0 1 .5-.5m-7.385 3.692a.5.5 0 0 1 .5.5v11.077a.5.5 0 1 1-1 0V11.577a.5.5 0 0 1 .5-.5"
                clipRule="evenodd"
            ></path>
        </svg>
    </Icon>
)

export default TrendsIcon
