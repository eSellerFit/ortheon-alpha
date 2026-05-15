import { useState } from "react";
import { updateAssessmentConstraints } from "../../services/assessmentService";

const initialConstraintsData = {
  locationConstraint: "",
  workAuthorizedUS: "",
  visaSponsorshipNeeded: "",
  weeklyTimeAvailable: "",
  retrainingWillingness: "",
};

function TransitionConstraintsStep({ assessmentId, onComplete, onBack, values, onValuesChange }) {
  const [constraintsData, setConstraintsData] = useState(values ?? initialConstraintsData);
  const [status, setStatus] = useState("idle");

  function handleChange(event) {
    const { name, value } = event.target;
    const updated = { ...constraintsData, [name]: value };
    setConstraintsData(updated);
    onValuesChange?.(updated);
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
      {onBack && (
        <button type="button" className="step-back-button" onClick={onBack}>
          ← Back
        </button>
      )}

      <h2>Transition Constraints</h2>

      <p>
        These questions help Ortheon understand which career directions are practical,
        not only attractive.
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="locationConstraint">Location constraint</label>
          <select
            id="locationConstraint"
            className="form-select"
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
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="workAuthorizedUS">
            Authorized to work in the U.S.?
          </label>
          <select
            id="workAuthorizedUS"
            className="form-select"
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
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="visaSponsorshipNeeded">
            Visa sponsorship required?
          </label>
          <select
            id="visaSponsorshipNeeded"
            className="form-select"
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
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="weeklyTimeAvailable">
            Weekly hours available for transition
          </label>
          <input
            id="weeklyTimeAvailable"
            className="form-input"
            name="weeklyTimeAvailable"
            type="number"
            min="0"
            value={constraintsData.weeklyTimeAvailable}
            onChange={handleChange}
            placeholder="10"
          />
          <p className="form-hint">
            Learning, applications, interviews, networking, or portfolio work.
          </p>
        </div>

        <div className="form-group full-width">
          <label className="form-label" htmlFor="retrainingWillingness">
            Willingness to retrain or learn new skills
          </label>
          <select
            id="retrainingWillingness"
            className="form-select"
            name="retrainingWillingness"
            value={constraintsData.retrainingWillingness}
            onChange={handleChange}
          >
            <option value="">Select one</option>
            <option value="yes">Yes</option>
            <option value="maybe">Maybe</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="action-row">
        <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save transition constraints"}
        </button>
      </div>

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
