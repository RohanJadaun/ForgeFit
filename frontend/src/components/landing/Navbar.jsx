import { useEffect, useState } from "react";
import { Dumbbell, Menu, X } from "lucide-react";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    {
      title: "Features",
      href: "#features",
    },
    {
      title: "AI Coach",
      href: "#ai",
    },
    {
      title: "Pricing",
      href: "#pricing",
    },
    {
      title: "Contact",
      href: "#footer",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* Logo */}

        <a
          href="/"
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
            <Dumbbell
              className="text-white"
              size={20}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              ForgeFit
            </h2>

            <p className="text-xs text-slate-500 -mt-1">
              AI Fitness Platform
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="
                text-slate-600
                font-medium
                transition
                hover:text-blue-600
              "
            >
              {link.title}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}

        <div className="hidden lg:flex items-center gap-3">

          <a href="/login"
            className="
              px-5
              py-2.5
              rounded-xl
              border
              border-slate-200
              hover:bg-slate-50
              transition
            "
          >
            Login
          </a>

          <a href="/register"
            className="
              px-5
              py-2.5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              shadow-sm
              transition
            "
          >
            Get Started
          </a>

        </div>

        {/* Mobile Toggle */}

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-slate-700"
        >
          {mobileOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>

      </div>

      {/* Mobile Menu */}

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-sm">
          <div className="px-6 py-6 flex flex-col gap-5">

            {links.map((link) => (
              <a
                key={link.title}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="
                  text-slate-700
                  font-medium
                "
              >
                {link.title}
              </a>
            ))}

            <a href="/login" onClick={() => setMobileOpen(false)}
              className="
                py-3
                rounded-xl
                border
                border-slate-200
              "
            >
              Login
            </a>

            <a href="/register" onClick={() => setMobileOpen(false)}
              className="
                py-3
                rounded-xl
                bg-blue-600
                text-white
                font-semibold
              "
            >
              Get Started
            </a>

          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
