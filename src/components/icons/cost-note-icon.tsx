import { Icon, IconProps } from '@chakra-ui/react'
import * as React from 'react'

const CostNoteIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="24px" height="22px" {...rest}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 18 18"
        >
            <path
                fill="#598C61"
                d="M16 2v9h-5v5H2V2zm0-2H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h10l6-6V2c0-1.1-.9-2-2-2M9 11H4V9h5zm5-4H4V5h10z"
            ></path>
        </svg>
    </Icon>
)

export default CostNoteIcon
