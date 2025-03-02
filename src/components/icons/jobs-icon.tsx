import { Icon, IconProps } from '@chakra-ui/react'
import * as React from 'react'

const JobsIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="24px" height="22px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="21"
            fill="none"
            viewBox="0 0 24 21"
        >
            <path
                fill='currentColor'
                fillRule="evenodd"
                d="M8 1.554a1 1 0 0 1 1-1h5.4a1 1 0 0 1 1 1v2.2h6.7a1.3 1.3 0 0 1 1.3 1.3v4.8c0 1.38-.622 2.616-1.6 3.44v5.36a2.1 2.1 0 0 1-2.1 2.1h-16a2.1 2.1 0 0 1-2.1-2.1v-5.36A4.49 4.49 0 0 1 0 9.855v-4.8a1.3 1.3 0 0 1 1.3-1.3H8zm6.4 0v2.2H9v-2.2zm-13.1 3.2h20.8a.3.3 0 0 1 .3.3v4.8a3.5 3.5 0 0 1-1.4 2.8c-.585.44-1.311.7-2.1.7h-6.7v-1.1a.5.5 0 0 0-1 0v1.1H4.5c-.788 0-1.515-.26-2.1-.7a3.5 3.5 0 0 1-1.4-2.8v-4.8a.3.3 0 0 1 .3-.3m9.9 9.6H4.5c-.679 0-1.323-.15-1.9-.42v4.72a1.1 1.1 0 0 0 1.1 1.1h16a1.1 1.1 0 0 0 1.1-1.1v-4.72c-.577.27-1.222.42-1.9.42h-6.7v1.1a.5.5 0 1 1-1 0z"
                clipRule="evenodd"
            ></path>
        </svg>
    </Icon>
)

export default JobsIcon
