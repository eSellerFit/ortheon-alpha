/**
 * Ortheon MVP Cut v3.1 — PDF Report Layout
 *
 * Bundle 23B.2 — dedicated static layout for PDF capture.
 * PDF export uses a dedicated static layout, not the interactive browser
 * preview, to prevent page breaks and accordion issues.
 *
 * Rules:
 * - Pure React. No Firestore. No AI. No external libraries.
 * - Inline styles only — no CSS class dependencies on App.css.
 * - No interactive elements (no accordions, no expand/collapse).
 * - No hub-and-spoke SVG map — text-only direction list instead.
 * - All content always visible — static snapshot for html2canvas capture.
 * - aria-hidden="true" — not part of the accessible document tree.
 */

// ── Page base style ────────────────────────────────────────────────────────────

const PAGE = {
  width: "794px",
  padding: "40px 52px 52px",
  boxSizing: "border-box",
  background: "#ffffff",
  fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontSize: "13px",
  color: "#111827",
  lineHeight: "1.5",
};

// ── Shared helpers ─────────────────────────────────────────────────────────────

const WORK_MODEL_LABELS = {
  consulting_fractional: "Consulting / Fractional",
  interim_fractional: "Interim / Fractional",
  enterprise_employment: "Employed (Full-Time)",
  full_time_employment: "Employed (Full-Time)",
  consulting_advisory: "Consulting / Advisory",
  freelance: "Freelance",
  portfolio_career: "Portfolio Career",
  entrepreneurial_operator: "Entrepreneur / Founder",
  founder: "Entrepreneur / Founder",
  technical_specialist: "Technical Specialist",
  operations_leadership: "Operations Leadership",
  education_training: "Education / Training",
  nonprofit_public: "Non-Profit / Public Sector",
  regulated_profession: "Regulated Profession",
};

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function safeStr(v) {
  return typeof v === "string" ? v : "";
}

// ── Shared primitives ──────────────────────────────────────────────────────────

function PdfSectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#374151",
        borderBottom: "1px solid #e5e7eb",
        paddingBottom: "5px",
        marginTop: "22px",
        marginBottom: "10px",
      }}
    >
      {children}
    </div>
  );
}

function PdfBulletList({ items }) {
  const arr = safeArray(items);
  if (!arr.length) return null;
  return (
    <ul style={{ margin: "0 0 0 16px", padding: 0, lineHeight: "1.6", fontSize: "12px", color: "#374151" }}>
      {arr.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function PdfBadge({ label, bgColor, textColor }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 7px",
        borderRadius: "100px",
        fontSize: "11px",
        fontWeight: "600",
        background: bgColor || "#f1f5f9",
        color: textColor || "#475569",
        marginRight: "4px",
        marginBottom: "3px",
      }}
    >
      {label}
    </span>
  );
}

// ── Badge helpers ──────────────────────────────────────────────────────────────

const STATUS_BADGE_THEMES = {
  "credible now":               { bg: "#dcfce7", color: "#166534" },
  "credible now, with caution": { bg: "#fef3c7", color: "#92400e" },
  "bridge required":            { bg: "#fef9c3", color: "#78350f" },
  "secondary option":           { bg: "#e0f2fe", color: "#0369a1" },
  exploratory:                  { bg: "#ede9fe", color: "#5b21b6" },
  "not now":                    { bg: "#f1f5f9", color: "#475569" },
};

const CONF_BADGE_THEMES = {
  high:              { bg: "#dcfce7", color: "#166534" },
  medium:            { bg: "#fef3c7", color: "#92400e" },
  low:               { bg: "#fee2e2", color: "#991b1b" },
  insufficient_data: { bg: "#f1f5f9", color: "#64748b" },
};

function PdfStatusBadge({ status }) {
  if (!status) return null;
  const theme = STATUS_BADGE_THEMES[String(status).toLowerCase()] || {};
  return <PdfBadge label={status} bgColor={theme.bg} textColor={theme.color} />;
}

function PdfConfidenceBadge({ confidence }) {
  if (!confidence) return null;
  const theme = CONF_BADGE_THEMES[String(confidence).toLowerCase()] || {};
  return (
    <PdfBadge
      label={confidence + " confidence"}
      bgColor={theme.bg}
      textColor={theme.color}
    />
  );
}

