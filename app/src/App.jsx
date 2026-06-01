import { lazy, Suspense } from "react";
import AssessmentFlow from "./pages/AssessmentFlow";
import OrtheonLandingPage from "./OrtheonLandingPage";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
import V31UserFacingReportPreview from "./v31/report/V31UserFacingReportPreview";
import "./App.css";

const CareerMapPreview = lazy(() => import("./components/assessment/CareerMapPreview"));
const DebugResultReplay = lazy(() => import("./pages/DebugResultReplay"));
const DirectionV14Debug = lazy(() => import("./components/assessment/DirectionV14Debug"));
const V31ResultDebugViewer = lazy(() => import("./v31/viewer/V31ResultDebugViewer"));
const FounderDocumentView = lazy(() => import("./pages/FounderDocumentView"));
const FounderInbox = lazy(() => import("./pages/FounderInbox"));
const FounderAnalytics = lazy(() => import("./pages/FounderAnalytics"));

function App() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (path === "/founder/analytics") {
    return <Suspense fallback={null}><FounderAnalytics /></Suspense>;
  }

  const founderDocMatch = path.match(/^\/founder\/([^/]+)$/);
  if (founderDocMatch) {
    return <Suspense fallback={null}><FounderDocumentView documentId={founderDocMatch[1]} /></Suspense>;
  }

  if (path === "/founder" || path.startsWith("/founder/")) {
    return <Suspense fallback={null}><FounderInbox /></Suspense>;
  }

  if (path.includes("/internal/v31-report") || path === "/report") {
    return <V31UserFacingReportPreview />;
  }

  if (path.includes("/internal/v31-result")) {
    return <Suspense fallback={null}><V31ResultDebugViewer /></Suspense>;
  }

  if (
    path.includes("/debug/direction-v14") ||
    hash.includes("debug/direction-v14")
  ) {
    return <Suspense fallback={null}><DirectionV14Debug /></Suspense>;
  }

  const debugResultMatch =
    path.match(/\/debug\/result\/([^/]+)/) ||
    hash.match(/debug\/result\/([^/]+)/);
  if (debugResultMatch) {
    return <Suspense fallback={null}><DebugResultReplay assessmentId={debugResultMatch[1]} /></Suspense>;
  }

  if (path.includes("/map-preview") || hash.includes("map-preview")) {
    return <Suspense fallback={null}><CareerMapPreview /></Suspense>;
  }

  if (path.includes("/assessment")) {
    return <AssessmentFlow />;
  }

  if (path.includes("/privacy")) {
    return <PrivacyPolicy />;
  }

  if (path.includes("/terms")) {
    return <TermsOfUse />;
  }

  return <OrtheonLandingPage />;
}

export default App;
