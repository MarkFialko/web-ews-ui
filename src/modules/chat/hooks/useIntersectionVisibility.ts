import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Отслеживание появления элемента в области видимости (viewport) через IntersectionObserver.
 * Срабатывает один раз — как только элемент становится видимым, observer отключается.
 */
export const useIntersectionVisibility = <T extends HTMLElement>() => {
  const nodeRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, nodeRef]);

  const setRef = useCallback((node: T | null) => {
    nodeRef.current = node;
  }, []);

  return { isVisible, ref: setRef };
};