// ── Page 1: Cover + direction overview ────────────────────────────────────────

function PdfPage1({ cover, compactDirectionCards, generatedAt }) {
  const dateStr = generatedAt
    ? new Date(generatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const cards = safeArray(compactDirectionCards);

  return (
    <div data-v31-pdf-page="true" style={PAGE}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
          borderBottom: "2px solid #245f73",
          paddingBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "800",
              color: "#111",
              letterSpacing: "0.02em",
            }}
          >
            Ortheon
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginTop: "2px",
            }}
          >
            Career Direction Report
          </div>
        </div>
        {dateStr && (
          <div style={{ fontSize: "11px", color: "#9ca3af", textAlign: "right" }}>
            {dateStr}
          </div>
        )}
      </div>

      {/* Headline */}
      {cover?.headline && (
        <div
          style={{
            fontSize: "22px",
            fontWeight: "700",
            lineHeight: "1.3",
            color: "#111",
            marginBottom: "20px",
          }}
        >
          {cover.headline}
        </div>
      )}

      {/* Recommended Strategy */}
      {cover?.recommendedStrategy && (
        <div
          style={{
            background: "#f0f7fa",
            border: "1px solid #b0d0dc",
            borderLeft: "4px solid #245f73",
            borderRadius: "8px",
            padding: "14px 18px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#245f73",
              marginBottom: "6px",
            }}
          >
            → Recommended strategy
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#111",
              lineHeight: "1.55",
              fontWeight: "500",
            }}
          >
            {cover.recommendedStrategy}
          </div>
        </div>
      )}

      {/* Main Tension */}
      {cover?.mainTension && (
        <div
          style={{
            background: "#f0f7fa",
            border: "1px solid #b0d0dc",
            borderLeft: "4px solid #245f73",
            borderRadius: "8px",
            padding: "14px 18px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#245f73",
              marginBottom: "6px",
            }}
          >
            ⊘ Main tension
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#111",
              lineHeight: "1.55",
              fontWeight: "500",
            }}
          >
            {cover.mainTension}
          </div>
        </div>
      )}

      {/* Direction overview */}
      {cards.length > 0 && (
        <>
          <PdfSectionTitle>Direction overview</PdfSectionTitle>
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                padding: "10px 0",
                borderBottom:
                  i < cards.length - 1 ? "1px solid #f3f4f6" : "none",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  minWidth: "20px",
                  paddingTop: "2px",
                  flexShrink: 0,
                }}
              >
                #{card.displayOrder}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#111",
                    marginBottom: "5px",
                  }}
                >
                  {card.label}
                </div>
                <div>
                  <PdfStatusBadge status={card.status} />
                  <PdfConfidenceBadge confidence={card.confidence} />
                  {card.routeType && (
                    <PdfBadge
                      label={card.routeType}
                      bgColor="#eff6ff"
                      textColor="#1d4ed8"
                    />
                  )}
                  {card.aiDurability?.rating && (
                    <PdfBadge
                      label={`AI ${card.aiDurability.rating}`}
                      bgColor="#f0fdf4"
                      textColor="#166534"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Page 2: Direction details ──────────────────────────────────────────────────

function PdfPage2({ compactDirectionCards, primaryDirectionDeepDive }) {
  const cards = safeArray(compactDirectionCards);
  const primaryDeepExists = !!primaryDirectionDeepDive;

  return (
    <div data-v31-pdf-page="true" style={PAGE}>
      <div
        style={{
          fontSize: "15px",
          fontWeight: "800",
          color: "#111",
          marginBottom: "18px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "10px",
        }}
      >
        Your Directions
      </div>

      {cards.map((card, i) => {
        const isPrimary = i === 0 && primaryDeepExists;
        const deep = isPrimary ? primaryDirectionDeepDive : null;

        return (
          <div
            key={i}
            style={{
              border: "1px solid #e5e7eb",
              borderLeft: isPrimary ? "4px solid #16a34a" : "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "14px 16px",
              marginBottom: "12px",
              background: "#fff",
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "#111",
                  flex: 1,
                  lineHeight: "1.3",
                }}
              >
                {card.label}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginLeft: "8px",
                  flexShrink: 0,
                }}
              >
                #{card.displayOrder}
              </span>
            </div>

            {/* Badges */}
            <div style={{ marginBottom: "8px" }}>
              <PdfStatusBadge status={card.status} />
              <PdfConfidenceBadge confidence={card.confidence} />
              {card.routeType && (
                <PdfBadge
                  label={card.routeType}
                  bgColor="#eff6ff"
                  textColor="#1d4ed8"
                />
              )}
              {card.workModel && (
                <PdfBadge
                  label={WORK_MODEL_LABELS[card.workModel] ?? card.workModel}
                  bgColor="#f5f3ff"
                  textColor="#6d28d9"
                />
              )}
              {card.aiDurability?.rating && (
                <PdfBadge
                  label={
                    card.aiDurability.label
                      ? `AI ${card.aiDurability.rating} · ${card.aiDurability.label}`
                      : `AI ${card.aiDurability.rating}`
                  }
                  bgColor="#f0fdf4"
                  textColor="#166534"
                />
              )}
            </div>

            {card.whyThisIsHere && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#374151",
                  marginBottom: "6px",
                  lineHeight: "1.55",
                }}
              >
                {card.whyThisIsHere}
              </div>
            )}

            {card.mainRisk && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#b45309",
                  marginBottom: "6px",
                  lineHeight: "1.5",
                }}
              >
                <strong style={{ fontWeight: "600" }}>Risk:</strong>{" "}
                {card.mainRisk}
              </div>
            )}

            {card.firstValidationStep && (
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#1d4ed8",
                    marginBottom: "3px",
                  }}
                >
                  First validation step
                </div>
                <div style={{ fontSize: "12px", color: "#1e40af" }}>
                  {card.firstValidationStep}
                </div>
              </div>
            )}

            {safeArray(card.targetRoleExamples).length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#6b7280",
                    marginBottom: "5px",
                  }}
                >
                  Target role examples
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {card.targetRoleExamples.map((r, ri) => (
                    <span
                      key={ri}
                      style={{
                        background: "#f4f3f1",
                        border: "1px solid #e2e0da",
                        borderRadius: "3px",
                        padding: "2px 7px",
                        fontSize: "11px",
                        color: "#374151",
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Primary direction extra detail */}
            {isPrimary && deep && (
              <>
                {safeArray(deep.whyItFits).length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "#6b7280",
                        marginBottom: "5px",
                      }}
                    >
                      Why it fits
                    </div>
                    <PdfBulletList items={deep.whyItFits} />
                  </div>
                )}
                {safeArray(deep.whatMakesItRisky).length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "#6b7280",
                        marginBottom: "5px",
                      }}
                    >
                      Main risks
                    </div>
                    <PdfBulletList items={deep.whatMakesItRisky} />
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Page 3: 30-day validation plan ────────────────────────────────────────────

function PdfPage3({ validationPlan }) {
  const plan = validationPlan || {};
  const next30 = safeArray(plan.next30Days);
  const evidence = safeArray(plan.evidenceToBuild);
  const decisions = safeArray(plan.decisionsToMake);
  const conversations = safeArray(plan.conversationsToHave);

  return (
    <div data-v31-pdf-page="true" style={PAGE}>
      <div
        style={{
          fontSize: "15px",
          fontWeight: "800",
          color: "#111",
          marginBottom: "18px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "10px",
        }}
      >
        What to do in the next 30 days
      </div>

      {next30.map((action, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "12px",
            padding: "12px 14px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "7px",
            marginBottom: "8px",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "#245f73",
              color: "#fff",
              fontSize: "10px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
          <span
            style={{
              fontSize: "13px",
              color: "#111",
              lineHeight: "1.55",
              fontWeight: "500",
            }}
          >
            {action}
          </span>
        </div>
      ))}

      {evidence.length > 0 && (
        <>
          <PdfSectionTitle>Evidence to build</PdfSectionTitle>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderLeft: "3px solid #245f73",
              borderRadius: "7px",
              padding: "12px 14px",
            }}
          >
            <PdfBulletList items={evidence} />
          </div>
        </>
      )}

      {decisions.length > 0 && (
        <>
          <PdfSectionTitle>Decisions to make</PdfSectionTitle>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderLeft: "3px solid #92400e",
              borderRadius: "7px",
              padding: "12px 14px",
            }}
          >
            <PdfBulletList items={decisions} />
          </div>
        </>
      )}

      {conversations.length > 0 && (
        <>
          <PdfSectionTitle>Conversations to have</PdfSectionTitle>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderLeft: "3px solid #6366f1",
              borderRadius: "7px",
              padding: "12px 14px",
            }}
          >
            <PdfBulletList items={conversations} />
          </div>
        </>
      )}
    </div>
  );
}

