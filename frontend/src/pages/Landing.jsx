import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import DashboardPreview from "../components/landing/DashboardPreview";
import AIShowcase from "../components/landing/AIShowcase";
import WorkoutShowcase from "../components/landing/WorkoutShowcase";
import NutritionShowcase from "../components/landing/NutritionShowcase";
import Pricing from "../components/landing/Pricing";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      <Navbar />

      <main>

        <Hero />

        <Features />

        <DashboardPreview />

        <AIShowcase />

        <WorkoutShowcase />

        <NutritionShowcase />

        <Pricing />

        <CTA />

      </main>

      <Footer />

    </div>
  );
}

export default Landing;