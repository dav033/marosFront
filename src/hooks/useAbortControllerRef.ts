import { useRef } from "react";

export function useAbortControllerRef() {
  const ref = useRef<AbortController | null>(null);

  const replace = () => {
    ref.current?.abort();
    ref.current = new AbortController();
    return ref.current;
  };

  const abort = () => {
    ref.current?.abort();
  };

  return {
    controllerRef: ref,
    replace,
    abort,
    get signal() { return ref.current?.signal; }
  };
}
