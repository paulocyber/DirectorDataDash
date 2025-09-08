'use client'

// Bibliotecas
import { AccordionItem, Accordion as AccordionUI } from "@heroui/react";

// React
import { ReactNode } from 'react';
import { FaPlus } from "react-icons/fa";

// Tipagem
type sections = {
    key: string;
    title: string;
    subtitle?: string;
    content: ReactNode;
}

interface AccordionProps {
    sections: sections[]
}

export default function Accordion({ sections }: AccordionProps) {
    return (
        <AccordionUI className=" p-2" defaultExpandedKeys={["1"]}>
            {sections.map(({ key, title, subtitle, content }) => (
                <AccordionItem
                    key={key}
                    textValue={title}
                    title={<h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
                    subtitle={<p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    indicator={<FaPlus className="transition-transform duration-300 accordion-icon" />}
                >
                    {content}
                </AccordionItem>
            ))}
        </AccordionUI>
    )
} 