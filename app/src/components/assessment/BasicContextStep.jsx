import { useState } from "react";
import { createAssessmentDraft } from "../../services/assessmentService";

const initialBasicData = {
  firstName: "",
  email: "",
  currentRole: "",
  currentSituation: "",
};

const chips = [
  "5–7 minutes",
  "CV optional",
  "Immediate report",
  "Free alpha",
];

const previewDirections = [
  { n: "1", label: "Business Operations / Delivery Leadership", meta: "Direct path · AI durability D3", tag: "Direct", primary: true },
  { n: "2", label: "Digital Operations / Automation Enablement", meta: "Adjacent path · AI durability D3", tag: "Adjacent", primary: false },
  { n: "3", label: "Independent Operations Advisory", meta: "Bridge-based path · AI durability D2/D3", tag: "Bridge", primary: false },
];

function BasicContextStep({ onComplete, values, onValuesChange }) {
  const [basicData, setBasicData] = useState(values ?? initialBasicData);
  const [status, setStatus] = useState("idle");

  function handleChange(event) {
    const { name, value } = event.target;
    const updated = { ...basicData, [name]: value };
    setBasicData(updated);
    onValuesChange?.(updated);
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
      onComplete({ assessmentId: newAssessmentId, basicData });
    } catch (error) {
      console.error("Basic context save failed:", error);
      setStatus("error");
    }
  }

  return (
    <>
      <style>{`
        .bc-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        /* ── Left intro panel ── */
        .bc-intro {
          background: #EAF6F7;
          border: 1px solid #D8E2E4;
          border-radius: 16px;
          padding: 28px 24px 24px;
        }

        .bc-step-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #155E75;
          margin: 0 0 14px;
        }

        .bc-headline {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          line-height: 1.28;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }

        .bc-body {
          font-size: 14px;
          color: #64748B;
          line-height: 1.65;
          margin: 0 0 22px;
        }

        /* Reassurance chips */
        .bc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .bc-chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          background: #ffffff;
          border: 1px solid #D8E2E4;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #155E75;
        }

        /* Sample report preview */
        .bc-preview-card {
          border: 1px solid #D8E2E4;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 4px 18px rgba(15, 63, 74, 0.09);
          overflow: hidden;
        }

        .bc-preview-inner {
          padding: 16px;
        }

        .bc-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .bc-preview-eyebrow {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #155E75;
        }

        .bc-preview-pill {
          font-size: 10px;
          font-weight: 700;
          background: #EAF6F7;
          color: #155E75;
          padding: 3px 9px;
          border-radius: 999px;
        }

        .bc-preview-rows {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 12px;
        }

        .bc-preview-row {
          display: grid;
          grid-template-columns: 24px 1fr auto;
          gap: 9px;
          align-items: center;
          padding: 9px 11px;
          background: #F7F4EF;
          border-radius: 9px;
          border: 1px solid #EAE4DC;
        }

        .bc-preview-num {
          display: inline-flex;
          width: 22px;
          height: 22px;
          align-items: center;
          justify-content: center;
          background: #155E75;
          color: #ffffff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .bc-preview-row-title {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #111827;
          line-height: 1.3;
        }

        .bc-preview-row-meta {
          display: block;
          font-size: 11px;
          color: #64748B;
          margin-top: 1px;
        }

        .bc-preview-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .bc-preview-tag-primary {
          background: #EAF6F7;
          color: #155E75;
        }

        .bc-preview-tag-secondary {
          background: #F1F5F9;
          color: #64748B;
        }

        .bc-preview-signals {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .bc-preview-signal {
          padding: 8px 9px;
          background: #F7F4EF;
          border: 1px solid #EAE4DC;
          border-radius: 8px;
        }

        .bc-preview-signal-label {
          display: block;
          font-size: 9px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 3px;
        }

        .bc-preview-signal-value {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #111827;
        }

        .bc-preview-caption {
          font-size: 12px;
          color: #64748B;
          margin: 10px 0 4px;
        }

        .bc-preview-link {
          font-size: 13px;
          font-weight: 600;
          color: #155E75;
          text-decoration: none;
        }

        .bc-preview-link:hover {
          text-decoration: underline;
        }

        /* ── Form side ── */
        .bc-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .bc-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .bc-label {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .bc-input,
        .bc-select {
          padding: 10px 14px;
          font-size: 15px;
          font-family: inherit;
          background: #ffffff;
          border: 1px solid #D8E2E4;
          border-radius: 10px;
          color: #111827;
          width: 100%;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .bc-input::placeholder {
          color: #94A3B8;
        }

        .bc-input:focus,
        .bc-select:focus {
          outline: none;
          border-color: #155E75;
          box-shadow: 0 0 0 3px rgba(21, 94, 117, 0.1);
        }

        .bc-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 13px 24px;
          background: #155E75;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
          margin-top: 4px;
        }

        .bc-submit:hover:not(:disabled) {
          background: #0F3F4A;
          box-shadow: 0 4px 14px rgba(15, 63, 74, 0.22);
        }

        .bc-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .bc-status {
          font-size: 14px;
          padding: 10px 14px;
          border-radius: 8px;
          margin: 0;
          line-height: 1.5;
        }

        .bc-status-warn {
          background: #FFFBEB;
          color: #92400E;
          border: 1px solid #FDE68A;
        }

        .bc-status-error {
          background: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        @media (max-width: 768px) {
          .bc-layout {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
      `}</style>

      <div className="bc-layout">
        {/* ── Left: intro panel ── */}
        <div className="bc-intro">
          <p className="bc-step-label">Step 1 of 8</p>
          <h2 className="bc-headline">Let's understand your career direction</h2>
          <p className="bc-body">
            In 5–7 minutes, Ortheon will build a first Career Direction Report based on your background, priorities, constraints, financial reality, and CV signals.
          </p>
          <p className="bc-body">
            CV is optional. You can upload it, paste text, or continue without it later in the flow.
          </p>

          <div className="bc-chips">
            {chips.map((chip) => (
              <span className="bc-chip" key={chip}>{chip}</span>
            ))}
          </div>

          <div className="bc-preview-card">
            <div className="bc-preview-inner">
              <div className="bc-preview-header">
                <span className="bc-preview-eyebrow">Career Direction Report</span>
                <span className="bc-preview-pill">Sample</span>
              </div>

              <div className="bc-preview-rows">
                {previewDirections.map((dir) => (
                  <div className="bc-preview-row" key={dir.n}>
                    <span className="bc-preview-num">{dir.n}</span>
                    <div>
                      <strong className="bc-preview-row-title">{dir.label}</strong>
                      <span className="bc-preview-row-meta">{dir.meta}</span>
                    </div>
                    <span className={`bc-preview-tag ${dir.primary ? "bc-preview-tag-primary" : "bc-preview-tag-secondary"}`}>
                      {dir.tag}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bc-preview-signals">
                <div className="bc-preview-signal">
                  <span className="bc-preview-signal-label">Credibility</span>
                  <span className="bc-preview-signal-value">Evidence-backed</span>
                </div>
                <div className="bc-preview-signal">
                  <span className="bc-preview-signal-label">Financial</span>
                  <span className="bc-preview-signal-value">Viable</span>
                </div>
                <div className="bc-preview-signal">
                  <span className="bc-preview-signal-label">AI durability</span>
                  <span className="bc-preview-signal-value">D3</span>
                </div>
              </div>
            </div>
          </div>

          <p className="bc-preview-caption">Sample report · fictional profile</p>
          <a
            className="bc-preview-link"
            href="/sample-career-direction-report.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View sample report →
          </a>
        </div>

        {/* ── Right: form ── */}
        <div>
          <form onSubmit={handleSubmit} className="bc-form">
            <div className="bc-form-group">
              <label className="bc-label" htmlFor="firstName">First name</label>
              <input
                id="firstName"
                className="bc-input"
                name="firstName"
                value={basicData.firstName}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>

            <div className="bc-form-group">
              <label className="bc-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="bc-input"
                name="email"
                type="email"
                value={basicData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="bc-form-group">
              <label className="bc-label" htmlFor="currentRole">Current or most recent role</label>
              <input
                id="currentRole"
                className="bc-input"
                name="currentRole"
                value={basicData.currentRole}
                onChange={handleChange}
                placeholder="e.g. Senior Operations Manager"
              />
            </div>

            <div className="bc-form-group">
              <label className="bc-label" htmlFor="currentSituation">Current situation</label>
              <select
                id="currentSituation"
                className="bc-select"
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
            </div>

            <button
              type="submit"
              className="bc-submit"
              disabled={status === "saving"}
            >
              {status === "saving" ? "Saving…" : "Continue to your career priorities →"}
            </button>

            {status === "missing_fields" && (
              <p className="bc-status bc-status-warn">Please complete all fields.</p>
            )}
            {status === "error" && (
              <p className="bc-status bc-status-error">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default BasicContextStep;
