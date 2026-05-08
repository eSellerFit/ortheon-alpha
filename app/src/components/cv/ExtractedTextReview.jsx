function ExtractedTextReview({
  cvText,
  onTextChange,
  onConfirm,
  onBack,
  onSkip,
  disabled = false,
}) {
  const characterCount = cvText.trim().length;

  return (
    <div className="form">
      <h2>Review extracted CV text</h2>

      <p>
        We extracted text from your PDF. Please quickly review it before saving.
        You can edit the text if something looks wrong.
      </p>

      <p>
        <strong>Character count:</strong> {characterCount}
      </p>

      <label>
        Extracted CV text
        <textarea
          value={cvText}
          onChange={(event) => onTextChange(event.target.value)}
          rows={14}
          placeholder="Extracted CV text will appear here..."
        />
      </label>

      {characterCount < 100 && (
        <p className="status warning">
          This text looks too short. You can paste your CV text manually, upload another PDF,
          or skip the CV step.
        </p>
      )}

      <div>
        <button type="button" onClick={onBack} disabled={disabled}>
          Upload another PDF
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={disabled || characterCount < 100}
        >
          {disabled ? "Saving..." : "Save reviewed CV text"}
        </button>

        <button type="button" onClick={onSkip} disabled={disabled}>
          Skip CV step
        </button>
      </div>
    </div>
  );
}

export default ExtractedTextReview;