// ── Page 4: Input signals + confidence & limitations ──────────────────────────

function PdfPage4({ inputSignalCards, confidenceNotes }) {
  const cards = safeArray(inputSignalCards);
  const notes = confidenceNotes || {};
  const caveats = safeArray(notes.caveats);
  const missingEvidence = safeArray(notes.missingEvidence);
  const lowConfidenceReasons = safeArray(notes.lowConfidenceReasons);
  const hasConfidenceNotes =
    caveats.length > 0 ||
    missingEvidence.length > 0 ||
    lowConfidenceReasons.length > 0;

  return (
    <div data-v31-pdf-page="true" style={PAGE}>
      {cards.length > 0 && (
        <>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "800",
              color: "#111",
              marginBottom: "14px",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "10px",
            }}
          >
            Your Input Signals
          </div>

          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                marginBottom: "10px",
                padding: "10px 14px",
                border: "1px solid #e5e7eb",
                borderLeft: "3px solid #245f73",
                borderRadius: "7px",
                background: "#fff",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "12px",
                  color: "#111",
                  marginBottom: "5px",
                }}
              >
                {card.title}
              </div>
              {card.signal && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#374151",
                    marginBottom: "3px",
                    lineHeight: "1.5",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      textTransform: "uppercase",
                      fontSize: "10px",
                      letterSpacing: "0.07em",
                      color: "#6b7280",
                    }}
                  >
                    Signal:{" "}
                  </span>
                  {card.signal}
                </div>
              )}
              {card.interpretation && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#374151",
                    lineHeight: "1.5",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      textTransform: "uppercase",
                      fontSize: "10px",
                      letterSpacing: "0.07em",
                      color: "#6b7280",
                    }}
                  >
                    Interpretation:{" "}
                  </span>
                  {card.interpretation}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {hasConfidenceNotes && (
        <>
          <PdfSectionTitle>Confidence and limitations</PdfSectionTitle>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderLeft: "3px solid #245f73",
              borderRadius: "7px",
              padding: "14px 16px",
            }}
          >
            {missingEvidence.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#374151",
                    marginBottom: "5px",
                  }}
                >
                  Missing evidence
                </div>
                <PdfBulletList items={missingEvidence} />
              </div>
            )}
            {lowConfidenceReasons.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#374151",
                    marginBottom: "5px",
                  }}
                >
                  Why some directions show lower confidence
                </div>
                <PdfBulletList items={lowConfidenceReasons} />
              </div>
            )}
            {caveats.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#374151",
                    marginBottom: "5px",
                  }}
                >
                  Additional caveats
                </div>
                <PdfBulletList items={caveats} />
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "36px",
          fontSize: "10px",
          color: "#d1d5db",
          textAlign: "center",
        }}
      >
        Ortheon v3.1 · Career Direction Report
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function V31PdfReportLayout({ vm, containerRef }) {
  if (!vm) return null;

  const {
    cover,
    compactDirectionCards,
    primaryDirectionDeepDive,
    validationPlan,
    inputSignalCards,
    confidenceNotes,
    generatedAt,
  } = vm;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: "-9999px",
        width: "794px",
        background: "#ffffff",
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <PdfPage1
        cover={cover}
        compactDirectionCards={compactDirectionCards}
        generatedAt={generatedAt}
      />
      <PdfPage2
        compactDirectionCards={compactDirectionCards}
        primaryDirectionDeepDive={primaryDirectionDeepDive}
      />
      <PdfPage3 validationPlan={validationPlan} />
      <PdfPage4
        inputSignalCards={inputSignalCards}
        confidenceNotes={confidenceNotes}
      />
    </div>
  );
}
