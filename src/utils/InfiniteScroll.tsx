import React, { useEffect, useRef } from "react";

// Tipagem
import { infiniteScrollPops } from "../models/types";

const InfiniteScroll = ({ fetchMore, loading }: infiniteScrollPops) => {
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
};

export default InfiniteScroll;
