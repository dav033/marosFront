/**
 * Utility hooks types
 */

import type { VisibilityIntervalOptions } from "../index";

export interface UseVisibilityIntervalOptions extends VisibilityIntervalOptions {
  tick: () => void | Promise<void>;
}
