'use client'

// React
import { ReactNode } from "react";

// BiBliotecas
import { Provider } from "jotai";

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <Provider>
            {children}
        </Provider>
    );
}