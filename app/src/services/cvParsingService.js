export async function parseCvText(cvText) {
  const cleanedText = cvText.trim();

  if (!cleanedText || cleanedText.length < 100) {
    throw new Error("CV text is too short to parse.");
  }

  const response = await fetch("/api/parse-cv", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cvText: cleanedText,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const backendDetails =
      data?.details ||
      data?.detail ||
      data?.anthropicError ||
      data?.safeDetails ||
      "";

    if (backendDetails === "Overloaded") {
      throw new Error(
        "The AI analysis service is temporarily busy. Please try again in a minute."
      );
    }

    const statusPart = response.status ? `Status ${response.status}` : "Request failed";
    const backendError =
      data?.error ||
      data?.message ||
      "CV parsing failed. Please try again.";

    const fullMessage = backendDetails
      ? `${statusPart}: ${backendError} — ${backendDetails}`
      : `${statusPart}: ${backendError}`;

    throw new Error(fullMessage);
  }

  if (!data || !Array.isArray(data.competencySignals)) {
    throw new Error("CV parsing returned incomplete data.");
  }

  return data;
}
