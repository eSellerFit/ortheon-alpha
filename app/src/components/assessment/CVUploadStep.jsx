import { useState } from "react";
import PdfUploadBox from "../cv/PdfUploadBox";
import ExtractedTextReview from "../cv/ExtractedTextReview";
import { extractTextFromPdf } from "../../utils/pdfTextExtractor";
import {
  saveAssessmentRawCVText,
  skipAssessmentCV,
} from "../../services/assessmentService";

function CVUploadStep({ assessmentId, onComplete }) {
  const [stepState, setStepState] = useState("idle");
  const [cvText, setCvText] = useState("");
  const [cvSource, setCvSource] = useState("manual_paste");
  const [pdfMetadata, setPdfMetadata] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFileSelected(file) {
    try {
      setErrorMessage("");
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
      setStepState("error");
    }
  }

  function handleManualPasteStart() {
    setErrorMessage("");
    setCvText("");
    setCvSource("manual_paste");
    setPdfMetadata(null);
    setStepState("reviewing_text");
  }

  function handleBackToUpload() {
    setErrorMessage("");
    setCvText("");
    setCvSource("manual_paste");
    setPdfMetadata(null);
    setStepState("idle");
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
        onConfirm={handleSaveReviewedText}
        onBack={handleBackToUpload}
        onSkip={handleSkipCV}
        disabled={stepState === "saving"}
      />
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

        <div>
          <button type="button" onClick={handleBackToUpload}>
            Upload another PDF
          </button>

          <button type="button" onClick={handleManualPasteStart}>
            Paste CV text manually
          </button>

          <button type="button" onClick={handleSkipCV}>
            Skip CV step
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form">
      <h2>CV Upload</h2>

      <p>
        Upload your CV as a PDF. Ortheon will extract the text first, then you
        will review it before anything is saved.
      </p>

      <PdfUploadBox onFileSelected={handleFileSelected} />

      <div>
        <button type="button" onClick={handleManualPasteStart}>
          Paste CV text manually
        </button>

        <button type="button" onClick={handleSkipCV}>
          Skip CV step
        </button>
      </div>
    </div>
  );
}

export default CVUploadStep;
