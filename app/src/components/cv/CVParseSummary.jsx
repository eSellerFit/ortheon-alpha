function CVParseSummary({ parsedData }) {
  if (!parsedData) {
    return null;
  }

  return (
    <div className="cv-parse-summary">
      <h2>Review CV profile</h2>

      <p>
        Ortheon analyzed your CV text and extracted the following career signals.
        Please review them before saving.
      </p>

      <section>
        <h3>Career summary</h3>
        <p>{parsedData.careerSummary}</p>
      </section>

      <section>
        <h3>Domain signals</h3>
        {parsedData.domainSignals?.length > 0 ? (
          <div className="tag-row">
            {parsedData.domainSignals.map((domain) => (
              <span key={domain} className="tag">
                {domain}
              </span>
            ))}
          </div>
        ) : (
          <p>No clear domain signals found.</p>
        )}
      </section>

      <section>
        <h3>Profile signals</h3>

        <ul>
          <li>
            <strong>Seniority:</strong> {parsedData.senioritySignal}
          </li>
          <li>
            <strong>Tenure pattern:</strong> {parsedData.tenurePattern}
          </li>
          <li>
            <strong>Leadership scope:</strong> {parsedData.leadershipScope}
          </li>
          <li>
            <strong>Entrepreneurial signals:</strong>{" "}
            {parsedData.entrepreneurialSignals ? "Yes" : "No"}
          </li>
          <li>
            <strong>Trade / craft signals:</strong>{" "}
            {parsedData.tradeSignals ? "Yes" : "No"}
          </li>
        </ul>
      </section>

      <section>
        <h3>Confidence</h3>

        <ul>
          <li>
            <strong>Overall:</strong> {parsedData.confidence?.overall}
          </li>
          <li>
            <strong>Competencies:</strong> {parsedData.confidence?.competencies}
          </li>
        </ul>
      </section>
    </div>
  );
}

export default CVParseSummary;
