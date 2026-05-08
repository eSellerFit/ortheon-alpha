import { useState } from "react";
import { createAssessmentDraft } from "../../services/assessmentService";

const initialBasicData = {
  firstName: "",
  email: "",
  currentRole: "",
  currentSituation: "",
};

function BasicContextStep({ onComplete }) {
  const [basicData, setBasicData] = useState(initialBasicData);
  const [status, setStatus] = useState("idle");

  function handleChange(event) {
    const { name, value } = event.target;

    setBasicData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !basicData.firstName ||
      !basicData.email ||
      !basicData.currentRole ||
      !basicData.currentSituation
    ) {
      setStatus("missing_fields");
      return;
    }

    try {
      setStatus("saving");

      const newAssessmentId = await createAssessmentDraft(basicData);

      setStatus("success");

      onComplete({
        assessmentId: newAssessmentId,
        basicData,
      });
    } catch (error) {
      console.error("Basic context save failed:", error);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Basic Context</h2>

      <label>
        First name
        <input
          name="firstName"
          value={basicData.firstName}
          onChange={handleChange}
          placeholder="Name"
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={basicData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
      </label>

      <label>
        Current or most recent role
        <input
          name="currentRole"
          value={basicData.currentRole}
          onChange={handleChange}
          placeholder="Role"
        />
      </label>

      <label>
        Current situation
        <select
          name="currentSituation"
          value={basicData.currentSituation}
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

      <button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Continue to career anchors"}
      </button>

      {status === "missing_fields" && (
        <p className="status warning">Please complete all fields.</p>
      )}

      {status === "error" && (
        <p className="status error">
          Something went wrong while saving basic context.
        </p>
      )}
    </form>
  );
}

export default BasicContextStep;
