'use client'

import { useState } from "react";

export function handleSelecting () {
    const [selecting, setSelecting] = useState<string[]>([])

    const handleCheckboxChange = (name: string) => {
        setSelecting(prev => {
            if (prev.includes(name)) {
                
                return prev.filter(item => item !== name);
            } else {
                
                return [...prev, name];
            }
        });
    };

    return {selecting, handleCheckboxChange}
}