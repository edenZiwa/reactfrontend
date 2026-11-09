import { useCallback, useEffect, useState } from "react";

function normalizePath(pathname) {
  const path = String(pathname || "/").replace(/\/+$/, "");
  return path || "/";
}

export default function usePath() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [navigation, setNavigation] = useState(() => ({
    id: 0,
    type: "INITIAL",
    hash: window.location.hash,
    scrollY: window.history.state?.scrollY ?? 0,
  }));

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const update = () => {
      setPath(normalizePath(window.location.pathname));
      setNavigation((current) => ({
        id: current.id + 1,
        type: "POP",
        hash: window.location.hash,
        scrollY: window.history.state?.scrollY ?? 0,
      }));
    };

    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("popstate", update);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  const navigate = useCallback((next) => {
    if (typeof next !== "string" || !next.trim() || next.startsWith("#")) return;

    let target;
    try {
      target = new URL(next, window.location.origin);
    } catch {
      return;
    }

    if (!["http:", "https:"].includes(target.protocol)) return;
    if (target.origin !== window.location.origin) {
      window.location.assign(target.href);
      return;
    }

    const currentState = window.history.state && typeof window.history.state === "object"
      ? window.history.state
      : {};
    window.history.replaceState(
      { ...currentState, scrollY: window.scrollY },
      "",
      window.location.href
    );

    const nextPath = normalizePath(target.pathname);
    window.history.pushState({ scrollY: 0 }, "", \`\${nextPath}\${target.search}\${target.hash}\`);
    setPath(nextPath);
    setNavigation((current) => ({
      id: current.id + 1,
      type: "PUSH",
      hash: target.hash,
      scrollY: 0,
    }));
  }, []);

  return [path, navigate, navigation];
}
