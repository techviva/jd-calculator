import { Icon, IconProps } from '@chakra-ui/react'
import * as React from 'react'

const ManagementIcon = ({ color = '', ...rest }: IconProps) => (
    <Icon color={color} width="24px" height="22px" {...rest}>
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
                d="M3.578.154a1 1 0 0 0-.894.553L.053 5.969A.5.5 0 0 0 0 6.192v16.116a1 1 0 0 0 1 1h21.154a1 1 0 0 0 1-1V6.192a.5.5 0 0 0-.053-.223L20.47.707a1 1 0 0 0-.894-.553H3.578m0 1h7.499v4.538H1.309zm8.499 4.538V1.154h7.499l2.269 4.538zm-.5 1h10.577v15.616H1V6.692zm-3.692 4.539a.5.5 0 1 0 0 1h7.384a.5.5 0 1 0 0-1z"
                clipRule="evenodd"
            ></path>
        </svg>
    </Icon>
)

export default ManagementIcon
