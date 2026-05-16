import AssessmentFlow from "./pages/AssessmentFlow";
import CareerMapPreview from "./components/assessment/CareerMapPreview";
import OrtheonLandingPage from "./OrtheonLandingPage";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
import "./App.css";

function App() {
  const path = window.location.pathname;
  const hash = window.location.hash;

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