import AssessmentFlow from "./pages/AssessmentFlow";
import CareerMapPreview from "./components/assessment/CareerMapPreview";
import DirectionV14Debug from "./components/assessment/DirectionV14Debug";
import OrtheonLandingPage from "./OrtheonLandingPage";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
import "./App.css";

function App() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (
    path.includes("/debug/direction-v14") ||
    hash.includes("debug/direction-v14")
  ) {
    return <DirectionV14Debug />;
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
