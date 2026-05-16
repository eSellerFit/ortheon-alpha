import { useState } from "react";
import PdfUploadBox from "../cv/PdfUploadBox";
import ExtractedTextReview from "../cv/ExtractedTextReview";
import CVParseSummary from "../cv/CVParseSummary";
import CompetencySignalReview from "../cv/CompetencySignalReview";
import { extractTextFromPdf } from "../../utils/pdfTextExtractor";
import { parseCvText } from "../../services/cvParsingService";
import {
  saveAssessmentRawCVText,
  skipAssessmentCV,
  updateAssessmentCVProfile,
} from "../../services/assessmentService";

function CVUploadStep({ assessmentId, onComplete, onBack }) {
  const [stepState, setStepState] = useState("idle");
  const [cvText, setCvText] = useState("");
  const [cvSource, setCvSource] = useState("manual_paste");
  const [pdfMetadata, setPdfMetadata] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [userCorrections, setUserCorrections] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFileSelected(file) {
    try {
      setErrorMessage("");
      setParsedData(null);
      setUserCorrections([]);
      setStepState("extracting_text");

      const result = await extractTextFromPdf(file);

      setCvText(result.text);
      setCvSource("pdf_extracted");
      setPdfMetadata({
        fileName: file.name,
        pageCount: result.pageCount,
        extractedCharacterCount: result.characterCount,
      });
      setStepState("reviewing_text");
    } catch (error) {
      console.error("PDF text extraction failed:", error);
      setErrorMessage(
        "We couldn't read your PDF. Try a different file or paste your CV text manually."
      );
      setCvText("");
      setCvSource("manual_paste");
      setPdfMetadata(null);
      setParsedData(null);
      setUserCorrections([]);
      setStepState("error");
    }
  }

  function handleManualPasteStart() {
    setErrorMessage("");
    setCvText("");
    setCvSource("manual_paste");
    setPdfMetadata(null);
    setParsedData(null);
    setUserCorrections([]);
    setStepState("reviewing_text");
  }

  function handleBackToUpload() {
    setErrorMessage("");
    setCvText("");
    setCvSource("manual_paste");
    setPdfMetadata(null);
    setParsedData(null);
    setUserCorrections([]);
    setStepState("idle");
  }

  function handleBackToTextReview() {
    setErrorMessage("");
    setStepState("reviewing_text");
  }

  async function handleParseCV() {
    try {
      setErrorMessage("");
      setParsedData(null);
      setUserCorrections([]);
      setStepState("parsing_cv");

      const parsed = await parseCvText(cvText);

      setParsedData(parsed);
      setStepState("reviewing_parsed_profile");
    } catch (error) {
      console.error("CV parsing failed:", error);
      setErrorMessage(
        error.message || "We couldn't analyze your CV right now."
      );
      setStepState("parse_error");
    }
  }

  async function handleSaveReviewedText() {
    try {
      setErrorMessage("");
      setStepState("saving");

      await saveAssessmentRawCVText(assessmentId, cvText, {
        cvSource,
        pdfMetadata,
      });

      setStepState("completed");
      onComplete();
    } catch (error) {
      console.error("Saving reviewed CV text failed:", error);
      setErrorMessage("We couldn't save your CV text. Please try again.");
      setStepState("error");
    }
  }

  async function handleSaveParsedProfile() {
    try {
      setErrorMessage("");
      setStepState("saving");

      await updateAssessmentCVProfile(
        assessmentId,
        parsedData,
        userCorrections
      );

      setStepState("completed");
      onComplete();
    } catch (error) {
      console.error("Saving parsed CV profile failed:", error);
      setErrorMessage("We couldn't save the parsed CV profile. Please try again.");
      setStepState("parse_error");
    }
  }

  async function handleSkipCV() {
    try {
      setErrorMessage("");
      setStepState("saving");

      await skipAssessmentCV(assessmentId, "user_skipped");

      setStepState("completed");
      onComplete();
    } catch (error) {
      console.error("Skipping CV failed:", error);
      setErrorMessage("We couldn't skip the CV step. Please try again.");
      setStepState("error");
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

  if (stepState === "extracting_text") {
    return (
      <div className="form">
        <h2>CV Upload</h2>
        <p>Extracting text from your PDF...</p>
      </div>
    );
  }

  if (stepState === "reviewing_text") {
    return (
      <ExtractedTextReview
        cvText={cvText}
        onTextChange={setCvText}
        onParse={handleParseCV}
        onSaveRawText={handleSaveReviewedText}
        onBack={handleBackToUpload}
        disabled={stepState === "saving"}
      />
    );
  }

  if (stepState === "parsing_cv") {
    return (
      <div className="form">
        <div className="cv-parse-loading">
          <h2>Analyzing CV</h2>

          <div className="cv-parse-spinner" aria-hidden="true" />

          <p className="cv-parse-desc">
            Ortheon is reading the reviewed CV text and extracting structured
            career signals.
          </p>

          <div className="cv-parse-steps" role="status" aria-label="CV analysis in progress">
            <div className="cv-parse-step">
              <span className="cv-parse-step-label">Reading reviewed CV text</span>
              <div className="cv-parse-step-dot" aria-hidden="true" />
            </div>
            <div className="cv-parse-step">
              <span className="cv-parse-step-label">Extracting career signals</span>
              <div className="cv-parse-step-dot" aria-hidden="true" />
            </div>
            <div className="cv-parse-step">
              <span className="cv-parse-step-label">Preparing structured profile</span>
              <div className="cv-parse-step-dot" aria-hidden="true" />
            </div>
          </div>

          <p className="cv-parse-hint">
            This usually takes a few moments. If the AI service is temporarily
            busy, you'll be able to retry.
          </p>
        </div>
      </div>
    );
  }

  if (stepState === "reviewing_parsed_profile") {
    return (
      <div className="form">
        <CVParseSummary parsedData={parsedData} />

        <CompetencySignalReview
          competencySignals={parsedData?.competencySignals || []}
          userCorrections={userCorrections}
          onCorrectionChange={setUserCorrections}
        />

        <div className="action-row">
          <button type="button" className="btn btn-primary" onClick={handleSaveParsedProfile}>
            Save CV analysis
          </button>

          <button type="button" className="btn btn-ghost" onClick={handleBackToTextReview}>
            Back to CV text
          </button>
        </div>

        <p className="cv-skip-hint">
          Not happy with the analysis?{" "}
          <button type="button" className="cv-text-link" onClick={handleSaveReviewedText}>
            Continue without AI CV analysis.
          </button>
        </p>
      </div>
    );
  }

  if (stepState === "parse_error") {
    return (
      <div className="form">
        <h2>CV Analysis Error</h2>

        <p className="status error">
          {errorMessage || "We couldn't analyze your CV right now."}
        </p>

        <div className="action-row">
          <button type="button" className="btn btn-primary" onClick={handleParseCV}>
            Retry AI analysis
          </button>

          <button type="button" className="btn btn-secondary" onClick={handleSaveReviewedText}>
            Continue without AI CV analysis
          </button>

          <button type="button" className="btn btn-ghost" onClick={handleBackToTextReview}>
            Back to CV text
          </button>

          <button type="button" className="btn btn-ghost" onClick={handleSkipCV}>
            Skip CV step
          </button>
        </div>
      </div>
    );
  }

  if (stepState === "saving") {
    return (
      <div className="form">
        <h2>CV Upload</h2>
        <p>Saving CV information...</p>
      </div>
    );
  }

  if (stepState === "error") {
    return (
      <div className="form">
        <h2>CV Upload</h2>

        <p className="status error">{errorMessage}</p>

        <div className="action-row">
          <button type="button" className="btn btn-secondary" onClick={handleBackToUpload}>
            Upload another PDF
          </button>

          <button type="button" className="btn btn-secondary" onClick={handleManualPasteStart}>
            Paste CV text manually
          </button>

          <button type="button" className="btn btn-ghost" onClick={handleSkipCV}>
            Skip CV step
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form">
      {onBack && (
        <button type="button" className="step-back-button" onClick={onBack}>
          ← Back
        </button>
      )}

      <h2>CV Upload</h2>

      <p>
        Upload your CV as a PDF. Ortheon will extract the text first, then you
        will review it before analysis or saving.
      </p>

      <PdfUploadBox onFileSelected={handleFileSelected} />

      <div className="action-row">
        <button type="button" className="btn btn-secondary" onClick={handleManualPasteStart}>
          Paste CV text manually
        </button>
      </div>

      <p className="cv-skip-hint">
        Don't have a CV right now?{" "}
        <button type="button" className="cv-text-link" onClick={handleSkipCV}>
          Continue without CV analysis.
        </button>
      </p>
    </div>
  );
}

export default CVUploadStep;
