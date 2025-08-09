import { useEffect, useRef } from "react";

export function useIsMounted() {
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);
  return mountedRef;
}
