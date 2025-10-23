
export interface VisibilityIntervalOptions {
  intervalMs?: number;
  leading?: boolean;
}

export interface UseVisibilityIntervalOptions extends VisibilityIntervalOptions {
  tick: () => void | Promise<void>;
}
