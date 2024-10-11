'use client'

// React
import { ReactNode } from "react";

// BiBliotecas
import { RecoilRoot } from "recoil";

export const Recoil = ({ children }: { children: ReactNode }) => {
    return (
        <RecoilRoot>
            {children}
        </RecoilRoot>
    );
}