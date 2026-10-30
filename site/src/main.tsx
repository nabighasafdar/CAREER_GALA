import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { usePath } from "./lib/router";
import SiteLayout from "./pages/SiteLayout";
import "./styles.css";

/** Pages inside the site layout: the navigation bar stays mounted while these change. */
const sitePages: Record<string, ReturnType<typeof lazy>> = {
  "/": lazy(() => import("./pages/Landing")),
  "/home": lazy(() => import("./pages/Home")),
  "/find-tutor": lazy(() => import("./pages/FindTutor")),
  "/counselling": lazy(() => import("./pages/Counselling")),
  "/become-tutor": lazy(() => import("./pages/BecomeTutor")),
  "/pricing": lazy(() => import("./pages/Pricing")),
};

/** Same navigation bar, but these bring their own <main> and have no footer. */
const barePages: Record<string, ReturnType<typeof lazy>> = {
  "/login": lazy(() => import("./pages/Login")),
  "/signup": lazy(() => import("./pages/Signup")),
  "/get-started": lazy(() => import("./pages/StudentInquiry")),
  "/subjects": lazy(() => import("./pages/Subjects")),
  "/tutor/profile": lazy(() => import("./pages/TutorProfile")),
};

const appPages: Record<string, ReturnType<typeof lazy>> = {
  "/student": lazy(() => import("./pages/StudentDashboard")),
  "/tutor": lazy(() => import("./pages/TutorDashboard")),
  "/tutor/onboarding": lazy(() => import("./pages/TutorOnboarding")),
  "/admin": lazy(() => import("./pages/AdminDashboard")),
};

function Root() {
  const path = usePath();
  const App = appPages[path];
  if (App) return <Suspense fallback={null}><App /></Suspense>;
  const bare = !!barePages[path];
  const current = bare || sitePages[path] ? path : "/home";
  const Page = barePages[current] ?? sitePages[current];
  return <SiteLayout path={current} bare={bare}><Suspense fallback={null}><Page /></Suspense></SiteLayout>;
}

createRoot(document.getElementById("root")!).render(<Root />);
