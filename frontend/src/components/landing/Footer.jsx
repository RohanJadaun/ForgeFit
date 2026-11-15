import { Dumbbell, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const productLinks = [
  ["Dashboard", "/dashboard"],
  ["Workouts", "/workouts"],
  ["Nutrition", "/nutrition"],
  ["Progress", "/progress"],
  ["AI Coach", "/ai-coach"],
];

function Footer() {
  return (
    <footer id="footer" className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600"><Dumbbell size={22} /></div>
              <div><h2 className="text-2xl font-bold">ForgeFit</h2><p className="text-sm text-slate-400">Fitness tracking portfolio demo</p></div>
            </div>
            <p className="mt-5 leading-7 text-slate-400">Track workouts, nutrition, and progress, then get practical coaching based on your logs.</p>
            <div className="mt-6 flex gap-3">
              <a href="https://www.linkedin.com/in/rohanjadaun" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 transition hover:bg-blue-600"><FaLinkedin size={18} /></a>
              <a href="https://github.com/RohanJadaun" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 transition hover:bg-blue-600"><FaGithub size={18} /></a>
              <a href="mailto:rohanjadaun1902@gmail.com" aria-label="Email project owner" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 transition hover:bg-blue-600"><Mail size={18} /></a>
            </div>
          </div>

          <nav aria-label="Product" className="space-y-4">
            <h3 className="text-lg font-bold">Product</h3>
            {productLinks.map(([label, path]) => <Link key={path} to={path} className="block text-slate-400 transition hover:text-white">{label}</Link>)}
          </nav>

          <nav aria-label="Explore" className="space-y-4">
            <h3 className="text-lg font-bold">Explore</h3>
            <a href="/#features" className="block text-slate-400 transition hover:text-white">Features</a>
            <a href="/#pricing" className="block text-slate-400 transition hover:text-white">Plan concepts</a>
            <a href="mailto:rohanjadaun1902@gmail.com" className="block text-slate-400 transition hover:text-white">Contact</a>
          </nav>

          <nav aria-label="Policies" className="space-y-4">
            <h3 className="text-lg font-bold">Policies</h3>
            <Link to="/privacy" className="block text-slate-400 transition hover:text-white">Privacy overview</Link>
            <Link to="/terms" className="block text-slate-400 transition hover:text-white">Terms of use</Link>
            <p className="text-sm leading-6 text-slate-500">Use test information. This portfolio demo is not a medical service.</p>
          </nav>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} ForgeFit · Portfolio project
        </div>
      </div>
    </footer>
  );
}

export default Footer;
