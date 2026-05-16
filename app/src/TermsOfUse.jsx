export default function TermsOfUse() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F6F2", color: "#1E2C3A", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1200, margin: "0 auto", padding: "24px 32px",
        borderBottom: "1px solid #E2DED6"
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/ortheon-logo.png" alt="Ortheon" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "#1E2C3A", fontFamily: "'Georgia', serif" }}>
            Ortheon
          </span>
        </a>
        <a href="/" style={{
          fontSize: 14, color: "#5F6875", textDecoration: "none",
          fontFamily: "'Helvetica Neue', Arial, sans-serif"
        }}>← Back to home</a>
      </nav>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 96px" }}>

        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#164E5A", margin: "0 0 12px"
          }}>Legal</p>
          <h1 style={{
            fontSize: 42, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.1,
            color: "#1E2C3A", margin: "0 0 16px", fontFamily: "'Georgia', serif"
          }}>Terms of Use</h1>
          <p style={{ fontSize: 15, color: "#8A97A5", margin: 0 }}>
            Last updated: May 2026 · Ortheon Alpha · eSellerFit LLC
          </p>
        </div>

        {[
          {
            title: "1. About Ortheon",
            body: `Ortheon is a career direction assessment tool operated by eSellerFit LLC. It helps adults evaluate possible next career directions based on their background, career anchors, financial situation, and practical constraints.

By using Ortheon, you agree to these Terms of Use. If you do not agree, please do not use the service.`
          },
          {
            title: "2. Nature of the service",
            body: `Ortheon provides structured decision-support information. It is not a substitute for professional career counseling, legal advice, financial advice, or any other regulated professional service.

The Career Direction Report you receive reflects an algorithmic assessment based on the information you provide. It is intended to inform your thinking — not to make decisions for you.

Ortheon does not guarantee employment, career outcomes, income levels, or the accuracy of market data. All role data, salary estimates, and AI durability signals are based on available market information and are subject to change.`
          },
          {
            title: "3. Alpha product disclaimer",
            body: `Ortheon is currently in Alpha. This means:

— The product is functional but still being tested and improved.
— Recommendations may not always be accurate or complete.
— Features may change, be added, or be removed without notice.
— The service may occasionally be unavailable due to maintenance or technical issues.

By using Ortheon during Alpha, you acknowledge that you are using an early-stage product and that your feedback helps improve it.`
          },
          {
            title: "4. Your responsibilities",
            body: `You agree to:

— Provide accurate information during the assessment. The quality of your Career Direction Report depends on the accuracy of your inputs.
— Use Ortheon for personal, non-commercial career direction purposes only.
— Not attempt to reverse-engineer, copy, or reproduce the assessment methodology, scoring logic, or role library.
— Not use Ortheon to submit false, misleading, or harmful content.`
          },
          {
            title: "5. Intellectual property",
            body: `All content, methodology, scoring logic, role library, and visual design within Ortheon are the property of eSellerFit LLC. You may not reproduce, distribute, or create derivative works from any part of Ortheon without explicit written permission.

Your Career Direction Report is yours to use for personal career decision-making. You may share it with advisors, mentors, or coaches. You may not publish it commercially or represent it as independent research.`
          },
          {
            title: "6. Limitation of liability",
            body: `Ortheon provides information to support your career decisions. You are solely responsible for the decisions you make based on that information.

eSellerFit LLC is not liable for any career outcomes, income changes, employment decisions, or other consequences arising from your use of Ortheon or your Career Direction Report.

To the maximum extent permitted by applicable law, eSellerFit LLC's total liability for any claim arising from your use of Ortheon is limited to the amount you paid for the service. During Alpha, as the service is free, this limit is zero.`
          },
          {
            title: "7. Privacy",
            body: `Your use of Ortheon is also governed by our Privacy Policy, available at ortheon.app/privacy. By using Ortheon, you agree to the collection and use of your data as described in that policy.`
          },
          {
            title: "8. Termination",
            body: `We reserve the right to suspend or terminate access to Ortheon at any time, with or without notice, if we believe these Terms of Use have been violated or if the service is being misused.

You may stop using Ortheon at any time. To request deletion of your data, see our Privacy Policy.`
          },
          {
            title: "9. Changes to these terms",
            body: `We may update these Terms of Use as the product evolves. When we make material changes, we will update the date at the top of this page. Continued use of Ortheon after changes are posted constitutes acceptance of the updated terms.`
          },
          {
            title: "10. Governing law",
            body: `These Terms of Use are governed by the laws of the State of New York, United States, without regard to conflict of law principles.`
          },
          {
            title: "11. Contact",
            body: `For any questions about these Terms of Use, contact us at:

ortheon@esellerfit.com
eSellerFit LLC · New York, NY`
          },
        ].map((section) => (
          <section key={section.title} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 20, fontWeight: 600, color: "#1E2C3A",
              margin: "0 0 12px", letterSpacing: "-0.01em"
            }}>{section.title}</h2>
            <div style={{
              fontSize: 16, lineHeight: 1.75, color: "#3D4E5E",
              whiteSpace: "pre-line"
            }}>{section.body}</div>
            <div style={{ height: 1, background: "#E2DED6", marginTop: 40 }} />
          </section>
        ))}

      </article>
    </main>
  );
}
