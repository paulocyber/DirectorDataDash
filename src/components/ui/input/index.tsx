'use client'

// Bibliotecas
import { Input as Inpt } from '@nextui-org/react';

// React
import { ComponentProps } from 'react';

// Tipagem
type InputProps = ComponentProps<typeof Inpt>

export function Input({ ...rest }: InputProps) {
    return (
        <Inpt
            classNames={{
                inputWrapper: "bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent border border-gray-600"
            }}
            {...rest}
        />
    )
}