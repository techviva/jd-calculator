"use client"
import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react'
import {
    AbsoluteCenter,
    Button as ChakraButton,
    Span,
    Spinner,
} from '@chakra-ui/react'
import { forwardRef } from 'react'

interface ButtonLoadingProps {
    loading?: boolean
    loadingText?: React.ReactNode
}

export interface ButtonProps extends ChakraButtonProps, ButtonLoadingProps {
    href?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(props, ref) {
        const { loading, disabled, loadingText, children, ...rest } = props
        return (
            <ChakraButton
                bg="teal.fg"
                borderRadius={10}
                size="lg"
                disabled={loading || disabled}
                ref={ref}
                cursor="pointer"
                _hover={{ bg: 'teal.fg', opacity: 0.8 }}
                {...rest}
            >
                {loading && !loadingText ? (
                    <>
                        <AbsoluteCenter display="inline-flex">
                            <Spinner size="inherit" color="inherit" />
                        </AbsoluteCenter>
                        <Span opacity={0}>{children}</Span>
                    </>
                ) : loading && loadingText ? (
                    <>
                        <Spinner size="inherit" color="inherit" />
                        {loadingText}
                    </>
                ) : (
                    children
                )}
            </ChakraButton>
        )
    }
)
