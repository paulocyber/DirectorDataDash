'use client'

// Bibliotecas
import { Input as Inpt } from '@heroui/input';

// React
import { ComponentProps } from 'react';

// Tipagem
type InputProps = ComponentProps<typeof Inpt> & {
    error?: boolean
}

export function Input({ error, ...rest }: InputProps) {
    return (
        <Inpt
            classNames={{
                label: error && `group-data-[filled-within=true]:text-red-600`,
                inputWrapper: `bg-transparent data-[hover=true]:bg-transparent ${error ? 'group-data-[focus=true]:bg-transparent border border-red-600' : 'group-data-[focus=true]:bg-transparent border border-gray-600'}`
            }}
            {...rest}
        />
    )
}