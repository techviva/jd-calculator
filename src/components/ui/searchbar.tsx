"use client"
import { Input, InputElementProps } from '@chakra-ui/react'
import { InputGroup } from './input-group'
import { ChangeEvent } from 'react'
import { SearchIcon } from '../icons'

function SearchBar({
    onChange,
    value,
    startElement,
    endElement,
    ...rest
}: {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    value?: string
    startElement?: React.ReactNode
    endElement?: React.ReactNode
} & InputElementProps) {
    return (
        <InputGroup
            startElement={startElement ?? <SearchIcon color="gray.solid" />}
            endElement={endElement}
            borderRadius="full"
            {...rest}
        >
            <Input
                placeholder="Search"
                borderRadius={'full'}
                bg="gray.emphasized"
                value={value}
                onChange={onChange}
            />
        </InputGroup>
    )
}

export default SearchBar
