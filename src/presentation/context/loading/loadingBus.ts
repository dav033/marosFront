// src/presentation/context/loading/loadingBus.ts
import type { SkeletonOptions } from "@/types/contexts/loading";

type Actions = {
  showLoading: (type?: string, opts?: SkeletonOptions) => void;
  hideLoading: () => void;
  setSkeleton: (type: string, opts?: SkeletonOptions) => void;
};

let actionsRef: Actions | null = null;

export function mountLoadingActions(actions: Actions) {
  actionsRef = actions;
}

export function unmountLoadingActions() {
  actionsRef = null;
}

export const loadingBus = {
  set(type: string, opts?: SkeletonOptions) {
    actionsRef?.setSkeleton(type, opts);
  },
  show(type?: string, opts?: SkeletonOptions) {
    actionsRef?.showLoading(type, opts);
  },
  hide() {
    actionsRef?.hideLoading();
  },
};
