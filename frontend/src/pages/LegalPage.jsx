import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";

const content = {
  "/privacy": {
    title: "Privacy overview",
    intro: "ForgeFit is a portfolio demonstration, not a public fitness service. Use test data while reviewing it.",
    sections: [
      ["Data in the demo", "The app stores the name and email used for an account plus workout, nutrition, and progress entries in its configured MongoDB database. Authentication uses an HTTP-only session cookie."],
      ["Optional providers", "If enabled by the operator, Google or GitHub sign-in receives your verified email and basic profile details. If an OpenAI key is configured, coach prompts and limited fitness context are sent to that provider to generate a reply. Password reset email is sent through Resend when configured."],
      ["Use test information", "Do not enter sensitive health information. This demo has no medical service, privacy dashboard, or self-service account deletion flow. The operator must remove demo records from the database when needed."],
      ["Contact", "For this portfolio preview, contact the project owner through the contact link on the landing page."],
    ],
  },
  "/terms": {
    title: "Terms of use",
    intro: "ForgeFit is a portfolio project provided for demonstration and evaluation.",
    sections: [
      ["Fitness information", "Content from the coach and the app is general information only. It is not medical advice, a diagnosis, or a substitute for guidance from a qualified professional. Stop exercising if you feel unwell or injured."],
      ["Demo features", "This preview may include features that are illustrative or unavailable, including external integrations and subscription concepts. No subscription purchase or payment processing is offered."],
      ["Accounts and data", "Use test information and keep your sign-in details private. The operator may reset demo data. Do not rely on this preview to store important records."],
    ],
  },
};

function LegalPage() {
  const { pathname } = useLocation();
  const page = content[pathname] || content["/privacy"];

  return (
    <AuthLayout>
      <AuthCard>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">ForgeFit portfolio demo</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{page.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{page.intro}</p>
          </div>
          <div className="space-y-5">
            {page.sections.map(([heading, text]) => (
              <section key={heading}>
                <h2 className="font-semibold text-slate-900">{heading}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
              </section>
            ))}
          </div>
          <div className="flex gap-4 border-t border-slate-100 pt-4 text-sm">
            <Link to="/privacy" className="font-medium text-blue-700 hover:underline">Privacy</Link>
            <Link to="/terms" className="font-medium text-blue-700 hover:underline">Terms</Link>
            <Link to="/" className="ml-auto font-medium text-slate-600 hover:text-slate-900">Back to ForgeFit</Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default LegalPage;
