import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { usePath } from "./lib/router";

const Landing = lazy(() => import("./landing/Landing"));
const Site = lazy(() => import("./Site"));

function Root() {
  const path = usePath();
  return <Suspense fallback={null}>{path === "/" ? <Landing /> : <Site path={path} />}</Suspense>;
}

createRoot(document.getElementById("root")!).render(<Root />);
