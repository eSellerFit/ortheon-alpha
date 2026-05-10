function ExtractedTextReview({
  cvText,
  onTextChange,
  onParse,
  onSaveRawText,
  onBack,
  onSkip,
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

      <label>
        CV text
        <textarea
          value={cvText}
          onChange={(event) => onTextChange(event.target.value)}
          rows={14}
          placeholder="Extracted or pasted CV text will appear here..."
        />
      </label>

      {characterCount < 100 && (
        <p className="status warning">
          This text looks too short. You can paste more CV text, upload another PDF,
          or skip the CV step.
        </p>
      )}

      <div>
        <button type="button" onClick={onBack} disabled={disabled}>
          Upload another PDF
        </button>

        <button
          type="button"
          onClick={onParse}
          disabled={disabled || characterCount < 100}
        >
          {disabled ? "Working..." : "Analyze CV with AI"}
        </button>

        <button
          type="button"
          onClick={onSaveRawText}
          disabled={disabled || characterCount < 100}
        >
          Save without AI
        </button>

        <button type="button" onClick={onSkip} disabled={disabled}>
          Skip CV step
        </button>
      </div>
    </div>
  );
}

export default ExtractedTextReview;
