import { useEffect, useState } from "react";
import { logEvent } from "../../utils/analyticsService";

const chips = [
  "5–7 minutes",
  "CV optional",
  "Report in a few minutes",
  "No signup required",
];

const previewDirections = [
  { n: "1", label: "Business Operations / Delivery Leadership", meta: "Direct path · AI durability D3", tag: "Direct", primary: true },
  { n: "2", label: "Digital Operations / Automation Enablement", meta: "Adjacent path · AI durability D3", tag: "Adjacent", primary: false },
  { n: "3", label: "Independent Operations Advisory", meta: "Bridge-based path · AI durability D2/D3", tag: "Bridge", primary: false },
];

function BasicContextStep({ values, onValuesChange, onSubmit }) {
  const [basicData, setBasicData] = useState(values ?? { currentRole: "", currentSituation: "" });
  const [status, setStatus] = useState("idle"); // idle | missing_fields | submitting | error

  useEffect(() => {
    logEvent("basic_context_started");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e) {
    const updated = { ...basicData, [e.target.name]: e.target.value };
    setBasicData(updated);
    onValuesChange?.(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!basicData.currentRole?.trim() || !basicData.currentSituation) {
      setStatus("missing_fields");
      return;
    }
    setStatus("submitting");
    try {
      await onSubmit(basicData);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <style>{`
        .bc-hero {
          text-align: center;
          padding: 4px 0 24px;
          max-width: 640px;
          margin: 0 auto;
        }
        .bc-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #155E75;
          margin: 0 0 14px;
        }
        .bc-headline {
          font-size: 26px;
          font-weight: 800;
          color: #111827;
          line-height: 1.22;
          margin: 0 0 14px;
          letter-spacing: -0.03em;
        }
        .bc-subtext {
          font-size: 14px;
          color: #374151;
          line-height: 1.65;
          margin: 0 0 10px;
        }
        .bc-trust {
          font-size: 13px;
          color: #64748B;
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .bc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .bc-chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          background: #EAF6F7;
          border: 1px solid #D8E2E4;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #155E75;
        }

        /* ── Main two-column layout ── */
        .bc-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          align-items: start;
        }

        /* ── Form side ── */
        .bc-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
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
          box-sizing: border-box;
        }
        .bc-input::placeholder { color: #94A3B8; }
        .bc-input:focus, .bc-select:focus {
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

        /* ── Right: preview ── */
        .bc-preview-card {
          border: 1px solid #D8E2E4;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 4px 18px rgba(15, 63, 74, 0.09);
          overflow: hidden;
        }
        .bc-preview-inner { padding: 16px; }
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
        .bc-preview-tag-primary { background: #EAF6F7; color: #155E75; }
        .bc-preview-tag-secondary { background: #F1F5F9; color: #64748B; }
        .bc-preview-footer {
          padding: 10px 16px 12px;
          border-top: 1px solid #EAE4DC;
          background: #FAFAF8;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .bc-preview-caption {
          font-size: 12px;
          color: #64748B;
        }
        .bc-preview-link {
          font-size: 12px;
          font-weight: 600;
          color: #155E75;
          text-decoration: none;
        }
        .bc-preview-link:hover { text-decoration: underline; }

        /* ── Video row (full-width, centered) ── */
        .bc-video-row {
          margin-top: 28px;
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }
        .bc-video-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #64748B;
          margin: 0 0 10px;
          text-align: center;
        }
        .bc-walkthrough-video {
          width: 100%;
          display: block;
          border-radius: 10px;
          border: 1px solid #D8E2E4;
        }

        @media (max-width: 768px) {
          .bc-layout { grid-template-columns: 1fr; gap: 24px; }
          .bc-headline { font-size: 22px; }
          .bc-video-row { margin-top: 20px; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="bc-hero">
        <p className="bc-eyebrow">Ortheon Alpha · Career Direction Report</p>
        <h1 className="bc-headline">
          Find out which career directions<br />are actually credible for you
        </h1>
        <p className="bc-subtext">
          In 5–7 minutes, Ortheon builds a first Career Direction Report based on your background, priorities, constraints, financial reality, CV signals, and AI durability.
        </p>
        <p className="bc-trust">
          No signup required. You can view and download your report at the end.
        </p>
        <div className="bc-chips">
          {chips.map((chip) => (
            <span className="bc-chip" key={chip}>{chip}</span>
          ))}
        </div>
      </div>

      {/* ── Main two-column block ── */}
      <div className="bc-layout">

        {/* Left: form */}
        <div>
          <form onSubmit={handleSubmit} className="bc-form">
            <div className="bc-form-group">
              <label className="bc-label" htmlFor="currentRole">
                Current or most recent role
              </label>
              <input
                id="currentRole"
                className="bc-input"
                name="currentRole"
                value={basicData.currentRole}
                onChange={handleChange}
                placeholder="e.g. Senior Operations Manager"
                autoComplete="off"
              />
            </div>

            <div className="bc-form-group">
              <label className="bc-label" htmlFor="currentSituation">
                Current situation
              </label>
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
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Starting…" : "Start my Career Direction Review"}
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

        {/* Right: sample preview */}
        <div>
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
            </div>
            <div className="bc-preview-footer">
              <span className="bc-preview-caption">Sample report · fictional profile</span>
              <a
                className="bc-preview-link"
                href="/sample-career-direction-report.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View full sample →
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Video row: full-width, centered ── */}
      <div className="bc-video-row">
        <p className="bc-video-label">45-second walkthrough</p>
        <video
          className="bc-walkthrough-video"
          src="/v/demo.mp4"
          controls
          playsInline
          preload="metadata"
          onPlay={() => logEvent("assessment_intro_video_played")}
          onEnded={() => logEvent("assessment_intro_video_ended")}
        />
      </div>
    </>
  );
}

export default BasicContextStep;
