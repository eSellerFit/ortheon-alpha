import { useState } from "react";
import { logEvent } from "../../utils/analyticsService";

const previewDirections = [
  { n: "1", label: "Business Operations / Delivery Leadership", meta: "Direct path · AI durability D3", tag: "Direct", primary: true },
  { n: "2", label: "Digital Operations / Automation Enablement", meta: "Adjacent path · AI durability D3", tag: "Adjacent", primary: false },
  { n: "3", label: "Independent Operations Advisory", meta: "Bridge-based path · AI durability D2/D3", tag: "Bridge", primary: false },
];

const chips = [
  "5–7 minutes",
  "CV optional",
  "Report in a few minutes",
  "No signup required",
];

export default function StartScreen({ onStart, status }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <style>{`
        .ss-hero {
          text-align: center;
          padding: 4px 0 28px;
          max-width: 580px;
          margin: 0 auto;
        }
        .ss-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #155E75;
          margin: 0 0 16px;
        }
        .ss-headline {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          line-height: 1.22;
          margin: 0 0 16px;
          letter-spacing: -0.03em;
        }
        .ss-subtext {
          font-size: 15px;
          color: #374151;
          line-height: 1.65;
          margin: 0 0 12px;
        }
        .ss-trust {
          font-size: 13px;
          color: #64748B;
          line-height: 1.6;
          margin: 0 0 24px;
        }
        .ss-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }
        .ss-chip {
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
        .ss-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          background: #155E75;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
          letter-spacing: -0.01em;
        }
        .ss-cta:hover:not(:disabled) {
          background: #0F3F4A;
          box-shadow: 0 6px 20px rgba(15, 63, 74, 0.25);
        }
        .ss-cta:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ss-secondary {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .ss-link {
          font-size: 13px;
          font-weight: 600;
          color: #155E75;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          padding: 0;
        }
        .ss-link:hover { text-decoration: underline; }
        .ss-error {
          font-size: 13px;
          color: #991B1B;
          margin-top: 12px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          padding: 8px 14px;
          border-radius: 8px;
        }
        .ss-divider {
          border: none;
          border-top: 1px solid #E2E8F0;
          margin: 28px 0;
        }
        .ss-preview-section {
          max-width: 520px;
          margin: 0 auto 24px;
        }
        .ss-preview-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #64748B;
          margin-bottom: 12px;
          text-align: center;
        }
        .ss-preview-card {
          border: 1px solid #D8E2E4;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 4px 18px rgba(15, 63, 74, 0.09);
          overflow: hidden;
        }
        .ss-preview-inner { padding: 16px; }
        .ss-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .ss-preview-eyebrow {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #155E75;
        }
        .ss-preview-pill {
          font-size: 10px;
          font-weight: 700;
          background: #EAF6F7;
          color: #155E75;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .ss-preview-rows {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .ss-preview-row {
          display: grid;
          grid-template-columns: 24px 1fr auto;
          gap: 9px;
          align-items: center;
          padding: 9px 11px;
          background: #F7F4EF;
          border-radius: 9px;
          border: 1px solid #EAE4DC;
        }
        .ss-preview-num {
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
        .ss-preview-row-title {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #111827;
          line-height: 1.3;
        }
        .ss-preview-row-meta {
          display: block;
          font-size: 11px;
          color: #64748B;
          margin-top: 1px;
        }
        .ss-preview-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .ss-preview-tag-primary { background: #EAF6F7; color: #155E75; }
        .ss-preview-tag-secondary { background: #F1F5F9; color: #64748B; }
        .ss-video-section {
          max-width: 520px;
          margin: 0 auto;
        }
        .ss-video-heading {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 10px;
          text-align: center;
        }
        .ss-walkthrough-video {
          width: 100%;
          display: block;
          border-radius: 10px;
          border: 1px solid #D8E2E4;
        }
        @media (max-width: 600px) {
          .ss-headline { font-size: 22px; }
          .ss-cta { font-size: 15px; padding: 13px 24px; }
        }
      `}</style>

      <div className="ss-hero">
        <p className="ss-eyebrow">Ortheon Alpha · Career Direction Report</p>
        <h1 className="ss-headline">
          Find out which career directions<br />are actually credible for you
        </h1>
        <p className="ss-subtext">
          In 5–7 minutes, Ortheon builds a first Career Direction Report based on your background, priorities, constraints, financial reality, CV signals, and AI durability.
        </p>
        <p className="ss-trust">
          No signup required. You can view and download your report at the end.<br />
          Leave your email only if you want a copy or a founder review.
        </p>

        <div className="ss-chips">
          {chips.map((chip) => (
            <span className="ss-chip" key={chip}>{chip}</span>
          ))}
        </div>

        <button
          className="ss-cta"
          onClick={onStart}
          disabled={status === "creating"}
        >
          {status === "creating" ? "Starting…" : "Start my Career Direction Review"}
        </button>

        <div className="ss-secondary">
          <a
            className="ss-link"
            href="/sample-career-direction-report.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View sample report
          </a>
          <button
            className="ss-link"
            onClick={() => {
              const next = !showVideo;
              setShowVideo(next);
              if (next) logEvent("assessment_intro_video_opened");
            }}
          >
            {showVideo ? "Hide walkthrough" : "Watch 45-second walkthrough"}
          </button>
        </div>

        {status === "error" && (
          <p className="ss-error">Something went wrong. Please try again.</p>
        )}
      </div>

      <hr className="ss-divider" />

      <div className="ss-preview-section">
        <p className="ss-preview-label">Sample Career Direction Report</p>
        <div className="ss-preview-card">
          <div className="ss-preview-inner">
            <div className="ss-preview-header">
              <span className="ss-preview-eyebrow">Career Direction Report</span>
              <span className="ss-preview-pill">Sample</span>
            </div>
            <div className="ss-preview-rows">
              {previewDirections.map((dir) => (
                <div className="ss-preview-row" key={dir.n}>
                  <span className="ss-preview-num">{dir.n}</span>
                  <div>
                    <strong className="ss-preview-row-title">{dir.label}</strong>
                    <span className="ss-preview-row-meta">{dir.meta}</span>
                  </div>
                  <span className={`ss-preview-tag ${dir.primary ? "ss-preview-tag-primary" : "ss-preview-tag-secondary"}`}>
                    {dir.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showVideo && (
        <>
          <hr className="ss-divider" />
          <div className="ss-video-section">
            <p className="ss-video-heading">45-second walkthrough</p>
            <video
              className="ss-walkthrough-video"
              src="/v/demo.mp4"
              controls
              playsInline
              preload="metadata"
              onPlay={() => logEvent("assessment_intro_video_played")}
              onEnded={() => logEvent("assessment_intro_video_ended")}
            />
          </div>
        </>
      )}
    </>
  );
}
