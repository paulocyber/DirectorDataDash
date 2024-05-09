// Biblioteca
import { HTMLMotionProps, motion } from "framer-motion";

// Tipagem
interface MotionMenuProps extends HTMLMotionProps<"div"> {
    hoverAnimation?: { [key: string]: any };
}

export function MotionMenu({ children, hoverAnimation, ...rest }: MotionMenuProps) {
    return (
        <motion.div
            whileHover={hoverAnimation ?? { x: [-4, 4, -4, 0], transition: { duration: 0.5 } }}
            {...rest}
        >
            {children}
        </motion.div>
    )
}