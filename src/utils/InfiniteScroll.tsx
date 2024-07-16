// React
import { useEffect, useRef } from "react";

// Tipagem
interface infiniteScrollProps {
    fetchMore: () => void;
}

export function InfiniteScroll({ fetchMore }: infiniteScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const options = {
            root: document.querySelector("#scrollArea"),
            rootMargin: "0px",
            threshold: 1,
        };

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                observer.disconnect();
                fetchMore();
            }
        }, options);

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [fetchMore]);

    return <div ref={containerRef} />;
}     