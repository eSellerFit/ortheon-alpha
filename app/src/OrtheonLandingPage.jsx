export default function OrtheonLandingPage() {
  const situations = [
    {
      icon: "01",
      headline: "You’re applying, but the market is not responding",
      text: "Automated hiring systems and narrow role filters make it harder to understand where your experience reads as a credible signal.",
      checks: "market credibility, evidence strength, direction fit.",
    },
    {
      icon: "02",
      headline: "Your experience is broad, but hard to position",
      text: "You have done a lot, but the market needs a clearer signal about what direction you fit now.",
      checks: "career spine, transferable evidence, positioning clarity.",
    },
    {
      icon: "03",
      headline: "You may need to look wider than the obvious next role",
      text: "The right direction may be adjacent, independent, credentialed, technical, or non-corporate — not just another version of your last role.",
      checks: "direct paths, adjacent paths, bridge paths, constraints.",
    },
    {
      icon: "04",
      headline: "You want a direction that can hold up as AI changes work",
      text: "The next move should not only be possible now. It should still make sense over the next few years.",
      checks: "AI durability, transition risk, future relevance.",
    },
  ];

  const problemQuestions = [
    "What do I want?",
    "Where will the market believe me?",
    "What can I financially afford?",
    "What paths are realistic under my constraints?",
    "Which directions are durable enough as AI changes work?",
  ];

  const howSteps = [
    {
      number: "1",
      title: "Upload your CV",
      text: "Ortheon extracts career evidence, domain signals, seniority, and transferable patterns.",
      signal: "Evidence intake",
    },
    {
      number: "2",
      title: "Answer a few reality-check questions",
      text: "You provide career anchors, financial floor, constraints, risk tolerance, and transition preferences.",
      signal: "Reality inputs",
    },
    {
      number: "3",
      title: "Get your Career Direction Report",
      text: "Ortheon shows market-credible directions, bridge paths, financial reality checks, AI durability, and practical next validation steps.",
      signal: "Direction report",
    },
  ];

  const directions = [
    {
      rank: "1",
      label: "Business Operations / Delivery Leadership",
      path: "Direct",
      credibility: "Credible now",
      durability: "D3",
      financial: "Viable",
    },
    {
      rank: "2",
      label: "Digital Operations / Automation Enablement",
      path: "Adjacent",
      credibility: "Evidence-backed",
      durability: "D3",
      financial: "Bridge-aware",
    },
    {
      rank: "3",
      label: "Independent Operations Advisory",
      path: "Bridge-based",
      credibility: "Needs positioning",
      durability: "D4",
      financial: "Runway-sensitive",
    },
  ];

  const reportSignals = [
    ["Fit band", "Strong Fit"],
    ["AI durability", "D3 — Durable"],
    ["Transition pathway", "Direct"],
    ["Estimated first-year income", "Viable with current floor"],
    ["BLS benchmark", "Operations Managers"],
    ["AI evolution path", "Automation-literate delivery leadership"],
  ];

  const reportSections = [
    "Career Direction Report",
    "Your Career Directions",
    "Ranked directions",
    "Key Signals",
    "Recommended Directions",
    "Nearby Trajectories",
    "What Drove These Results",
  ];

  const lenses = [
    "Market credibility",
    "Experience evidence",
    "Career anchors",
    "Financial reality",
    "Practical constraints",
    "Credentials / gates",
    "AI durability",
    "Direction calibration",
  ];

  return (
    <main className="landing-page">
      <style>{`
        .landing-page {
          min-height: 100vh;
          background: #f4efe6;
          color: #172330;
          font-family: "Helvetica Neue", Arial, sans-serif;
        }

        .lp-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 32px;
          padding-right: 32px;
        }

        .lp-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 82% 12%, rgba(47, 154, 168, 0.16), rgba(47, 154, 168, 0) 34%),
            linear-gradient(135deg, #172330 0%, #1d2b39 58%, #172330 100%);
          color: #fff8ea;
        }

        .lp-nav {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 24px;
          padding-bottom: 24px;
        }

        .lp-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .lp-brand img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          flex: 0 0 auto;
        }

        .lp-brand span {
          color: #fff8ea;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .lp-nav-cta,
        .lp-button,
        .lp-final-cta,
        .lp-feedback-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-weight: 800;
          line-height: 1.2;
          text-decoration: none;
          white-space: nowrap;
        }

        .lp-nav-cta {
          border: 1px solid rgba(248, 241, 227, 0.28);
          background: rgba(248, 241, 227, 0.1);
          color: #fff8ea;
          padding: 10px 18px;
          font-size: 14px;
        }

        .lp-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(420px, 1.05fr);
          gap: 56px;
          align-items: center;
          padding-top: 48px;
          padding-bottom: 92px;
        }

        .lp-kicker,
        .lp-eyebrow,
        .lp-report-label {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 22px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .lp-kicker {
          border: 1px solid rgba(248, 241, 227, 0.2);
          border-radius: 999px;
          background: rgba(248, 241, 227, 0.08);
          color: rgba(248, 241, 227, 0.84);
          padding: 8px 14px;
        }

        .lp-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2f9aa8;
          box-shadow: 0 0 0 5px rgba(47, 154, 168, 0.16);
          flex: 0 0 auto;
        }

        .lp-hero h1 {
          max-width: 780px;
          margin: 0 0 28px;
          color: #fff9ed;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 1.02;
        }

        .lp-hero h1 em {
          color: #7fd2dc;
          font-style: italic;
        }

        .lp-hero-sub {
          max-width: 680px;
          margin: 0 0 34px;
          color: rgba(248, 241, 227, 0.82);
          font-size: 19px;
          line-height: 1.65;
        }

        .lp-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .lp-button {
          min-height: 56px;
          border: 1px solid transparent;
          padding: 17px 28px;
          font-size: 15px;
          letter-spacing: -0.01em;
        }

        .lp-button.primary {
          border-color: rgba(127, 210, 220, 0.46);
          background: #2f9aa8;
          color: #061c22;
          box-shadow: 0 18px 42px rgba(47, 154, 168, 0.24);
        }

        .lp-button.secondary {
          border-color: rgba(248, 241, 227, 0.36);
          background: rgba(248, 241, 227, 0.08);
          color: #fff8ea;
        }

        .lp-trust {
          max-width: 620px;
          margin: 18px 0 0;
          color: rgba(248, 241, 227, 0.66);
          font-size: 14px;
          line-height: 1.55;
        }

        .lp-artifact-shell {
          border: 1px solid rgba(248, 241, 227, 0.16);
          border-radius: 28px;
          background: rgba(248, 241, 227, 0.08);
          padding: 10px;
          box-shadow: 0 36px 90px rgba(0, 0, 0, 0.32);
        }

        .lp-artifact {
          border-radius: 21px;
          background: #fff8ea;
          color: #172330;
          padding: 24px;
        }

        .lp-artifact-top,
        .lp-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .lp-report-label {
          margin-bottom: 7px;
          color: #245f68;
          font-size: 11px;
        }

        .lp-artifact-title {
          margin: 0;
          color: #172330;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 25px;
          font-weight: 400;
          letter-spacing: -0.02em;
        }

        .lp-artifact-pill {
          flex: 0 0 auto;
          border-radius: 999px;
          background: #dff3f4;
          color: #145460;
          padding: 7px 11px;
          font-size: 11px;
          font-weight: 900;
        }

        .lp-map {
          position: relative;
          display: grid;
          gap: 14px;
          margin-top: 22px;
          border: 1px solid #d9cfbd;
          border-radius: 18px;
          background: #ffffff;
          padding: 18px;
        }

        .lp-current {
          position: relative;
          width: fit-content;
          border: 1px solid #245f68;
          border-radius: 14px;
          background: #eef7f7;
          padding: 12px 16px;
        }

        .lp-current span,
        .lp-path-meta span,
        .lp-signal-card span,
        .lp-sample-field span {
          display: block;
          margin-bottom: 4px;
          color: #687280;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .lp-current strong {
          color: #172330;
          font-size: 14px;
        }

        .lp-path-stack {
          display: grid;
          gap: 10px;
        }

        .lp-path {
          position: relative;
          display: grid;
          grid-template-columns: 42px 1fr auto;
          gap: 12px;
          align-items: center;
          border: 1px solid #e0d6c8;
          border-radius: 15px;
          background: #fffaf1;
          padding: 13px;
        }

        .lp-path::before {
          content: "";
          position: absolute;
          left: 32px;
          top: -11px;
          width: 2px;
          height: 11px;
          background: #a9c7ca;
        }

        .lp-path:first-child::before {
          display: none;
        }

        .lp-path-node {
          display: inline-flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #172330;
          color: #fff8ea;
          font-size: 12px;
          font-weight: 900;
        }

        .lp-path-title strong {
          display: block;
          color: #172330;
          font-size: 14px;
          line-height: 1.28;
        }

        .lp-path-title span {
          display: block;
          margin-top: 4px;
          color: #566170;
          font-size: 12px;
        }

        .lp-path-meta {
          border-radius: 12px;
          background: #eef7f7;
          padding: 9px 10px;
          text-align: right;
        }

        .lp-path-meta strong,
        .lp-signal-card strong,
        .lp-sample-field strong {
          display: block;
          color: #172330;
          font-size: 12px;
          line-height: 1.25;
        }

        .lp-signal-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-top: 14px;
        }

        .lp-signal-card {
          border: 1px solid #e0d6c8;
          border-radius: 12px;
          background: #ffffff;
          padding: 10px;
        }

        .lp-section {
          padding: 84px 0;
        }

        .lp-section.light {
          background: #fffaf1;
        }

        .lp-section.warm {
          background: #f4efe6;
        }

        .lp-section.ink {
          background: #223241;
          color: #fff8ea;
        }

        .lp-section.navy {
          background: #172330;
          color: #fff8ea;
        }

        .lp-section-head {
          max-width: 720px;
          margin-bottom: 44px;
        }

        .lp-section-head.center {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .lp-eyebrow {
          margin-bottom: 14px;
          color: #245f68;
          font-size: 13px;
        }

        .lp-section.ink .lp-eyebrow,
        .lp-section.navy .lp-eyebrow {
          color: #7fd2dc;
        }

        .lp-section h2 {
          margin: 0 0 16px;
          color: #172330;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 42px;
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.13;
        }

        .lp-section.ink h2,
        .lp-section.navy h2 {
          color: #fff8ea;
        }

        .lp-copy {
          margin: 0;
          color: #526071;
          font-size: 17px;
          line-height: 1.7;
        }

        .lp-section.ink .lp-copy,
        .lp-section.navy .lp-copy {
          color: rgba(248, 241, 227, 0.72);
        }

        .lp-icp-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .lp-icp-card {
          border: 1px solid #cbd8dc;
          border-radius: 20px;
          background: #ffffff;
          padding: 22px;
          box-shadow: 0 16px 34px rgba(23, 35, 48, 0.06);
        }

        .lp-icp-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .lp-icon {
          display: inline-flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #172330;
          color: #fff8ea;
          font-size: 12px;
          font-weight: 900;
        }

        .lp-mini-line {
          position: relative;
          width: 72px;
          height: 18px;
        }

        .lp-mini-line::before {
          content: "";
          position: absolute;
          left: 5px;
          right: 5px;
          top: 8px;
          height: 2px;
          background: #9fc7ca;
        }

        .lp-mini-line i {
          position: absolute;
          top: 4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #2f9aa8;
        }

        .lp-mini-line i:nth-child(1) {
          left: 0;
        }

        .lp-mini-line i:nth-child(2) {
          left: 30px;
          background: #b7791f;
        }

        .lp-mini-line i:nth-child(3) {
          right: 0;
          background: #172330;
        }

        .lp-icp-card h3 {
          margin: 0 0 10px;
          color: #172330;
          font-size: 18px;
          line-height: 1.28;
        }

        .lp-icp-card p {
          margin: 0;
          color: #526071;
          font-size: 14px;
          line-height: 1.62;
        }

        .lp-checks {
          margin-top: 16px;
          border-left: 3px solid #2f9aa8;
          padding-left: 12px;
          color: #223241;
          font-size: 13px;
          line-height: 1.5;
        }

        .lp-checks strong {
          color: #245f68;
        }

        .lp-question-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .lp-question-card {
          border: 1px solid rgba(248, 241, 227, 0.16);
          border-radius: 18px;
          background: rgba(248, 241, 227, 0.06);
          padding: 22px;
        }

        .lp-question-card span {
          display: inline-flex;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          border-radius: 10px;
          background: rgba(47, 154, 168, 0.18);
          color: #7fd2dc;
          font-size: 12px;
          font-weight: 900;
        }

        .lp-question-card h3 {
          margin: 0;
          color: #fff8ea;
          font-size: 16px;
          line-height: 1.3;
        }

        .lp-product-grid,
        .lp-sample-grid,
        .lp-founder-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 56px;
          align-items: center;
        }

        .lp-product-panel,
        .lp-sample-panel {
          border: 1px solid rgba(248, 241, 227, 0.16);
          border-radius: 28px;
          background: rgba(248, 241, 227, 0.08);
          padding: 10px;
        }

        .lp-product-map,
        .lp-sample-report {
          border-radius: 21px;
          background: #fff8ea;
          color: #172330;
          padding: 24px;
        }

        .lp-map-grid {
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 18px;
          align-items: center;
        }

        .lp-map-origin {
          border: 1px solid #245f68;
          border-radius: 18px;
          background: #eef7f7;
          padding: 18px;
        }

        .lp-map-origin span {
          display: block;
          margin-bottom: 5px;
          color: #245f68;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .lp-map-origin strong {
          color: #172330;
          font-size: 17px;
          line-height: 1.25;
        }

        .lp-map-paths {
          display: grid;
          gap: 10px;
        }

        .lp-map-path {
          border: 1px solid #dfd4c4;
          border-left: 5px solid #2f9aa8;
          border-radius: 14px;
          background: #ffffff;
          padding: 13px;
        }

        .lp-map-path.bridge {
          border-left-color: #b7791f;
        }

        .lp-map-path.conditional {
          border-left-color: #6f7f96;
        }

        .lp-map-path strong {
          display: block;
          color: #172330;
          font-size: 14px;
          line-height: 1.3;
        }

        .lp-map-path span {
          display: block;
          margin-top: 5px;
          color: #5b6674;
          font-size: 12px;
          line-height: 1.4;
        }

        .lp-report-sections {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 22px;
        }

        .lp-report-sections span {
          border: 1px solid #dfd4c4;
          border-radius: 999px;
          background: #fffaf1;
          color: #334454;
          padding: 7px 10px;
          font-size: 12px;
          font-weight: 800;
        }

        .lp-report-table {
          display: grid;
          gap: 8px;
          margin-top: 20px;
        }

        .lp-report-row {
          display: grid;
          grid-template-columns: 42px 1fr 0.74fr;
          gap: 12px;
          align-items: center;
          border: 1px solid #dfd4c4;
          border-radius: 14px;
          background: #ffffff;
          padding: 12px;
        }

        .lp-report-rank {
          display: inline-flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #172330;
          color: #fff8ea;
          font-size: 12px;
          font-weight: 900;
        }

        .lp-report-row strong {
          display: block;
          color: #172330;
          font-size: 14px;
          line-height: 1.3;
        }

        .lp-report-row span {
          display: block;
          margin-top: 3px;
          color: #5b6674;
          font-size: 12px;
        }

        .lp-report-status {
          border-radius: 999px;
          background: #eef7f7;
          color: #145460;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 900;
          text-align: center;
        }

        .lp-sample-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 20px;
        }

        .lp-sample-field {
          border: 1px solid #dfd4c4;
          border-radius: 13px;
          background: #ffffff;
          padding: 12px;
        }

        .lp-sample-download {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          margin-top: 22px;
          border: 1px solid rgba(47, 154, 168, 0.45);
          border-radius: 999px;
          background: #2f9aa8;
          color: #061c22;
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 14px 32px rgba(47, 154, 168, 0.2);
        }

        .lp-how-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .lp-how-card {
          position: relative;
          border: 1px solid #cbd8dc;
          border-radius: 20px;
          background: #ffffff;
          padding: 24px;
          box-shadow: 0 16px 34px rgba(23, 35, 48, 0.06);
        }

        .lp-how-card::after {
          content: "";
          position: absolute;
          top: 42px;
          right: -17px;
          width: 17px;
          height: 2px;
          background: #9fc7ca;
        }

        .lp-how-card:last-child::after {
          display: none;
        }

        .lp-how-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .lp-how-number {
          display: inline-flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #172330;
          color: #fff8ea;
          font-size: 13px;
          font-weight: 900;
        }

        .lp-how-signal {
          border-radius: 999px;
          background: #e9f4f5;
          color: #245f68;
          padding: 6px 9px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .lp-how-card h3 {
          margin: 0 0 10px;
          color: #172330;
          font-size: 18px;
          line-height: 1.3;
        }

        .lp-how-card p {
          margin: 0;
          color: #526071;
          font-size: 14px;
          line-height: 1.65;
        }

        .lp-how-visual {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 18px;
        }

        .lp-how-visual span {
          height: 6px;
          border-radius: 999px;
          background: #dce9eb;
        }

        .lp-how-visual span:nth-child(1) {
          background: #2f9aa8;
        }

        .lp-how-visual span:nth-child(2) {
          background: #b7791f;
        }

        .lp-how-visual span:nth-child(3) {
          background: #172330;
        }

        .lp-lens-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .lp-lens-card {
          border: 1px solid #cbd8dc;
          border-radius: 18px;
          background: #ffffff;
          padding: 22px;
          box-shadow: 0 14px 30px rgba(23, 35, 48, 0.05);
        }

        .lp-lens-card span {
          display: inline-flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          border-radius: 10px;
          background: #172330;
          color: #fff8ea;
          font-size: 12px;
          font-weight: 900;
        }

        .lp-lens-card h3 {
          margin: 0;
          color: #172330;
          font-size: 16px;
          line-height: 1.3;
        }

        .lp-founder-grid {
          gap: 72px;
        }

        .lp-founder-id {
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }

        .lp-founder-id img {
          width: 96px;
          height: 96px;
          border: 3px solid #ded6c4;
          border-radius: 50%;
          object-fit: cover;
          object-position: center top;
          flex: 0 0 auto;
        }

        .lp-founder-id h3 {
          margin: 0 0 4px;
          color: #172330;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 400;
        }

        .lp-founder-id p {
          color: #526071;
        }

        .lp-quote {
          margin: 0 0 24px;
          padding-left: 24px;
          border-left: 3px solid #2f9aa8;
          color: #172330;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-style: italic;
          line-height: 1.55;
        }

        .lp-final-panel {
          max-width: 820px;
          margin: 0 auto;
          border-radius: 30px;
          background: #172330;
          padding: 58px 52px;
          text-align: center;
          box-shadow: 0 30px 80px rgba(23, 35, 48, 0.2);
        }

        .lp-final-panel h2 {
          margin: 0 0 16px;
          color: #fff8ea;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 42px;
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.13;
        }

        .lp-final-panel p {
          max-width: 560px;
          margin: 0 auto 34px;
          color: rgba(248, 241, 227, 0.7);
          font-size: 17px;
          line-height: 1.7;
        }

        .lp-final-cta {
          min-height: 54px;
          background: #fff8ea;
          color: #145460;
          padding: 16px 32px;
          font-size: 15px;
        }

        .lp-terms {
          margin-top: 18px;
          color: rgba(248, 241, 227, 0.44);
          font-size: 13px;
          line-height: 1.55;
        }

        .lp-terms a {
          color: rgba(248, 241, 227, 0.62);
        }

        .lp-feedback-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lp-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .lp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lp-field label {
          color: #172330;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        .lp-field input,
        .lp-field textarea {
          border: 1px solid #cfc4b4;
          border-radius: 12px;
          background: #fffaf1;
          color: #172330;
          padding: 12px 16px;
          font: inherit;
          outline: none;
        }

        .lp-field textarea {
          resize: vertical;
          line-height: 1.6;
        }

        .lp-feedback-button {
          border: none;
          background: #172330;
          color: #fff8ea;
          cursor: pointer;
          padding: 14px 28px;
          font-size: 15px;
        }

        .lp-footer {
          border-top: 1px solid #ded6c4;
          padding-top: 30px;
          padding-bottom: 30px;
        }

        .lp-footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .lp-footer-logo img {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }

        .lp-footer-logo span {
          color: #172330;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14px;
          font-weight: 700;
        }

        .lp-footer-meta {
          text-align: right;
          color: #7c8792;
          font-size: 13px;
        }

        .lp-footer-links {
          display: flex;
          justify-content: flex-end;
          gap: 22px;
          margin-top: 8px;
        }

        .lp-footer-links a {
          color: #7c8792;
        }

        @media (max-width: 1080px) {
          .lp-hero-grid,
          .lp-product-grid,
          .lp-sample-grid,
          .lp-founder-grid {
            grid-template-columns: 1fr;
          }

          .lp-hero-grid {
            gap: 40px;
          }

          .lp-artifact-shell,
          .lp-product-panel,
          .lp-sample-panel {
            max-width: 720px;
          }

          .lp-icp-grid,
          .lp-question-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 860px) {
          .lp-signal-grid,
          .lp-lens-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .lp-map-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .lp-container {
            padding-left: 20px;
            padding-right: 20px;
          }

          .lp-nav {
            padding-top: 18px;
            padding-bottom: 18px;
          }

          .lp-brand img {
            width: 32px;
            height: 32px;
          }

          .lp-brand span {
            font-size: 16px;
          }

          .lp-nav-cta {
            padding: 9px 13px;
            font-size: 12px;
          }

          .lp-hero-grid {
            padding-top: 28px;
            padding-bottom: 58px;
          }

          .lp-kicker,
          .lp-eyebrow {
            font-size: 11px;
            line-height: 1.35;
          }

          .lp-hero h1 {
            font-size: 38px;
            letter-spacing: -0.035em;
            line-height: 1.06;
          }

          .lp-hero-sub {
            font-size: 16px;
            line-height: 1.62;
          }

          .lp-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .lp-button,
          .lp-final-cta {
            width: 100%;
            min-height: 54px;
            padding-left: 18px;
            padding-right: 18px;
            text-align: center;
            white-space: normal;
          }

          .lp-trust {
            font-size: 13px;
          }

          .lp-artifact,
          .lp-product-map,
          .lp-sample-report {
            padding: 16px;
          }

          .lp-artifact-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .lp-path,
          .lp-report-row {
            grid-template-columns: auto 1fr;
            align-items: flex-start;
          }

          .lp-path-meta,
          .lp-report-status {
            grid-column: 2;
            width: fit-content;
            text-align: left;
          }

          .lp-signal-grid,
          .lp-icp-grid,
          .lp-how-grid,
          .lp-question-grid,
          .lp-sample-fields,
          .lp-lens-grid,
          .lp-form-grid {
            grid-template-columns: 1fr;
          }

          .lp-how-card::after {
            display: none;
          }

          .lp-sample-download {
            width: 100%;
            text-align: center;
          }

          .lp-section {
            padding: 60px 0;
          }

          .lp-section h2,
          .lp-final-panel h2 {
            font-size: 31px;
            line-height: 1.16;
          }

          .lp-copy {
            font-size: 15px;
          }

          .lp-founder-id {
            flex-direction: column;
          }

          .lp-final-panel {
            border-radius: 24px;
            padding: 42px 24px;
          }

          .lp-footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .lp-footer-meta {
            text-align: left;
          }

          .lp-footer-links {
            justify-content: flex-start;
          }
        }
      `}</style>

      <section className="lp-hero">
        <nav className="lp-container lp-nav">
          <div className="lp-brand">
            <img src="/ortheon-logo.png" alt="Ortheon" />
            <span>Ortheon</span>
          </div>
          <a className="lp-nav-cta" href="/assessment">
            Start free assessment
          </a>
        </nav>

        <div className="lp-container lp-hero-grid">
          <div>
            <div className="lp-kicker">
              <span className="lp-dot" />
              Career direction report · Free individual assessment
            </div>

            <h1>
              A career move is not only about what you want.
              <br />
              <em>It’s about where the market can believe you.</em>
            </h1>

            <p className="lp-hero-sub">
              Ortheon helps you identify career directions that are credible
              from your experience, realistic for your financial situation,
              aligned with what matters to you, and more durable in an
              AI-shaped market.
            </p>

            <div className="lp-actions">
              <a className="lp-button primary" href="/assessment">
                Start Career Direction Assessment
              </a>
              <a className="lp-button secondary" href="#sample-report">
                See Sample Report
              </a>
            </div>

            <p className="lp-trust">
              Free individual assessment. No credit card required.
              <br />
              Currently in alpha — built with feedback from early users.
            </p>
          </div>

          <div className="lp-artifact-shell" aria-label="Career Direction Map and report preview">
            <div className="lp-artifact">
              <div className="lp-artifact-top">
                <div>
                  <p className="lp-report-label">Career Direction Map</p>
                  <p className="lp-artifact-title">Hybrid map + report preview</p>
                </div>
                <span className="lp-artifact-pill">Anonymized sample</span>
              </div>

              <div className="lp-map">
                <div className="lp-current">
                  <span>Current profile / You are here</span>
                  <strong>Senior Operations Manager · Tech-enabled operations</strong>
                </div>

                <div className="lp-path-stack">
                  {directions.map((direction) => (
                    <div className="lp-path" key={direction.label}>
                      <span className="lp-path-node">{direction.rank}</span>
                      <div className="lp-path-title">
                        <strong>{direction.label}</strong>
                        <span>
                          Credibility: {direction.credibility} · AI durability: {direction.durability}
                        </span>
                      </div>
                      <div className="lp-path-meta">
                        <span>Transition path</span>
                        <strong>{direction.path}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lp-signal-grid">
                <div className="lp-signal-card">
                  <span>Credibility</span>
                  <strong>Evidence-backed</strong>
                </div>
                <div className="lp-signal-card">
                  <span>AI durability</span>
                  <strong>D3-D4 range</strong>
                </div>
                <div className="lp-signal-card">
                  <span>Financial reality</span>
                  <strong>Income-floor aware</strong>
                </div>
                <div className="lp-signal-card">
                  <span>Transition path</span>
                  <strong>Direct / adjacent / bridge</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section light">
        <div className="lp-container">
          <div className="lp-section-head">
            <p className="lp-eyebrow">
              <span className="lp-dot" />
              Who this is for
            </p>
            <h2>Built for people whose next move is no longer obvious.</h2>
            <p className="lp-copy">
              Ortheon is for people making a serious career direction decision,
              especially when ability, market credibility, financial reality,
              constraints, and AI durability all need to be considered together.
            </p>
          </div>

          <div className="lp-icp-grid">
            {situations.map((situation) => (
              <article className="lp-icp-card" key={situation.headline}>
                <div className="lp-icp-top">
                  <span className="lp-icon">{situation.icon}</span>
                  <span className="lp-mini-line" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <h3>{situation.headline}</h3>
                <p>{situation.text}</p>
                <div className="lp-checks">
                  <strong>Ortheon checks:</strong> {situation.checks}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section warm">
        <div className="lp-container">
          <div className="lp-section-head">
            <p className="lp-eyebrow">
              <span className="lp-dot" />
              How it works
            </p>
            <h2>Three inputs, one structured career direction report.</h2>
            <p className="lp-copy">
              The process is built like a diagnostic: gather evidence, add the
              reality constraints, then return a report that separates credible
              directions from bridge paths and longer-term options.
            </p>
          </div>

          <div className="lp-how-grid">
            {howSteps.map((step) => (
              <article className="lp-how-card" key={step.title}>
                <div className="lp-how-top">
                  <span className="lp-how-number">{step.number}</span>
                  <span className="lp-how-signal">{step.signal}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="lp-how-visual" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section ink">
        <div className="lp-container">
          <div className="lp-section-head">
            <p className="lp-eyebrow">
              <span className="lp-dot" />
              The decision problem
            </p>
            <h2>Most career advice skips the part the market cares about.</h2>
            <p className="lp-copy">
              The real decision is not one question. It is five at once: desire,
              market belief, financial reality, practical constraints, and
              durability as AI changes work.
            </p>
          </div>

          <div className="lp-question-grid">
            {problemQuestions.map((question, index) => (
              <article className="lp-question-card" key={question}>
                <span>{index + 1}</span>
                <h3>{question}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section navy">
        <div className="lp-container">
          <div className="lp-product-grid">
            <div>
              <p className="lp-eyebrow">
                <span className="lp-dot" />
                Career Direction Map
              </p>
              <h2>A map of credible, adjacent, bridge-based, and conditional paths.</h2>
              <p className="lp-copy">
                The map is not a subway diagram or a personality chart. It is a
                compact decision artifact showing where your current profile
                sits and how different paths relate to your evidence, financial
                reality, AI durability, and transition risk.
              </p>
            </div>

            <div className="lp-product-panel">
              <div className="lp-product-map">
                <div className="lp-map-grid">
                  <div className="lp-map-origin">
                    <span>Current profile / You are here</span>
                    <strong>Senior Operations Manager</strong>
                  </div>
                  <div className="lp-map-paths">
                    <div className="lp-map-path">
                      <strong>Direct path</strong>
                      <span>Business Operations / Delivery Leadership · credible now · financially viable</span>
                    </div>
                    <div className="lp-map-path">
                      <strong>Adjacent path</strong>
                      <span>Digital Operations / Automation Enablement · strong evidence with positioning</span>
                    </div>
                    <div className="lp-map-path bridge">
                      <strong>Bridge-based path</strong>
                      <span>Independent Operations Advisory · needs offer clarity and runway</span>
                    </div>
                    <div className="lp-map-path conditional">
                      <strong>Conditional / longer-term path</strong>
                      <span>Operations Technology Strategy · stronger technical proof needed</span>
                    </div>
                  </div>
                </div>

                <div className="lp-signal-grid">
                  <div className="lp-signal-card">
                    <span>Credibility</span>
                    <strong>Market-believable evidence</strong>
                  </div>
                  <div className="lp-signal-card">
                    <span>Financial fit</span>
                    <strong>Income-floor aware</strong>
                  </div>
                  <div className="lp-signal-card">
                    <span>AI durability</span>
                    <strong>D3-D4 signal</strong>
                  </div>
                  <div className="lp-signal-card">
                    <span>Transition path</span>
                    <strong>Direct / adjacent / bridge</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sample-report" className="lp-section warm">
        <div className="lp-container">
          <div className="lp-sample-grid">
            <div>
              <p className="lp-eyebrow">
                <span className="lp-dot" />
                Sample report
              </p>
              <h2>Sample Career Direction Report</h2>
              <p className="lp-copy">
                Users receive a structured report, not just a list of roles.
                It shows ranked directions, key signals, recommended directions,
                nearby trajectories, what drove the results, and the practical
                details behind each path.
              </p>
              <a
                className="lp-sample-download"
                href="/sample-career-direction-report.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Sample Career Direction Report
              </a>
            </div>

            <div className="lp-sample-panel">
              <div className="lp-sample-report">
                <p className="lp-report-label">Career Direction Report</p>
                <p className="lp-artifact-title">Your Career Directions</p>

                <div className="lp-report-sections">
                  {reportSections.map((section) => (
                    <span key={section}>{section}</span>
                  ))}
                </div>

                <div className="lp-report-table">
                  {directions.map((direction) => (
                    <div className="lp-report-row" key={direction.label}>
                      <span className="lp-report-rank">#{direction.rank}</span>
                      <div>
                        <strong>{direction.label}</strong>
                        <span>{direction.path} · {direction.credibility}</span>
                      </div>
                      <span className="lp-report-status">{direction.durability}</span>
                    </div>
                  ))}
                </div>

                <div className="lp-sample-fields">
                  {reportSignals.map(([label, value]) => (
                    <div className="lp-sample-field" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section light">
        <div className="lp-container">
          <div className="lp-section-head center">
            <p className="lp-eyebrow">
              <span className="lp-dot" />
              Method
            </p>
            <h2>Each direction is evaluated through the lenses that shape a real move.</h2>
            <p className="lp-copy">
              Ortheon does not match your CV to job titles. It evaluates
              possible directions through credibility, evidence, anchors,
              financial reality, constraints, credentials, AI durability, and
              calibration.
            </p>
          </div>

          <div className="lp-lens-grid">
            {lenses.map((lens, index) => (
              <article className="lp-lens-card" key={lens}>
                <span>{index + 1}</span>
                <h3>{lens}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section warm">
        <div className="lp-container">
          <div className="lp-founder-grid">
            <div className="lp-founder-id">
              <img src="/gio.jpg" alt="George Chakhidze" />
              <div>
                <p className="lp-eyebrow">
                  <span className="lp-dot" />
                  Built by
                </p>
                <h3>George Chakhidze</h3>
                <p>Talent & Workforce Systems · New York</p>
              </div>
            </div>

            <div>
              <p className="lp-eyebrow">
                <span className="lp-dot" />
                Why this exists
              </p>
              <blockquote className="lp-quote">
                “I spent 18 years on the other side of the hiring table.
                Recruiting operations, succession planning, workforce decisions
                — at PepsiCo, Abbott, Kelly, and as co-founder of a workforce
                marketplace.”
              </blockquote>
              <p className="lp-copy">
                I built Ortheon because the tools candidates use to make career
                decisions are far less rigorous than the ones organizations use
                to evaluate them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="start" className="lp-section light">
        <div className="lp-container">
          <div className="lp-final-panel">
            <h2>Start your Career Direction Assessment.</h2>
            <p>
              Receive your Career Direction Map, credibility status, financial
              signal, AI durability ratings, and the evidence behind the result.
            </p>
            <a className="lp-final-cta" href="/assessment">
              Start Career Direction Assessment
            </a>
            <div className="lp-terms">
              Free individual assessment. No credit card required.
              <br />
              By starting the assessment you agree to our{" "}
              <a href="/terms">Terms of Use</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section warm">
        <div className="lp-container" style={{ maxWidth: 864 }}>
          <div className="lp-section-head">
            <p className="lp-eyebrow">
              <span className="lp-dot" />
              Feedback
            </p>
            <h2>Something unclear or missing? Let us know.</h2>
            <p className="lp-copy">
              Ortheon is in alpha. If something feels off, inaccurate, or
              useful, send it directly to George. Every message is read.
            </p>
          </div>

          <form
            action="https://formspree.io/f/mjglnnql"
            method="POST"
            className="lp-feedback-form"
          >
            <div className="lp-form-grid">
              <div className="lp-field">
                <label>Name</label>
                <input type="text" name="name" placeholder="Your name" />
              </div>
              <div className="lp-field">
                <label>Email</label>
                <input type="email" name="email" placeholder="your@email.com" />
              </div>
            </div>

            <div className="lp-field">
              <label>Message</label>
              <textarea name="message" placeholder="What was unclear, missing, or useful?" rows={5} />
            </div>

            <div>
              <button className="lp-feedback-button" type="submit">
                Send Feedback →
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer>
        <div className="lp-container lp-footer">
          <div className="lp-footer-logo">
            <img src="/ortheon-logo.png" alt="Ortheon" />
            <span>Ortheon</span>
          </div>
          <div className="lp-footer-meta">
            <p>© 2026 eSellerFit LLC · ortheon.app</p>
            <div className="lp-footer-links">
              <a href="/terms">Terms of Use</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
