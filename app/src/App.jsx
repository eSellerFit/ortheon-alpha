import AssessmentFlow from "./pages/AssessmentFlow";
import CareerMapPreview from "./components/assessment/CareerMapPreview";
import "./App.css";

function App() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (path.includes("/map-preview") || hash.includes("map-preview")) {
    return <CareerMapPreview />;
  }

  return <AssessmentFlow />;
}

export default App;