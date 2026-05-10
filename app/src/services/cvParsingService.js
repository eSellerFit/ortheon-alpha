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
    throw new Error(
      data?.error || "CV parsing failed. Please try again."
    );
  }

  if (!data || !Array.isArray(data.competencySignals)) {
    throw new Error("CV parsing returned incomplete data.");
  }

  return data;
}
