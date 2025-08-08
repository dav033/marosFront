import React from "react";
import { render, act } from "@testing-library/react";
import CacheInitializer from "./CacheInitializer";

jest.useFakeTimers();

describe("CacheInitializer timers", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("cleans up intervals and timeouts on unmount", () => {
    const { unmount } = render(
      <CacheInitializer enabled debug autoPreload />
    );

    // Fast-forward timers to trigger setTimeout/setInterval
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Unmount component and check cleanup
    unmount();

    // All timers should be cleared
    expect(clearTimeout).toHaveBeenCalled();
    expect(clearInterval).toHaveBeenCalled();
  });
});
