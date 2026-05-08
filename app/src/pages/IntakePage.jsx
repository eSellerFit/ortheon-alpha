import { useState } from "react";
import { createAssessmentDraft } from "../services/assessmentService";

const initialFormData = {
  firstName: "",
  email: "",
  currentRole: "",
  currentSituation: "",
  minimumMonthlyIncome: "",
};

function IntakePage() {
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState("idle");
  const [assessmentId, setAssessmentId] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.firstName ||
      !formData.email ||
      !formData.currentRole ||
      !formData.currentSituation ||
      !formData.minimumMonthlyIncome
    ) {
      setStatus("missing_fields");
      return;
    }

    try {
      setStatus("saving");
      const newAssessmentId = await createAssessmentDraft(formData);
      setAssessmentId(newAssessmentId);
      setStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Assessment save failed:", error);
      setStatus("error");
    }
  }

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">Ortheon Alpha</p>

        <h1>Start your career direction assessment</h1>

        <p className="intro">
          This first step captures basic context before we move into career anchors,
          CV analysis, financial reality, and direction scoring.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            First name
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="George"
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Current or most recent role
            <input
              name="currentRole"
              value={formData.currentRole}
              onChange={handleChange}
              placeholder="HR Director, Product Manager, Founder..."
            />
          </label>

          <label>
            Current situation
            <select
              name="currentSituation"
              value={formData.currentSituation}
              onChange={handleChange}
            >
              <option value="">Select one</option>
              <option value="employed_exploring">Employed, but exploring options</option>
              <option value="recently_laid_off">Recently laid off / in transition</option>
              <option value="career_change">Considering a career change</option>
              <option value="returning_to_work">Returning to work</option>
              <option value="building_portfolio">Building portfolio / independent path</option>
            </select>
          </label>

          <label>
            Minimum monthly income needed
            <input
              name="minimumMonthlyIncome"
              type="number"
              min="0"
              value={formData.minimumMonthlyIncome}
              onChange={handleChange}
              placeholder="6000"
            />
          </label>

          <button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Saving..." : "Save intake"}
          </button>
        </form>

        {status === "missing_fields" && (
          <p className="status warning">Please complete all fields.</p>
        )}

        {status === "success" && (
          <p className="status success">
            Intake saved. Assessment ID: {assessmentId}
          </p>
        )}

        {status === "error" && (
          <p className="status error">
            Something went wrong while saving. Check the console and Firestore rules.
          </p>
        )}
      </section>
    </main>
  );
}

export default IntakePage;
