function CompetencySignalReview({
  competencySignals,
  userCorrections,
  onCorrectionChange,
}) {
  if (!competencySignals || competencySignals.length === 0) {
    return (
      <div>
        <h3>Competency signals</h3>
        <p>No competency signals were returned.</p>
      </div>
    );
  }

  function getCorrectionForSignal(competencyId) {
    return userCorrections.find(
      (correction) => correction.competencyId === competencyId
    );
  }

  function handleCorrectionChange(signal, correctedStrength) {
    if (!correctedStrength) {
      onCorrectionChange(
        userCorrections.filter(
          (correction) => correction.competencyId !== signal.competencyId
        )
      );
      return;
    }

    const newCorrection = {
      competencyId: signal.competencyId,
      originalStrength: signal.signalStrength,
      correctedStrength,
      reason: "user_adjusted",
    };

    const otherCorrections = userCorrections.filter(
      (correction) => correction.competencyId !== signal.competencyId
    );

    onCorrectionChange([...otherCorrections, newCorrection]);
  }

  return (
    <div className="competency-review">
      <h3>Competency signals</h3>

      <p>
        Review the competency signals extracted from your CV. You can adjust a signal
        if it looks overstated, understated, or wrong.
      </p>

      {competencySignals.map((signal) => {
        const correction = getCorrectionForSignal(signal.competencyId);

        return (
          <div key={signal.competencyId} className="competency-card">
            <p>
              <strong>
                {signal.competencyId}. {signal.competencyName}
              </strong>
            </p>

            <p>
              Original signal: <strong>{signal.signalStrength}</strong>
            </p>

            {signal.evidence && (
              <p>
                Evidence: <em>{signal.evidence}</em>
              </p>
            )}

            <div className="form-group">
              <label className="form-label">Correction</label>
              <select
                className="form-select"
                value={correction?.correctedStrength || ""}
                onChange={(event) =>
                  handleCorrectionChange(signal, event.target.value)
                }
              >
                <option value="">No correction</option>
                <option value="strong">Strong</option>
                <option value="moderate">Moderate</option>
                <option value="weak">Weak</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CompetencySignalReview;
