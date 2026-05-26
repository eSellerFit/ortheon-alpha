import AssessmentFlow from "./pages/AssessmentFlow";
import CareerMapPreview from "./components/assessment/CareerMapPreview";
import DebugResultReplay from "./pages/DebugResultReplay";
import DirectionV14Debug from "./components/assessment/DirectionV14Debug";
import OrtheonLandingPage from "./OrtheonLandingPage";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
import V31ResultDebugViewer from "./v31/viewer/V31ResultDebugViewer";
import V31UserFacingReportPreview from "./v31/report/V31UserFacingReportPreview";
import "./App.css";

function App() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (path.includes("/internal/v31-report")) {
    return <V31UserFacingReportPreview />;
  }

  if (path.includes("/internal/v31-result")) {
    return <V31ResultDebugViewer />;
  }

  if (
    path.includes("/debug/direction-v14") ||
    hash.includes("debug/direction-v14")
  ) {
    return <DirectionV14Debug />;
  }

  const debugResultMatch =
    path.match(/\/debug\/result\/([^/]+)/) ||
    hash.match(/debug\/result\/([^/]+)/);
  if (debugResultMatch) {
    return <DebugResultReplay assessmentId={debugResultMatch[1]} />;
  }

  if (path.includes("/map-preview") || hash.includes("map-preview")) {
    return <CareerMapPreview />;
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
