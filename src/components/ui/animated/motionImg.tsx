// Biblioteca
import { HTMLMotionProps, motion } from "framer-motion";

// React
import React, { ReactNode } from "react";

// Tipagem
export interface AnimatedProps extends HTMLMotionProps<"div"> {
    initial?: { [key: string]: any };
    animate?: { [key: string]: any };
    transition?: { [key: string]: any };
    children: ReactNode;
}

export function AnimatedImg({ children, initial, animate, transition, ...rest }: AnimatedProps) {
    return (
        <motion.div
            initial={initial ?? { opacity: 0 }}
            animate={animate ?? { opacity: 1 }}
            transition={transition ?? { duration: 0.5 }}
            {...rest}
        >
            {children}
        </motion.div>
    );
}
