import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { usePath } from "./lib/router";
import "./styles.css";

const pages: Record<string, ReturnType<typeof lazy>> = {
  "/login": lazy(() => import("./pages/Login")),
  "/signup": lazy(() => import("./pages/Signup")),
  "/student": lazy(() => import("./pages/StudentDashboard")),
  "/tutor": lazy(() => import("./pages/TutorDashboard")),
  "/tutor/onboarding": lazy(() => import("./pages/TutorOnboarding")),
  "/tutor/profile": lazy(() => import("./pages/TutorProfile")),
  "/subjects": lazy(() => import("./pages/Subjects")),
  "/get-started": lazy(() => import("./pages/StudentInquiry")),
};

function Root() {
  const path = usePath();
  const Page = pages[path];
  return Page ? <Suspense fallback={null}><Page /></Suspense> : <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);
