let initialized = false;
export function setupListeners(dispatch, internalActions) {
  function defaultHandler() {
    const handleFocus = () => dispatch(internalActions.onFocus());
    const handleFocusLost = () => dispatch(internalActions.onFocusLost());
    const handleOnline = () => dispatch(internalActions.onOnline());
    const handleOffline = () => dispatch(internalActions.onOffline());
    const handleVisibilityChange = () => {
      if (window.document.visibilityState === "visible") {
        handleFocus();
      } else {
        handleFocusLost();
      }
    };

    if (!initialized) {
      if (typeof window !== "undefined" && window.addEventListener) {
        // Handle focus events
        window.addEventListener(
          "visibilitychange",
          handleVisibilityChange,
          false
        );
        window.addEventListener("focus", handleFocus, false);

        // Handle connection events
        window.addEventListener("online", handleOnline, false);
        window.addEventListener("offline", handleOffline, false);
        initialized = true;
      }
    }
    const unsubscribe = () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      initialized = false;
    };
    return unsubscribe;
  }

  return defaultHandler();
}
