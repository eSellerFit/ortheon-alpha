export default function PrivacyPolicy() {
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
          }}>Privacy Policy</h1>
          <p style={{ fontSize: 15, color: "#8A97A5", margin: 0 }}>
            Last updated: May 2026 · Ortheon Alpha · eSellerFit LLC
          </p>
        </div>

        {[
          {
            title: "1. Who we are",
            body: `Ortheon is a career direction assessment tool operated by eSellerFit LLC. We help adults evaluate realistic next career directions through a structured assessment process. This Privacy Policy explains what data we collect, how we use it, and how you can control it.

For any privacy-related questions, contact us at ortheon@esellerfit.com.`
          },
          {
            title: "2. What data we collect",
            body: `When you complete the Ortheon assessment, we collect the following:

— Basic contact information: your first name and email address.
— Career context: your current or most recent role and current situation.
— Career anchor scores: your self-reported responses to the career anchor questionnaire (1–10 scale per anchor).
— Financial reality inputs: your stated monthly income floor, savings runway, and transition preferences.
— Transition constraints: your location, work authorization, and availability.
— Professional credentials: any licenses or certifications you choose to disclose.
— CV content: the text of your CV, either extracted from a PDF you upload or pasted manually.
— Priority weight preferences: how you choose to weight the assessment dimensions.

We do not collect payment information, government identification, or sensitive personal data beyond what is listed above.`
          },
          {
            title: "3. How we use your data",
            body: `We use your data solely to generate your Career Direction Report. Specifically:

— Your CV text is sent to the Claude API (Anthropic) for parsing and analysis. This processing is transient — the CV text is analyzed and the structured output is returned. We do not store your raw CV text at Anthropic; it is processed and discarded by the API.
— Your assessment inputs and parsed CV profile are stored in our database (Firebase Firestore) to generate and save your Career Direction Report.
— Your email is used to deliver your report and, if you consent, to send follow-up messages at 6 and 12 months asking about your career direction progress.

We do not use your data for advertising. We do not sell your data to third parties. We do not share your data with employers, recruiters, or any third parties.`
          },
          {
            title: "4. Data storage and security",
            body: `Your assessment data is stored in Google Firebase Firestore, a cloud database operated by Google. Firebase applies industry-standard security measures including encryption at rest and in transit.

We do not store your data outside of Firebase. We do not transfer your data to any other storage system or third-party service beyond the Claude API processing described above.

Ortheon is currently in Alpha. While we apply reasonable security practices, no system is completely secure. We recommend you do not include sensitive personal information beyond what is necessary to complete the assessment.`
          },
          {
            title: "5. Data retention",
            body: `We retain your assessment data for as long as your account is active or as needed to provide the service. If you request deletion of your data, we will remove it from our systems within 30 days.

To request deletion, email ortheon@esellerfit.com with the subject line "Data Deletion Request" and the email address you used during the assessment.`
          },
          {
            title: "6. Your rights",
            body: `You have the right to:

— Access the data we hold about you.
— Request correction of inaccurate data.
— Request deletion of your data.
— Withdraw consent for follow-up communications at any time.

To exercise any of these rights, contact ortheon@esellerfit.com.`
          },
          {
            title: "7. Third-party services",
            body: `Ortheon uses the following third-party services:

— Google Firebase (database and hosting infrastructure)
— Anthropic Claude API (CV text analysis — transient processing only)
— Vercel (application deployment)
— Formspree (feedback form submission)

Each of these services operates under their own privacy policies. We encourage you to review them if you have questions about how they handle data.`
          },
          {
            title: "8. Children",
            body: `Ortheon is intended for adults making career decisions. We do not knowingly collect data from individuals under the age of 18. If you believe a minor has submitted data through our service, please contact ortheon@esellerfit.com and we will delete it promptly.`
          },
          {
            title: "9. Changes to this policy",
            body: `We may update this Privacy Policy as the product evolves. When we make material changes, we will update the date at the top of this page. Continued use of Ortheon after changes are posted constitutes acceptance of the updated policy.`
          },
          {
            title: "10. Contact",
            body: `For any questions about this Privacy Policy or your data, contact us at:

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
