import { useEffect, useState } from "react";

const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

export function navigate(to: string, replace = false) {
  history[replace ? "replaceState" : "pushState"](null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export function usePath() {
  const [path, setPath] = useState(() => clean(location.pathname));
  useEffect(() => {
    const sync = () => {
      const next = clean(location.pathname);
      // The landing page and the site use separate stylesheets, so crossing between them is a full load.
      if ((next === "/") !== (path === "/")) return location.reload();
      setPath(next);
    };
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || /\.\w+$/.test(u.pathname) || (u.pathname === location.pathname && u.hash)) return;
      e.preventDefault();
      navigate(u.pathname + u.search + u.hash);
    };
    window.addEventListener("popstate", sync);
    document.addEventListener("click", click);
    return () => { window.removeEventListener("popstate", sync); document.removeEventListener("click", click); };
  }, [path]);
  return path;
}
