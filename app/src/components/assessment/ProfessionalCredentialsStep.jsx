import { useState } from "react";
import {
  credentialStatusOptions,
  professionalCredentialTypes,
} from "../../data/professionalCredentialsConfig";
import { updateAssessmentProfessionalCredentials } from "../../services/assessmentService";

function ProfessionalCredentialsStep({ assessmentId, onComplete }) {
  const [hasRegulatedCredentials, setHasRegulatedCredentials] = useState("no");
  const [selectedCredentials, setSelectedCredentials] = useState({});
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

    if (value === "no" || value === "not_sure") {
      setSelectedCredentials({});
    }
  }

  function toggleCredential(typeId) {
    setStatus("idle");

    setSelectedCredentials((previous) => {
      if (previous[typeId]) {
        const updated = { ...previous };
        delete updated[typeId];
        return updated;
      }

      return {
        ...previous,
        [typeId]: {
          type: typeId,
          status:
            hasRegulatedCredentials === "in_progress"
              ? "in_progress"
              : "active",
          jurisdiction: "",
        },
      };
    });
  }

  function updateCredential(typeId, field, value) {
    setStatus("idle");

    setSelectedCredentials((previous) => ({
      ...previous,
      [typeId]: {
        ...previous[typeId],
        [field]: value,
      },
    }));
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
      <h2>Professional Credentials</h2>

      <p>
        Some career directions require a professional license or regulated
        credential. This helps Ortheon avoid recommending paths that may not be
        realistically accessible right now.
      </p>

      <label>
        Do you currently hold, or are you actively working toward, any regulated
        professional license, certification, or credential?
        <select
          value={hasRegulatedCredentials}
          onChange={(event) =>
            handleCredentialStatusChange(event.target.value)
          }
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
          <option value="in_progress">In progress</option>
          <option value="not_sure">Not sure</option>
        </select>
      </label>

      {shouldShowCredentialList && (
        <div>
          <p>
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
                  <div>
                    <label>
                      Status
                      <select
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
                    </label>

                    <label>
                      Jurisdiction
                      <input
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
                    </label>
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

      <button type="submit" disabled={status === "saving" || !canContinue}>
        {status === "saving" ? "Saving..." : "Save professional credentials"}
      </button>
    </form>
  );
}

export default ProfessionalCredentialsStep;
