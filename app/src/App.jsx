import AssessmentFlow from "./pages/AssessmentFlow";
import CareerMapPreview from "./components/assessment/CareerMapPreview";
import OrtheonLandingPage from "./OrtheonLandingPage";
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

  return <OrtheonLandingPage />;
}

export default App;