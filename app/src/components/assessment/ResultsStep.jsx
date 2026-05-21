import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CareerDirectionMap from "./CareerDirectionMap";
import PdfReport from "./PdfReport";
import {
  generateLiveCareerMap,
  generateLiveRecommendations,
} from "../../utils/foundationAdapter/liveRecommendationAdapter";
import {
  getAssessment,
  saveAssessmentResults,
} from "../../services/assessmentService";
import { trackEvent } from "../../utils/analytics";
import { ANALYTICS_EVENTS } from "../../utils/analyticsEvents";

const ALPHA_REPORT_REVIEW_URL =
  "https://calendar.app.google/y6Ri2VYvBa7iJRCu5";

const durabilityLabels = {
  D0: "Declining / avoid recommending",
  D1: "Pressured by AI and automation",
  D2: "Transforming but still viable",
  D3: "Durable with AI adaptation",
  D4: "Future-resilient / AI-native path",
};

const transitionLabels = {
  direct: "Direct path",
  bridge: "Bridge path",
  stretch: "Stretch path",
};

function getOrdinal(rank) {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

function formatUsd(value) {
  const number = Number(value);

  if (!number) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);
}

function formatSignal(signalStrength) {
  if (!signalStrength) {
    return "absent";
  }

  return signalStrength.charAt(0).toUpperCase() + signalStrength.slice(1);
}

