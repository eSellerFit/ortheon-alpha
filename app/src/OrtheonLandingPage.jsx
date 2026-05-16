export default function OrtheonLandingPage() {
  const reportItems = [
    {
      title: "Career Direction Map",
      text: "A visual map showing where you are, which directions are credible now, which need a bridge step, and which are longer-path options.",
      accent: "#164E5A",
      tag: "Core output",
    },
    {
      title: "Credibility Status",
      text: "Each direction is rated: credible now, bridge path, or longer path — based on your actual profile, not what sounds good.",
      accent: "#2F7D5C",
      tag: "Per direction",
    },
    {
      title: "Financial Reality Signal",
      text: "Your directions are evaluated against your income floor and transition runway — not just final salary potential.",
      accent: "#B7791F",
      tag: "Per direction",
    },
    {
      title: "AI Durability Rating",
      text: "Each direction carries an AI durability signal — so you can see how the role may evolve as AI reshapes market demand.",
      accent: "#4B5F9E",
      tag: "Per direction",
    },
    {
      title: "Credibility Actions",
      text: "Concrete next steps: what evidence, positioning, bridge role, or credential would make each direction more believable to the market.",
      accent: "#1E2C3A",
      tag: "Actionable",
    },
    {
      title: "Downloadable Report",
      text: "Your full Career Direction Report is available online and as a PDF download — save it, print it, or share it with a mentor or advisor.",
      accent: "#164E5A",
      tag: "PDF download",
    },
  ];

  const lenses = [
    { label: "Career evidence", desc: "What does your career history already show the market?" },
    { label: "Market credibility", desc: "Would hiring managers believe this direction based on your profile?" },
    { label: "Career anchors", desc: "Does this direction fit what actually matters to you in work?" },
    { label: "Financial reality", desc: "Can this path work against your income floor and transition runway?" },
    { label: "Practical constraints", desc: "Is this realistic under your current life and work conditions?" },
    { label: "Credentials & gates", desc: "Does the path require licenses, certifications, or formal qualifications?" },
    { label: "AI durability", desc: "How may this direction change as AI reshapes the market?" },
    { label: "Direction calibration", desc: "Which paths are direct, bridge-based, nearby, or longer-term?" },
  ];

  const forYouItems = [
    "You have built a real career, but the next step is no longer obvious.",
    "You apply to roles where the system says you are a top candidate — and nothing happens.",
    "You appear qualified on paper, but the market does not always read your profile clearly.",
    "You are considering a pivot, consulting, advisory work, or entrepreneurship.",
    "You want to know what is credible now, what needs a bridge step, and what is a longer path.",
    "You want honest direction — not a personality quiz or generic career coaching.",
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#F8F6F2", color: "#1E2C3A", fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* NAV */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1200, margin: "0 auto", padding: "24px 32px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/ortheon-logo.png" alt="Ortheon" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "#1E2C3A", fontFamily: "'Georgia', serif" }}>
            Ortheon
          </span>
        </div>
        <a
          href="#start"
          style={{
            background: "#164E5A", color: "white", padding: "10px 22px",
            borderRadius: 100, fontSize: 14, fontWeight: 500, textDecoration: "none",
            fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.01em",
            transition: "background 0.2s"
          }}
        >
          Start Free Assessment
        </a>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64,
          alignItems: "center"
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "white", border: "1px solid #E2DED6",
              borderRadius: 100, padding: "6px 14px", marginBottom: 28
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2F7D5C" }} />
              <span style={{
                fontSize: 12, color: "#5F6875", fontFamily: "'Helvetica Neue', Arial, sans-serif",
                letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500
              }}>
                Free during Alpha · No credit card
              </span>
            </div>

            <h1 style={{
              fontSize: 52, fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.025em",
              color: "#1E2C3A", margin: "0 0 12px", fontFamily: "'Georgia', 'Times New Roman', serif"
            }}>
              Sending more applications is not the same as
            </h1>
            <h1 style={{
              fontSize: 52, fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.025em",
              color: "#164E5A", margin: "0 0 28px", fontFamily: "'Georgia', 'Times New Roman', serif",
              fontStyle: "italic"
            }}>
              moving in the right direction.
            </h1>

            <p style={{
              fontSize: 18, lineHeight: 1.7, color: "#5F6875", margin: "0 0 36px",
              fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 400, maxWidth: 480
            }}>
              Ortheon evaluates your next career direction through eight decision lenses — your career evidence, market credibility, anchors, financial reality, constraints, credentials, and AI durability.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a
                href="#start"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "#1E2C3A", color: "white",
                  padding: "16px 32px", borderRadius: 100,
                  fontSize: 15, fontWeight: 500, textDecoration: "none",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.01em",
                  width: "fit-content"
                }}
              >
                Start My Free Career Direction Assessment →
              </a>
              <p style={{
                fontSize: 13, color: "#8A97A5", margin: 0,
                fontFamily: "'Helvetica Neue', Arial, sans-serif"
              }}>
                Complete the assessment and receive your Career Direction Report.
              </p>
            </div>
          </div>

          {/* HERO CARD — real report preview */}
          <div style={{
            background: "white", borderRadius: 24, border: "1px solid #E2DED6",
            padding: 6, boxShadow: "0 32px 80px rgba(30,44,58,0.10)"
          }}>
            <div style={{ background: "#F4F3EF", borderRadius: 20, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <p style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "#8A97A5", margin: "0 0 4px",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif"
                  }}>Career Direction Map</p>
                  <p style={{
                    fontSize: 13, color: "#1E2C3A", margin: 0,
                    fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 500
                  }}>Sample output · anonymized</p>
                </div>
                <span style={{
                  background: "#E7F1F2", color: "#164E5A", fontSize: 11,
                  fontWeight: 600, padding: "4px 10px", borderRadius: 100,
                  fontFamily: "'Helvetica Neue', Arial, sans-serif"
                }}>Live product</span>
              </div>

              {/* Map preview */}
              <div style={{
                background: "white", borderRadius: 16, border: "1px solid #E2DED6",
                padding: 20, marginBottom: 12
              }}>
                {/* You are here */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{
                    background: "#E7F1F2", border: "1.5px solid #164E5A", borderRadius: 12,
                    padding: "8px 16px", textAlign: "center"
                  }}>
                    <p style={{ fontSize: 10, color: "#164E5A", margin: "0 0 2px", fontFamily: "sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>You are here</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1E2C3A", margin: 0, fontFamily: "sans-serif" }}>Current profile</p>
                  </div>
                  <div style={{ width: 1, height: 20, background: "#CBD5E0" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
                    <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2F7D5C" }} />
                        <span style={{ fontSize: 10, color: "#2F7D5C", fontWeight: 600, fontFamily: "sans-serif" }}>Credible now</span>
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#1E2C3A", margin: "0 0 2px", fontFamily: "sans-serif" }}>HR & People Ops</p>
                      <p style={{ fontSize: 11, color: "#5F6875", margin: 0, fontFamily: "sans-serif" }}>Score 93</p>
                    </div>
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B7791F" }} />
                        <span style={{ fontSize: 10, color: "#B7791F", fontWeight: 600, fontFamily: "sans-serif" }}>Bridge path</span>
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#1E2C3A", margin: "0 0 2px", fontFamily: "sans-serif" }}>Workforce Planning</p>
                      <p style={{ fontSize: 11, color: "#5F6875", margin: 0, fontFamily: "sans-serif" }}>Score 98</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signal strip */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "AI Durability", value: "D2 — Viable", color: "#164E5A", bg: "#E7F1F2" },
                  { label: "Income signal", value: "$88,000 est.", color: "#1E2C3A", bg: "#F4F3EF" },
                  { label: "Transition", value: "Direct path", color: "#2F7D5C", bg: "#F0FDF4" },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "8px 10px" }}>
                    <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A97A5", margin: "0 0 3px", fontFamily: "sans-serif" }}>{s.label}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: s.color, margin: 0, fontFamily: "sans-serif" }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IS THIS FOR YOU */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#164E5A", margin: "0 0 12px", fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>Is this for you?</p>
            <h2 style={{
              fontSize: 38, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15,
              color: "#1E2C3A", margin: "0 0 16px", fontFamily: "'Georgia', serif"
            }}>
              Built for people making a serious career direction decision.
            </h2>
            <p style={{
              fontSize: 17, lineHeight: 1.7, color: "#5F6875", margin: 0,
              fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>
              Ortheon is not for finding any next job. It is for understanding which directions are credible, realistic, and worth pursuing — and which ones need more groundwork first.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {forYouItems.map((item, i) => (
              <div key={i} style={{
                background: "#F8F6F2", border: "1px solid #E2DED6", borderRadius: 20,
                padding: "28px 24px"
              }}>
                <div style={{ width: 32, height: 2, background: "#164E5A", borderRadius: 2, marginBottom: 20 }} />
                <p style={{
                  fontSize: 15, lineHeight: 1.65, color: "#1E2C3A", margin: 0,
                  fontFamily: "'Helvetica Neue', Arial, sans-serif"
                }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU RECEIVE */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 64, alignItems: "start" }}>
            <div style={{ position: "sticky", top: 32 }}>
              <p style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#164E5A", margin: "0 0 12px", fontFamily: "'Helvetica Neue', Arial, sans-serif"
              }}>What you receive</p>
              <h2 style={{
                fontSize: 38, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15,
                color: "#1E2C3A", margin: "0 0 20px", fontFamily: "'Georgia', serif"
              }}>
                A structured report, not a list of job titles.
              </h2>
              <p style={{
                fontSize: 17, lineHeight: 1.7, color: "#5F6875", margin: 0,
                fontFamily: "'Helvetica Neue', Arial, sans-serif"
              }}>
                Your report shows how your profile reads across several career directions — including credibility status, financial signal, AI durability, and transition path.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {reportItems.map((item) => (
                <div key={item.title} style={{
                  background: "white", border: "1px solid #E2DED6", borderRadius: 20,
                  padding: "24px", overflow: "hidden"
                }}>
                  <div style={{ width: 40, height: 3, background: item.accent, borderRadius: 2, marginBottom: 20 }} />
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                    <h3 style={{
                      fontSize: 16, fontWeight: 600, color: "#1E2C3A", margin: 0,
                      fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.01em"
                    }}>{item.title}</h3>
                    <span style={{
                      fontSize: 10, color: "#8A97A5", background: "#F4F3EF",
                      padding: "3px 8px", borderRadius: 100, whiteSpace: "nowrap", flexShrink: 0,
                      fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 500
                    }}>{item.tag}</span>
                  </div>
                  <p style={{
                    fontSize: 14, lineHeight: 1.65, color: "#5F6875", margin: 0,
                    fontFamily: "'Helvetica Neue', Arial, sans-serif"
                  }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REAL REPORT PREVIEW */}
      <section style={{ background: "#1E2C3A", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#7DBDC8", margin: "0 0 12px", fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>Real report</p>
            <h2 style={{
              fontSize: 38, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15,
              color: "white", margin: "0 0 16px", fontFamily: "'Georgia', serif"
            }}>
              This is what the output actually looks like.
            </h2>
            <p style={{
              fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", margin: 0,
              fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>
              Anonymized screenshots from a real Career Direction Report — generated by the live product.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Direction card preview */}
            <div style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20, padding: 24
            }}>
              <p style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#7DBDC8", margin: "0 0 16px", fontFamily: "sans-serif"
              }}>Direction card</p>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 10, color: "#7DBDC8", margin: "0 0 6px", fontFamily: "sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>1st Direction</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "white", margin: 0, fontFamily: "sans-serif" }}>Talent Acquisition / People Ops</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", margin: "0 0 2px", fontFamily: "sans-serif" }}>Total score</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: "white", margin: 0, fontFamily: "sans-serif" }}>93</p>
                  </div>
                </div>
                <div style={{ display: "inline-block", background: "#E7F1F2", borderRadius: 8, padding: "6px 12px", marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#164E5A", margin: 0, fontFamily: "sans-serif" }}>Credible now</p>
                  <p style={{ fontSize: 11, color: "#164E5A", opacity: 0.7, margin: 0, fontFamily: "sans-serif" }}>Direct transition with existing background</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Fit band", value: "Strong Fit" },
                    { label: "AI Durability", value: "D2 — Viable" },
                    { label: "Transition", value: "Direct path" },
                    { label: "Est. income", value: "$88,000" },
                  ].map(f => (
                    <div key={f.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px" }}>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: "0 0 3px", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: 0, fontFamily: "sans-serif" }}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What drove results */}
            <div style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20, padding: 24
            }}>
              <p style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#7DBDC8", margin: "0 0 16px", fontFamily: "sans-serif"
              }}>What drove these results</p>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "white", margin: "0 0 8px", fontFamily: "sans-serif" }}>Career anchors</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Autonomy / Independence", "General Managerial", "Service"].map(a => (
                      <span key={a} style={{
                        background: "rgba(255,255,255,0.1)", borderRadius: 100,
                        padding: "3px 10px", fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif"
                      }}>{a}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "white", margin: "0 0 8px", fontFamily: "sans-serif" }}>CV / credibility signals</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Human Resources", "Operations", "Consulting", "Technology"].map(a => (
                      <span key={a} style={{
                        background: "rgba(22,78,90,0.5)", borderRadius: 100,
                        padding: "3px 10px", fontSize: 11, color: "#7DBDC8", fontFamily: "sans-serif"
                      }}>{a}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: "0 0 3px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Seniority</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: 0, fontFamily: "sans-serif" }}>Executive</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: "0 0 3px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Runway</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: 0, fontFamily: "sans-serif" }}>5 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#EEF2F5", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#164E5A", margin: "0 0 12px", fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>How it works</p>
            <h2 style={{
              fontSize: 38, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15,
              color: "#1E2C3A", margin: "0 0 16px", fontFamily: "'Georgia', serif"
            }}>
              Each direction is evaluated through eight decision lenses.
            </h2>
            <p style={{
              fontSize: 17, lineHeight: 1.7, color: "#5F6875", margin: 0,
              fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>
              Ortheon does not match your CV to job titles. It tests possible directions through multiple lenses and calibrates results based on how the signals work together.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {lenses.map((lens, i) => (
              <div key={lens.label} style={{
                background: "white", borderRadius: 20, padding: 24
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: "#1E2C3A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20, fontSize: 13, fontWeight: 600, color: "white",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif"
                }}>{i + 1}</div>
                <h3 style={{
                  fontSize: 15, fontWeight: 600, color: "#1E2C3A", margin: "0 0 10px",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.01em"
                }}>{lens.label}</h3>
                <p style={{
                  fontSize: 13, lineHeight: 1.6, color: "#5F6875", margin: 0,
                  fontFamily: "'Helvetica Neue', Arial, sans-serif"
                }}>{lens.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
              <img
                src="/gio.jpg"
                alt="George Chakhidze"
                style={{
                  width: 96, height: 96, borderRadius: "50%", objectFit: "cover",
                  objectPosition: "center top", flexShrink: 0,
                  border: "3px solid #E2DED6"
                }}
              />
              <div>
                <p style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#164E5A", margin: "0 0 8px", fontFamily: "'Helvetica Neue', Arial, sans-serif"
                }}>Built by</p>
                <h3 style={{
                  fontSize: 22, fontWeight: 400, color: "#1E2C3A", margin: "0 0 4px",
                  fontFamily: "'Georgia', serif", letterSpacing: "-0.01em"
                }}>George Chakhidze</h3>
                <p style={{
                  fontSize: 14, color: "#8A97A5", margin: 0,
                  fontFamily: "'Helvetica Neue', Arial, sans-serif"
                }}>Talent & Workforce Systems · New York</p>
              </div>
            </div>

            <div>
              <p style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#164E5A", margin: "0 0 20px", fontFamily: "'Helvetica Neue', Arial, sans-serif"
              }}>Why this exists</p>
              <blockquote style={{
                fontSize: 22, fontWeight: 400, lineHeight: 1.55, color: "#1E2C3A",
                fontFamily: "'Georgia', serif", fontStyle: "italic",
                borderLeft: "3px solid #164E5A", paddingLeft: 24, margin: "0 0 24px"
              }}>
                "I spent 18 years on the other side of the hiring table. Recruiting operations, succession planning, workforce decisions — at PepsiCo, Abbott, Kelly, and as co-founder of a workforce marketplace."
              </blockquote>
              <p style={{
                fontSize: 17, lineHeight: 1.7, color: "#5F6875", margin: 0,
                fontFamily: "'Helvetica Neue', Arial, sans-serif"
              }}>
                I built Ortheon because the tools candidates use to make career decisions are far less rigorous than the ones organizations use to evaluate them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="start" style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>
          <div style={{
            background: "#1E2C3A", borderRadius: 32, padding: "64px 56px",
            textAlign: "center", boxShadow: "0 32px 80px rgba(30,44,58,0.18)"
          }}>
            <h2 style={{
              fontSize: 42, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.1,
              color: "white", margin: "0 0 20px", fontFamily: "'Georgia', serif"
            }}>
              Start your free Career Direction Assessment.
            </h2>
            <p style={{
              fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.65)",
              margin: "0 auto 36px", maxWidth: 500,
              fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>
              Receive your Career Direction Map, credibility status, financial signal, AI durability ratings, and the evidence behind the result.
            </p>
            <a
              href="/assessment"
              style={{
                display: "inline-flex", alignItems: "center",
                background: "white", color: "#164E5A",
                padding: "16px 36px", borderRadius: 100,
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.01em"
              }}
            >
              Start My Free Career Direction Assessment →
            </a>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "20px 0 0",
              fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>
              Free during Alpha. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* FEEDBACK FORM */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#164E5A", margin: "0 0 12px", fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>Feedback</p>
            <h2 style={{
              fontSize: 38, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15,
              color: "#1E2C3A", margin: "0 0 16px", fontFamily: "'Georgia', serif"
            }}>
              Something unclear or missing? Let us know.
            </h2>
            <p style={{
              fontSize: 17, lineHeight: 1.7, color: "#5F6875", margin: 0,
              fontFamily: "'Helvetica Neue', Arial, sans-serif"
            }}>
              Ortheon is in Alpha. If something feels off, inaccurate, or useful, send it directly to George. Every message is read.
            </p>
          </div>

          <form
            action="https://formspree.io/f/mjglnnql"
            method="POST"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{
                  fontSize: 12, fontWeight: 600, color: "#1E2C3A",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "0.02em"
                }}>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  style={{
                    background: "#F8F6F2", border: "1px solid #E2DED6",
                    borderRadius: 12, padding: "12px 16px",
                    fontSize: 15, color: "#1E2C3A", outline: "none",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif"
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{
                  fontSize: 12, fontWeight: 600, color: "#1E2C3A",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "0.02em"
                }}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  style={{
                    background: "#F8F6F2", border: "1px solid #E2DED6",
                    borderRadius: 12, padding: "12px 16px",
                    fontSize: 15, color: "#1E2C3A", outline: "none",
                    fontFamily: "'Helvetica Neue', Arial, sans-serif"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{
                fontSize: 12, fontWeight: 600, color: "#1E2C3A",
                fontFamily: "'Helvetica Neue', Arial, sans-serif", letterSpacing: "0.02em"
              }}>Message</label>
              <textarea
                name="message"
                placeholder="What was unclear, missing, or useful?"
                rows={5}
                style={{
                  background: "#F8F6F2", border: "1px solid #E2DED6",
                  borderRadius: 12, padding: "12px 16px",
                  fontSize: 15, color: "#1E2C3A", outline: "none",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  resize: "vertical", lineHeight: 1.6
                }}
              />
            </div>

            <div>
              <button
                type="submit"
                style={{
                  background: "#1E2C3A", color: "white",
                  border: "none", borderRadius: 100,
                  padding: "14px 32px", fontSize: 15, fontWeight: 500,
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  cursor: "pointer", letterSpacing: "-0.01em"
                }}
              >
                Send Feedback →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #E2DED6", padding: "32px 0" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/ortheon-logo.png" alt="Ortheon" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1E2C3A", fontFamily: "'Georgia', serif" }}>Ortheon</span>
          </div>
          <p style={{ fontSize: 13, color: "#8A97A5", margin: 0, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            © 2026 eSellerFit LLC · ortheon.app
          </p>
        </div>
      </footer>

    </main>
  );
}
