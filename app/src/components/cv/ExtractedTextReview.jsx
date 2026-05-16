function ExtractedTextReview({
  cvText,
  onTextChange,
  onParse,
  onSaveRawText,
  onBack,
  disabled = false,
}) {
  const characterCount = cvText.trim().length;

  return (
    <div className="form">
      <h2>Review extracted CV text</h2>

      <p>
        We extracted text from your CV. Please review it before analysis.
        You can edit the text if something looks wrong.
      </p>

      <p>
        <strong>Character count:</strong> {characterCount}
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="cvTextArea">CV text</label>
        <textarea
          id="cvTextArea"
          className="form-textarea"
          value={cvText}
          onChange={(event) => onTextChange(event.target.value)}
          rows={18}
          placeholder="Extracted or pasted CV text will appear here..."
        />
      </div>

      {characterCount < 100 && (
        <p className="status warning">
          This text looks too short. You can paste more CV text, upload another PDF,
          or skip the CV step.
        </p>
      )}

      <div className="action-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onParse}
          disabled={disabled || characterCount < 100}
        >
          {disabled ? "Working..." : "Analyze CV with AI"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={disabled}
        >
          Upload another PDF
        </button>
      </div>

      <p className="cv-skip-hint">
        Having trouble?{" "}
        <button
          type="button"
          className="cv-text-link"
          onClick={onSaveRawText}
          disabled={disabled || characterCount < 100}
        >
          Continue without AI CV analysis.
        </button>
      </p>
    </div>
  );
}

export default ExtractedTextReview;
