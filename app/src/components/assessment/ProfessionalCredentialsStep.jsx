import { useState } from "react";
import {
  credentialStatusOptions,
  professionalCredentialTypes,
} from "../../data/professionalCredentialsConfig";
import { updateAssessmentProfessionalCredentials } from "../../services/assessmentService";

function ProfessionalCredentialsStep({ assessmentId, onComplete, onBack, values, onValuesChange }) {
  const [hasRegulatedCredentials, setHasRegulatedCredentials] = useState(values?.hasRegulatedCredentials ?? "no");
  const [selectedCredentials, setSelectedCredentials] = useState(values?.selectedCredentials ?? {});
  const [status, setStatus] = useState("idle");

  const shouldShowCredentialList =
    hasRegulatedCredentials === "yes" ||
    hasRegulatedCredentials === "in_progress";

  const credentials = Object.values(selectedCredentials);

  const hasSelectedCredential = credentials.length > 0;

  const hasMissingJurisdiction = credentials.some(
    (credential) => !credential.jurisdiction.trim()
  );

  const canContinue =
    !shouldShowCredentialList ||
    (hasSelectedCredential && !hasMissingJurisdiction);

  function handleCredentialStatusChange(value) {
    setStatus("idle");
    setHasRegulatedCredentials(value);

    const newSelected = value === "no" || value === "not_sure" ? {} : selectedCredentials;
    if (value === "no" || value === "not_sure") {
      setSelectedCredentials(newSelected);
    }
    onValuesChange?.({ hasRegulatedCredentials: value, selectedCredentials: newSelected });
  }

  function toggleCredential(typeId) {
    setStatus("idle");

    let newSelected;
    if (selectedCredentials[typeId]) {
      newSelected = { ...selectedCredentials };
      delete newSelected[typeId];
    } else {
      newSelected = {
        ...selectedCredentials,
        [typeId]: {
          type: typeId,
          status: hasRegulatedCredentials === "in_progress" ? "in_progress" : "active",
          jurisdiction: "",
        },
      };
    }
    setSelectedCredentials(newSelected);
    onValuesChange?.({ hasRegulatedCredentials, selectedCredentials: newSelected });
  }

  function updateCredential(typeId, field, value) {
    setStatus("idle");

    const newSelected = {
      ...selectedCredentials,
      [typeId]: { ...selectedCredentials[typeId], [field]: value },
    };
    setSelectedCredentials(newSelected);
    onValuesChange?.({ hasRegulatedCredentials, selectedCredentials: newSelected });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!assessmentId) {
      setStatus("missing_assessment");
      return;
    }

    if (!canContinue) {
      setStatus("invalid");
      return;
    }

    try {
      setStatus("saving");

      await updateAssessmentProfessionalCredentials(assessmentId, {
        hasRegulatedCredentials,
        credentials,
      });

      setStatus("success");
      onComplete();
    } catch (error) {
      console.error("Professional credentials save failed:", error);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {onBack && (
        <button type="button" className="step-back-button" onClick={onBack}>
          ← Back
        </button>
      )}

      <h2>Professional Credentials</h2>

      <p>
        Some career directions require a professional license or regulated
        credential. This helps Ortheon avoid recommending paths that may not be
        realistically accessible right now.
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="credentialStatus">
          Do you currently hold, or are you actively working toward, any regulated
          professional license, certification, or credential?
        </label>
        <select
          id="credentialStatus"
          className="form-select"
          value={hasRegulatedCredentials}
          onChange={(event) => handleCredentialStatusChange(event.target.value)}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
          <option value="in_progress">In progress</option>
          <option value="not_sure">Not sure</option>
        </select>
      </div>

      {shouldShowCredentialList && (
        <div className="form-group">
          <p className="form-hint">
            Select any credentials that apply. Add the jurisdiction where each
            credential is active or being pursued.
          </p>

          {professionalCredentialTypes.map((credentialType) => {
            const selected = selectedCredentials[credentialType.id];

            return (
              <div key={credentialType.id} className="weight-control">
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(selected)}
                    onChange={() => toggleCredential(credentialType.id)}
                  />{" "}
                  <strong>{credentialType.label}</strong>
                </label>

                <p className="helper-text">{credentialType.description}</p>

                {selected && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={selected.status}
                        onChange={(event) =>
                          updateCredential(
                            credentialType.id,
                            "status",
                            event.target.value
                          )
                        }
                      >
                        {credentialStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jurisdiction</label>
                      <input
                        className="form-input"
                        type="text"
                        value={selected.jurisdiction}
                        placeholder="Example: NY, CA, United States, Georgia"
                        onChange={(event) =>
                          updateCredential(
                            credentialType.id,
                            "jurisdiction",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {status === "invalid" && (
        <p className="status warning">
          Please select at least one credential and add jurisdiction for each
          selected credential.
        </p>
      )}

      {status === "missing_assessment" && (
        <p className="status error">
          Missing assessment ID. Please complete Basic Context first.
        </p>
      )}

      {status === "error" && (
        <p className="status error">
          Something went wrong while saving professional credentials.
        </p>
      )}

      <div className="action-row">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "saving" || !canContinue}
        >
          {status === "saving" ? "Saving..." : "Save professional credentials"}
        </button>
      </div>
    </form>
  );
}

export default ProfessionalCredentialsStep;