function CompetencyList({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="result-detail-block">
      <p>
        <strong>{title}</strong>
      </p>

      <ul>
        {items.map((item) => (
          <li key={`${title}-${item.competencyId}`}>
            {item.competencyName} — {formatSignal(item.signalStrength)}
            {item.evidence && (
              <span className="helper-text"> · Evidence: “{item.evidence}”</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnchorList({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="result-detail-block">
      <p>
        <strong>{title}</strong>
      </p>

      <ul>
        {items.map((item) => (
          <li key={`${title}-${item.anchorId}`}>
            {item.anchorId}: user score {item.userScore}, ideal range{" "}
            {item.idealMin}–{item.idealMax}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreBreakdown({ breakdown }) {
  if (!breakdown) {
    return null;
  }

  return (
    <div className="score-breakdown-grid">
      <div>
        <span>Competency</span>
        <strong>{breakdown.competency.score}</strong>
        <small>{breakdown.competency.weight}% weight</small>
      </div>

      <div>
        <span>Anchor</span>
        <strong>{breakdown.anchor.score}</strong>
        <small>{breakdown.anchor.weight}% weight</small>
      </div>

      <div>
        <span>Financial</span>
        <strong>{breakdown.financial.score}</strong>
        <small>{breakdown.financial.weight}% weight</small>
      </div>

      <div>
        <span>AI durability</span>
        <strong>{breakdown.durability.score}</strong>
        <small>{breakdown.durability.weight}% weight</small>
      </div>
    </div>
  );
}

function TransitionBadge({ transitionLabel }) {
  if (!transitionLabel) {
    return null;
  }

  const classMap = {
    main: "transition-badge-main",
    secondary: "transition-badge-secondary",
    flagged: "transition-badge-flagged",
  };

  const className = classMap[transitionLabel.treatment] || classMap.main;

  return (
    <div className={`transition-badge ${className}`}>
      <span>{transitionLabel.label}</span>

      {transitionLabel.sublabel && <small>{transitionLabel.sublabel}</small>}
    </div>
  );
}

function BridgePathSuggestions({ bridgeDirections, longerPathOptions }) {
  const hasBridges = bridgeDirections?.length > 0;
  const hasLonger = longerPathOptions?.length > 0;

  if (!hasBridges && !hasLonger) {
    return null;
  }

  return (
    <div className="bridge-suggestions">
      {hasBridges && (
        <div>
          <span className="bridge-label">Consider first</span>

          <div className="bridge-chip-row">
            {bridgeDirections.map((bridge) => (
              <span key={bridge.directionId} className="bridge-chip">
                {bridge.directionLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasLonger && (
        <div>
          <span className="bridge-label">Longer path option</span>

          <div className="bridge-chip-row">
            {longerPathOptions.map((option) => (
              <span key={option.directionId} className="bridge-chip">
                {option.directionLabel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ recommendation }) {
  return (
    <section className="result-card">
      <div className="result-card-header">
        <div>
          <p className="eyebrow">{getOrdinal(recommendation.rank)} direction</p>
          <h3>{recommendation.directionLabel}</h3>
        </div>

        <div className="result-score">
          <span>Total score</span>
          <strong>{recommendation.scores.total}</strong>
        </div>
      </div>

      <TransitionBadge transitionLabel={recommendation.transitionLabel} />

      {recommendation.transitionLabel?.showBridges && (
        <BridgePathSuggestions
          bridgeDirections={recommendation.bridgeDirections}
          longerPathOptions={recommendation.longerPathOptions}
        />
      )}

      <div className="result-facts-grid">
        <div>
          <span>Fit band</span>
          <strong>{recommendation.fitBand}</strong>
        </div>

        <div>
          <span>AI durability</span>
          <strong>
            {recommendation.aiDurabilityRating} —{" "}
            {durabilityLabels[recommendation.aiDurabilityRating] ||
              "Not classified"}
          </strong>
        </div>

        <div>
          <span>Transition pathway</span>
          <strong>
            {transitionLabels[recommendation.transitionPathway] ||
              recommendation.transitionPathway}
          </strong>
        </div>

        <div>
          <span>Estimated first-year income</span>
          <strong>{formatUsd(recommendation.financialPathway?.avg12month)}</strong>
        </div>

        <div>
          <span>Category</span>
          <strong>{recommendation.category}</strong>
        </div>

        <div>
          <span>Context</span>
          <strong>{recommendation.context}</strong>
        </div>
      </div>

      {recommendation.salarySources?.[0] && (
        <p className="helper-text">
          BLS benchmark: {recommendation.salarySources[0].occupationTitle} —{" "}
          {formatUsd(recommendation.salarySources[0].medianAnnualWage)} median
          annual wage. Source: {recommendation.salarySource}; updated{" "}
          {recommendation.salaryLastUpdated || "unknown"}.
        </p>
      )}

      {recommendation.eligibilityWarning && (
        <p className="status warning">
          Credential note: {recommendation.eligibilityWarning}
        </p>
      )}

      {recommendation.financialFlag === "financially_constrained" && (
        <p className="status warning">
          This direction may be financially constrained in the first 12 months.
        </p>
      )}

      {recommendation.financialFlag === "financially_risky" && (
        <p className="status warning">
          This direction may be financially risky based on your stated income
          floor.
        </p>
      )}

      {recommendation.anchorWarnings?.length > 0 && (
        <p className="status warning">
          Anchor note: this direction may conflict with your{" "}
          {recommendation.anchorWarnings.join(", ")} preference.
        </p>
      )}

      {recommendation.cvConfidence === "low" && (
        <p className="status warning">
          Recommendation confidence is lower because no parsed CV data was
          available.
        </p>
      )}

      {recommendation.d4EvolutionPath && (
        <p className="ai-evolution">
          <strong>AI evolution path:</strong> {recommendation.d4EvolutionPath}
        </p>
      )}

      <details className="debug-details pdf-exclude">
        <summary>Why this direction appeared</summary>

        <ScoreBreakdown breakdown={recommendation.scoreBreakdown} />

        {recommendation.eligibility?.gateType &&
          recommendation.eligibility.gateType !== "none" && (
            <div className="result-detail-block">
              <p>
                <strong>Credential gate</strong>
              </p>

              <p>Gate type: {recommendation.eligibility.gateType}</p>

              <p>
                {recommendation.eligibility.matchedCredential
                  ? `Matched credential: ${recommendation.eligibility.matchedCredential.type} (${recommendation.eligibility.matchedCredential.status}, ${recommendation.eligibility.matchedCredential.jurisdiction})`
                  : recommendation.eligibility.reason}
              </p>
            </div>
          )}

        <CompetencyList
          title="Matched required competencies"
          items={recommendation.matchedRequiredCompetencies}
        />

        <CompetencyList
          title="Missing required competencies"
          items={recommendation.missingRequiredCompetencies}
        />

        <CompetencyList
          title="Matched preferred competencies"
          items={recommendation.matchedPreferredCompetencies}
        />

        <CompetencyList
          title="Missing preferred competencies"
          items={recommendation.missingPreferredCompetencies}
        />

        <AnchorList
          title="Anchor matches"
          items={recommendation.anchorMatches}
        />

        <AnchorList
          title="Anchor conflicts"
          items={recommendation.anchorConflicts}
        />

        {recommendation.financialExplanation && (
          <div className="result-detail-block">
            <p>
              <strong>Financial explanation</strong>
            </p>

            <p>{recommendation.financialExplanation.explanation}</p>

            <ul>
              <li>
                Income floor:{" "}
                {formatUsd(recommendation.financialExplanation.annualFloor)}
              </li>
              <li>
                Estimated first-year income:{" "}
                {formatUsd(recommendation.financialExplanation.avg12month)}
              </li>
              <li>Ratio: {recommendation.financialExplanation.ratio}</li>
              <li>
                Runway: {recommendation.financialExplanation.runwayMonths}{" "}
                months
              </li>
              <li>
                Runway adjustment:{" "}
                {recommendation.financialExplanation.runwayAdjustment}
              </li>
            </ul>
          </div>
        )}
      </details>
    </section>
  );
}

function AlphaReportReview() {
  function handleAlphaReportReviewClick() {
    trackEvent(ANALYTICS_EVENTS.ALPHA_REPORT_REVIEW_CLICKED, {
      source_section: "results_page",
    });
  }

  return (
    <section className="alpha-review-card pdf-exclude">
      <div className="alpha-review-content">
        <p className="eyebrow">Optional Alpha report review</p>
        <h2>Discuss your report with George</h2>

        <p>
          For the first 10 Alpha users, George is offering a 30-minute report
          review session.
        </p>

        <p>
          This is not a sales call. It is a short conversation to discuss your
          report and help improve Ortheon.
        </p>

        <p className="alpha-review-note">
          Please use the same email you used for the assessment when booking.
        </p>
      </div>

      <a
        href={ALPHA_REPORT_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="alpha-review-button"
        data-analytics-event="alpha_report_review_clicked"
        aria-label="Schedule a 30-minute Ortheon Alpha report review"
        onClick={handleAlphaReportReviewClick}
      >
        Schedule 30-minute report review
      </a>
    </section>
  );
}

function ResultsStep({ assessmentId, forceRegenerate = false, disableResultSave = false }) {
  const [status, setStatus] = useState("loading");
  const [recommendations, setRecommendations] = useState([]);
  const [careerMap, setCareerMap] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pdfStatus, setPdfStatus] = useState("idle");
  const hasGeneratedRef = useRef(false);
  const hasTrackedResultsViewRef = useRef(false);
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    async function loadAndGenerateResults() {
      if (!assessmentId || hasGeneratedRef.current) {
        return;
      }

      hasGeneratedRef.current = true;

      if (forceRegenerate) {
        console.log("[ResultsStep] forceRegenerate=true — using freshly generated result.");
      }

      try {
        setStatus("loading");
        setErrorMessage("");

        const assessment = await getAssessment(assessmentId);
        const generatedRecommendations = await generateLiveRecommendations(assessment);
        const generatedCareerMap = generateLiveCareerMap(
          assessment,
          generatedRecommendations
        );

        if (!disableResultSave) {
          await saveAssessmentResults(
            assessmentId,
            generatedRecommendations,
            generatedCareerMap
          );
        } else {
          console.log("[ResultsStep] disableResultSave=true — saveAssessmentResults skipped.");
        }

        setRecommendations(generatedRecommendations);
        setCareerMap(generatedCareerMap);
        setStatus("success");
      } catch (error) {
        console.error("Results generation failed:", error);
        setErrorMessage(
          error.message || "Something went wrong while generating results."
        );
        setStatus("error");
      }
    }

    loadAndGenerateResults();
  }, [assessmentId]);

  useEffect(() => {
    if (status !== "success" || hasTrackedResultsViewRef.current) {
      return;
    }

    hasTrackedResultsViewRef.current = true;

    const nearbyCount =
      careerMap?.nearbyTrajectories?.length ||
      careerMap?.nearbyDirections?.length ||
      careerMap?.nearby?.length ||
      0;

    trackEvent(ANALYTICS_EVENTS.RESULTS_VIEWED, {
      direction_count: recommendations.length,
      has_nearby_trajectories: nearbyCount > 0,
      source_section: "results_page",
    });
  }, [status, recommendations.length, careerMap]);

  async function handleDownloadPdf() {
    console.log("[PDF] export handler running");
    console.log("[PDF] pdfContainerRef.current:", pdfContainerRef.current);

    trackEvent(ANALYTICS_EVENTS.PDF_DOWNLOAD_CLICKED, {
      source_section: "results_page",
    });

    if (!pdfContainerRef.current) {
      console.error("[PDF] pdfContainerRef.current is null — PdfReport not mounted");
      trackEvent(ANALYTICS_EVENTS.PDF_DOWNLOAD_ERROR, {
        source_section: "results_page",
        error_type: "pdf_container_missing",
      });
      return;
    }

    setPdfStatus("generating");

    const container = pdfContainerRef.current;

    // Save original position so we can restore it after capture
    const savedLeft = container.style.left;

    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default ?? html2canvasModule;
      const { jsPDF } = await import("jspdf");

      const pages = Array.from(container.querySelectorAll(".pdf-page"));
      console.log("[PDF] pages found:", pages.length);
      if (pages.length === 0) throw new Error("No PDF pages found");

      // Move container into viewport so html2canvas can capture it reliably.
      // position:fixed means no ancestor can clip it; left:0 puts it on screen.
      // There is no z-index so it sits under normal page content — no visible flash.
      container.style.left = "0px";
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        console.log(
          `[PDF] capturing page ${i + 1} of ${
            pages.length
          } — offsetWidth:${page.offsetWidth} offsetHeight:${page.offsetHeight}`
        );

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 1200,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const naturalH = (canvas.height / canvas.width) * pdfWidth;

        if (i > 0) pdf.addPage();

        if (naturalH <= pdfHeight) {
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, naturalH);
        } else {
          const scale = pdfHeight / naturalH;
          const scaledW = pdfWidth * scale;
          pdf.addImage(
            imgData,
            "JPEG",
            (pdfWidth - scaledW) / 2,
            0,
            scaledW,
            pdfHeight
          );
        }
      }

      pdf.save("ortheon-career-direction-report.pdf");
      console.log("[PDF] saved successfully");

      trackEvent(ANALYTICS_EVENTS.PDF_DOWNLOAD_SUCCESS, {
        source_section: "results_page",
        page_count: pages.length,
      });

      setPdfStatus("idle");
    } catch (error) {
      console.error("[PDF] generation failed:", error);

      trackEvent(ANALYTICS_EVENTS.PDF_DOWNLOAD_ERROR, {
        source_section: "results_page",
        error_type: "pdf_generation_error",
      });

      setPdfStatus("error");
    } finally {
      // Always restore off-screen position
      container.style.left = savedLeft;
    }
  }

  if (!assessmentId) {
    return (
      <div className="results-page">
        <h2>Results</h2>
        <p className="status error">
          Missing assessment ID. Please complete the assessment first.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="results-page">
        <h2>Results</h2>
        <p>Generating your career direction recommendations...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="results-page">
        <h2>Results</h2>
        <p className="status error">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-hero">
        <p className="eyebrow">Step 8 of 8</p>
        <h2>Your Career Direction Report is ready</h2>
        <p className="intro">
          Review your recommended directions, map, credibility signals, financial
          reality, and the evidence behind the result. You can also download a PDF
          copy for later.
        </p>

        <div className="action-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownloadPdf}
            disabled={pdfStatus === "generating"}
          >
            {pdfStatus === "generating"
              ? "Preparing PDF…"
              : "Download PDF Report"}
          </button>
        </div>

        {pdfStatus === "error" && (
          <p className="status error">
            Couldn't generate PDF. Please try again.
          </p>
        )}
      </div>

      <AlphaReportReview />

      <CareerDirectionMap careerMap={careerMap} />

      {recommendations.length === 0 ? (
        <p className="status warning">
          No recommendations could be generated from the current assessment data.
        </p>
      ) : (
        <div className="results-list">
          {recommendations.map((recommendation) => (
            <ResultCard
              key={recommendation.directionId}
              recommendation={recommendation}
            />
          ))}
        </div>
      )}

      {createPortal(
        <PdfReport
          careerMap={careerMap}
          recommendations={recommendations}
          containerRef={pdfContainerRef}
        />,
        document.body
      )}
    </div>
  );
}

export default ResultsStep;