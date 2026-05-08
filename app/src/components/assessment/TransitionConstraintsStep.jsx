import { useState } from "react";
import { updateAssessmentConstraints } from "../../services/assessmentService";

const initialConstraintsData = {
  locationConstraint: "",
  workAuthorizedUS: "",
  visaSponsorshipNeeded: "",
  weeklyTimeAvailable: "",
  retrainingWillingness: "",
};

function TransitionConstraintsStep({ assessmentId, onComplete }) {
  const [constraintsData, setConstraintsData] = useState(initialConstraintsData);
  const [status, setStatus] = useState("idle");

  function handleChange(event) {
    const { name, value } = event.target;

    setConstraintsData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !assessmentId ||
      !constraintsData.locationConstraint ||
      !constraintsData.workAuthorizedUS ||
      !constraintsData.visaSponsorshipNeeded ||
      !constraintsData.weeklyTimeAvailable ||
      !constraintsData.retrainingWillingness
    ) {
      setStatus("missing_fields");
      return;
    }

    try {
      setStatus("saving");

      await updateAssessmentConstraints(assessmentId, constraintsData);

      setStatus("success");

      onComplete();
    } catch (error) {
      console.error("Transition constraints save failed:", error);
      setStatus("error");
    }
  }

  if (!assessmentId) {
    return (
      <div className="form">
        <p className="status error">
          Missing assessment ID. Please complete Basic Context first.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Transition Constraints</h2>

      <p>
        These questions help Ortheon understand which career directions are practical,
        not only attractive.
      </p>

      <label>
        Location constraint
        <select
          name="locationConstraint"
          value={constraintsData.locationConstraint}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          <option value="flexible">Flexible</option>
          <option value="city_only">Specific city only</option>
          <option value="region_only">Specific region only</option>
          <option value="fixed">Fixed location / cannot relocate</option>
        </select>
      </label>

      <label>
        Are you currently authorized to work in the U.S.?
        <select
          name="workAuthorizedUS"
          value={constraintsData.workAuthorizedUS}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="unclear">Not sure / unclear</option>
          <option value="not_applicable">Not applicable</option>
        </select>
      </label>

      <label>
        Will you require visa sponsorship now or in the future?
        <select
          name="visaSponsorshipNeeded"
          value={constraintsData.visaSponsorshipNeeded}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          <option value="no">No</option>
          <option value="yes_now">Yes, now</option>
          <option value="yes_future">Yes, in the future</option>
          <option value="unclear">Not sure / unclear</option>
          <option value="not_applicable">Not applicable</option>
        </select>
      </label>

      <label>
        Weekly time available for career transition activities, in hours
        <input
          name="weeklyTimeAvailable"
          type="number"
          min="0"
          value={constraintsData.weeklyTimeAvailable}
          onChange={handleChange}
          placeholder="10"
        />
      </label>

      <p className="helper-text">
        For example: learning, applications, interviews, networking, portfolio work,
        or certification preparation.
      </p>

      <label>
        Willingness to retrain or learn new skills
        <select
          name="retrainingWillingness"
          value={constraintsData.retrainingWillingness}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          <option value="yes">Yes</option>
          <option value="maybe">Maybe</option>
          <option value="no">No</option>
        </select>
      </label>

      <button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Save transition constraints"}
      </button>

      {status === "missing_fields" && (
        <p className="status warning">Please complete all transition constraint fields.</p>
      )}

      {status === "error" && (
        <p className="status error">
          Something went wrong while saving transition constraints.
        </p>
      )}

      {status === "success" && (
        <p className="status success">
          Transition constraints saved.
        </p>
      )}
    </form>
  );
}

export default TransitionConstraintsStep;
