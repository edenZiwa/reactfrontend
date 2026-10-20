import { useCallback, useEffect, useState } from "react";

function normalizePath(pathname) {
  const path = String(pathname || "/").replace(/\/+$/, "");
  return path || "/";
}

export default function usePath() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const update = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  const navigate = useCallback((next) => {
    if (typeof next !== "string" || !next.trim() || next.startsWith("#")) return;
    const target = new URL(next, window.location.origin);
    if (target.origin !== window.location.origin) {
      window.location.assign(target.href);
      return;
    }
    const nextPath = normalizePath(target.pathname);
    window.history.pushState({}, "", `${nextPath}${target.search}${target.hash}`);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return [path, navigate];
}
