import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// Slight blur on scroll utility hook for hero BG
const useBlurSvgOnScroll = (ref: React.RefObject<SVGSVGElement>) => {
  useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    const onScroll = () => {
      const rect = svg.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      let percent = Math.min(1, Math.max(0, (windowHeight - rect.top) / windowHeight));
      svg.style.filter = `blur(${10 - percent * 10}px)`;
      svg.style.opacity = String(0.45 + 0.35 * percent);
      svg.style.transform = `scale(${0.96 + percent * 0.12})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
};

// Hero Section - simple, modern, subtle blur animation, no gradient
function HeroSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  useBlurSvgOnScroll(svgRef);

  return (
    <section className="h-screen flex flex-col items-center justify-center relative bg-white overflow-hidden pb-16">
      <svg
        ref={svgRef}
        className="absolute z-0 left-1/2 -translate-x-1/2 top-0 opacity-40"
        width="820"
        height="680"
        viewBox="0 0 820 680"
        fill="none"
        style={{
          transition: "filter 0.6s cubic-bezier(.28,1.65,.72,.98), transform 0.8s cubic-bezier(.28,1.65,.72,.98), opacity 0.6s",
          willChange: "filter,transform,opacity",
        }}
      >
        <ellipse
          cx="410"
          cy="340"
          rx="355"
          ry="158"
          fill="#f8fafc"
        />
        <ellipse
          cx="410"
          cy="370"
          rx="270"
          ry="120"
          fill="#e0e7ef"
        />
      </svg>
      <div className="z-10 relative text-center space-y-7">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 animate-fadeInUp">
          <span className="inline-block animate-blurAppear">Institute</span>
          <span className="inline-block mx-3 text-blue-800 animate-subtleDrop">Management</span>
          Platform
        </h1>
        <p className="max-w-xl mx-auto text-lg md:text-2xl text-gray-600">
          Modernize your <b>university</b> & <b>college</b> operations with fast, simple dashboards, AI attendance, and team collaboration. Minimal, beautiful. No distractions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link to="/student/dashboard" className="rounded-xl px-8 py-3 text-lg font-bold bg-blue-600 text-white shadow hover:shadow-md hover:bg-blue-700 transition animate-slideInSoft">
            Student Dashboard &rarr;
          </Link>
          <Link to="/institute/create" className="rounded-xl px-8 py-3 text-lg font-bold bg-white border border-blue-200 text-blue-700 shadow-sm hover:bg-blue-50 transition">
            Register Your Institute
          </Link>
          <Link to="/institute/dashboard" className="rounded-xl px-8 py-3 text-lg font-bold bg-blue-600 text-white shadow hover:shadow-md hover:bg-blue-700 transition animate-slideInSoft">
          Institute Dashboard &rarr;
          </Link>
        </div>
      </div>
      <div className="absolute left-1/2 bottom-5 -translate-x-1/2 w-full flex justify-center pointer-events-none">
        <div className="h-[5px] w-1/4 bg-gray-200 rounded-full animate-noBlurToSharp" />
      </div>
    </section>
  );
}

// --- Features Section: TRUE Bento Grid w/ subtle hover and soft colors (no gradients) ---
function FeaturesSection() {
  // Features for the Bento Grid
  const features = [
    {
      title: "AI Attendance",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 34 34">
          <rect x="3" y="7" width="28" height="20" rx="7" fill="#f0f4fa" />
          <circle cx="10" cy="17" r="3" fill="#3b82f6" />
          <rect x="16" y="15" width="10" height="4" rx="2" fill="#bae6fd" />
        </svg>
      ),
      desc: "Mark, track, and verify attendance in real time via AI.",
      bento: "row-span-2 col-span-1",
    },
    {
      title: "Timetable & Rooms",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 34 34">
          <rect x="6" y="9" width="22" height="16" rx="4" fill="#e5e7eb" />
          <rect x="11" y="14" width="8" height="2.5" rx="1.25" fill="#60a5fa" />
        </svg>
      ),
      desc: "Fully automated, conflict-free scheduling for all classes.",
      bento: "row-span-1 col-span-1",
    },
    {
      title: "Faculty Tools",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 34 34">
          <circle cx="17" cy="12" r="5" fill="#fbcfe8" />
          <rect x="8" y="19" width="16" height="7" rx="3" fill="#f1f5f9" />
        </svg>
      ),
      desc: "Dedicated panel for faculty management, courses, analytics.",
      bento: "row-span-1 col-span-1",
    },
    {
      title: "Instant Notifications",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 34 34">
          <rect x="13" y="6" width="8" height="16" rx="4" fill="#f9fafb" />
          <circle cx="17" cy="24" r="5" fill="#fca5a5" />
        </svg>
      ),
      desc: "Send alerts & reminders to students and staff instantly.",
      bento: "row-span-1 col-span-2",
    },
    {
      title: "Analytics Dashboard",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 34 34">
          <rect x="7" y="20" width="4" height="7" rx="2" fill="#a7f3d0" />
          <rect x="15" y="13" width="4" height="14" rx="2" fill="#93c5fd" />
          <rect x="23" y="24" width="4" height="3" rx="1" fill="#ddd6fe" />
        </svg>
      ),
      desc: "Visualize trends & engagement at a glance, simply.",
      bento: "row-span-1 col-span-1",
    },
    {
      title: "Student Self-Service",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 34 34">
          <rect x="8" y="13" width="18" height="6" rx="3" fill="#fef9c3" />
          <circle cx="17" cy="24" r="5" fill="#dbeafe" />
        </svg>
      ),
      desc: "Students download docs & admit cards, update profiles.",
      bento: "row-span-1 col-span-1",
    },
  ];

  // Responsive Bento grid template (desktop: 2x3, mobile: stacked)
  return (
    <section className="py-20 px-4 bg-white border-b border-gray-100">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 text-gray-900 animate-fadeInUp">Key Features</h2>
      <p className="text-lg text-center text-gray-500 mb-12 max-w-2xl mx-auto">One platform, all the essentials for institute growth - built for simplicity, focus and power.</p>
      <div
        className="
        grid grid-cols-1 gap-4
        sm:grid-cols-2 sm:grid-rows-2
        md:grid-cols-3 md:grid-rows-2
        max-w-5xl mx-auto
        "
      >
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`
              group hover:shadow-lg hover:scale-[1.025] active:scale-100 transition-all duration-300 ease-elastic
              relative p-7 rounded-2xl border border-gray-100 bg-gray-50
              focus:outline focus:outline-2 focus:outline-blue-400 ${f.bento}
              flex flex-col justify-between w-full
            `}
            tabIndex={0}
            style={{
              boxShadow: "0 2px 16px 0 rgba(15,23,42,0.08)",
              minHeight: 165 + (f.bento?.includes('row-span-2') ? 80 : 0),
            }}
          >
            <div className="flex gap-4 items-center mb-2">
              <div className="transition-transform duration-300 group-hover:scale-125" aria-hidden>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{f.title}</h3>
            </div>
            <p className="mt-2 text-gray-600 text-base">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Animated Marquee - minimalist, no gradient
function CompaniesMarquee() {
  const companies = [
    "IIT Kanpur", "BITS Pilani", "JNU", "Stanford", "NIT Trichy",
    "IIIT Hyderabad", "Harvard", "Oxford", "Cambridge", "SRM University", "IISC Bangalore", "MIT", "AMU"
  ];
  // Repeat to simulate infinite marquee
  const doubled = companies.concat(companies);
  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <h3 className="text-xl font-semibold text-center mb-8 text-gray-700">Trusted by Institutes, Universities & More</h3>
      <div className="overflow-x-hidden w-full select-none">
        <div
          className="flex gap-12 min-w-max items-center whitespace-nowrap animate-marqueeSoft"
          style={{ animationDuration: "22s" }}
        >
          {doubled.map((name, idx) => (
            <div
              key={name + idx}
              className="flex items-center gap-3 px-4"
              style={{ minWidth: 170 }}
            >
              <div
                className="rounded-lg h-9 w-9 inline-flex items-center justify-center border border-gray-200 bg-gray-50"
              >
                <span className="material-symbols-outlined text-gray-300">school</span>
              </div>
              <span className="font-medium text-base text-gray-700">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Interactive Animation Section (subtle, minimal, with no gradient bg) ---
function InteractiveAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !svgRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      let percent = Math.min(1, Math.max(0, 1 - rect.top / windowHeight));
      svgRef.current.style.filter = `blur(${8 - percent * 7}px)`;
      svgRef.current.style.opacity = String(0.2 + 0.8 * percent);
      svgRef.current.style.transform = `scaleY(${0.94 + 0.1 * percent})`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="py-24 relative bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl font-bold mb-4 text-gray-900 animate-fadeInUp">Interactive Dashboard Preview</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 font-medium text-base">
            <li>Attendance heatmaps and live semester progress</li>
            <li>All-in-one performance and class analytics</li>
            <li>One-click faculty & student engagement stats</li>
            <li>Lightning-fast search & quick download tools</li>
          </ul>
        </div>
        {/* Animated SVG (bar chart & "wave") */}
        <div className="flex-1 flex items-center justify-center">
          <svg
            ref={svgRef}
            width="340"
            height="200"
            viewBox="0 0 340 200"
            fill="none"
            className="transition duration-500"
            style={{ willChange: "filter, opacity, transform" }}
          >
            <g filter="url(#shadow2)">
              <rect x="25" y="30" width="290" height="140" rx="18" fill="#f3f6fa" />
            </g>
            <rect x="80" y="65" width="50" height="70" rx="6" fill="#60a5fa" className="animate-barBounce origin-bottom" />
            <rect x="150" y="95" width="38" height="48" rx="6" fill="#818cf8" className="animate-barBounce origin-bottom" style={{ animationDelay: "0.24s" }} />
            <rect x="210" y="110" width="30" height="33" rx="6" fill="#fbbf24" className="animate-barBounce origin-bottom" style={{ animationDelay: "0.37s" }} />
            <ellipse cx="160" cy="120" rx="110" ry="38" fill="#e0e7ef" opacity="0.13" className="animate-waveSoft" />
            <defs>
              <filter id="shadow2" x="0" y="0" width="340" height="200">
                <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#b7bdf655" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}

// --- Pricing Section (no gradient, keep interactive, minimal) ---
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      perks: [
        "Up to 1,000 users/students",
        "AI Attendance & Timetable",
        "Basic Analytics",
        "Email Support",
        "Download CSV Reports",
      ],
      featured: false,
      color: "border-gray-200",
    },
    {
      name: "Pro",
      price: "₹2,499 / year",
      perks: [
        "All Starter features",
        "Unlimited users",
        "Institute Branding + Domain",
        "Team management & RBAC",
        "Priority Email Support",
        "API & Integrations",
      ],
      featured: true,
      color: "border-blue-500 shadow-blue-100",
    },
    {
      name: "Enterprise",
      price: "Let's Talk",
      perks: [
        "Full white-label + Custom domain",
        "24/7 Dedicated Support",
        "In-person onboarding & migration",
        "Custom integrations",
        "SLA, advanced API & reporting",
        "99.9% Uptime Guarantee",
      ],
      featured: false,
      color: "border-gray-200",
    },
  ];

  return (
    <section className="bg-white py-24 px-4 border-b border-gray-100">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">Pricing Plans</h2>
      <p className="text-lg md:text-xl text-center text-gray-500 mb-14">
        Simple, modern plans to fit every campus — try free, upgrade only when you grow.
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`
              relative group border-2 ${plan.color} bg-white rounded-3xl p-8 pt-12 w-full md:w-[360px] flex flex-col items-center min-h-[450px] 
              transition-all duration-300 hover:scale-105 hover:shadow-2xl
              ${plan.featured ? "ring-2 ring-blue-300 shadow-xl shadow-blue-100 scale-105 z-10" : ""}
            `}
            tabIndex={plan.featured ? 0 : -1}
            style={{
              boxShadow: plan.featured
                ? "0 12px 40px -8px rgba(59,130,246,.08)"
                : "0 4px 24px -8px rgba(59,130,246,.04)",
              marginTop: plan.featured ? -22 : 0,
            }}
          >
            {plan.featured && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white py-1.5 px-6 rounded font-bold shadow animate-pingIn">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-3 text-gray-900">{plan.name}</h3>
            <span className="text-3xl font-extrabold mb-5 text-blue-700">{plan.price}</span>
            <ul className="mt-6 text-gray-600 space-y-3 text-base w-full">
              {plan.perks.map((perk) => (
                <li className="flex items-center gap-2" key={perk}>
                  <span className="inline-block rounded-full bg-blue-200 w-2 h-2" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <button
              className={`
                mt-auto mb-1 rounded-xl px-8 py-3 font-bold bg-blue-600 text-white shadow-lg
                hover:scale-105 hover:bg-blue-700 hover:shadow-xl transition-all
              `}
            >
              {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Call-to-Action Section (light UI, subtle) ---
function CallToActionSection() {
  return (
    <section className="py-20 bg-white text-center relative">
      <div className="max-w-2xl mx-auto animate-popIn relative z-10">
        <h2 className="text-4xl font-black mb-4 text-gray-900">Ready to transform your institute?</h2>
        <p className="text-lg mb-7 text-gray-600 font-medium">
          Start your journey toward effortless management, happier students and faculty — all with a click.
        </p>
        <a
          href="/institute/create"
          className="inline-block py-4 px-10 text-xl rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg border border-blue-200"
        >
          Get Started Now &rarr;
        </a>
      </div>
      {/* faint blurred circle as accent */}
      <span className="absolute w-64 h-64 left-12 top-10 bg-blue-100 opacity-15 rounded-full blur-2xl pointer-events-none"></span>
      <span className="absolute w-80 h-80 right-10 bottom-2 bg-gray-200 opacity-10 rounded-full blur-2xl pointer-events-none"></span>
    </section>
  );
}

// --- Footer (minimal) ---
function FooterSection() {
  return (
    <footer className="py-10 px-4 bg-white border-t border-gray-100 text-center">
      <div className="text-lg font-bold tracking-tight text-blue-800">
        <span className="mr-2">UniM</span> <span className="opacity-70">&mdash; Modern Institute Platform</span>
      </div>
      <div className="text-sm text-gray-400 mt-1">
        &copy; {new Date().getFullYear()} Powered by React, PostgreSQL, and passion for education.
      </div>
    </footer>
  );
}

// --- Animations (custom classes, make them blur/noblur and modern/soft) ---
const globalStyles = `
@keyframes fadeInUp {
  0% {opacity: 0; transform: translateY(35px);}
  100% {opacity: 1; transform: translateY(0);}
}
.animate-fadeInUp { animation: fadeInUp 1.05s cubic-bezier(.28,1.2,.52,.98) both; }

@keyframes popIn {
  0% {transform: scale(0.97);opacity:0;}
  100% {transform: scale(1);opacity:1;}
}
.animate-popIn { animation: popIn 0.9s cubic-bezier(.28,1.1,.64,.97) both; }

@keyframes pingIn {
  0% { transform: scale(0.8);}
  80% {transform: scale(1.09);}
  100% {transform: scale(1);}
}
.animate-pingIn { animation: pingIn 0.55s cubic-bezier(.32,1.5,.42,.9); }

@keyframes blurAppear {
  0% { filter: blur(7px); opacity: 0.38;}
  100% { filter: blur(0px); opacity: 1;}
}
.animate-blurAppear { animation: blurAppear 1s cubic-bezier(.26,1.3,.42,.98) both; }

@keyframes slideInSoft {
  0% { opacity:0; transform:translateY(16px);}
  100%{opacity:1; transform:translateY(0);}
}
.animate-slideInSoft { animation: slideInSoft 1.2s cubic-bezier(.26,1.2,.72,.95) both; }

@keyframes noBlurToSharp {
  0% { filter: blur(7px); }
  80% { filter: blur(1px);}
  100%{ filter: blur(0px);}
}
.animate-noBlurToSharp { animation: noBlurToSharp 1.3s cubic-bezier(.26,1.7,.72,.97) both; }

@keyframes subDrop {
  0% { opacity:0; transform:translateY(35px) scale(1.05); }
  100% {opacity:1; transform:none;}
}
.animate-subtleDrop {animation: subDrop 1s cubic-bezier(.32,1.1,.62,.98) both;}

@keyframes barBounce {
  0% {height:0; opacity:0.2;}
  80% { height:110px;}
  100% {height: var(--h,80px); opacity:1;}
}
.animate-barBounce {animation:barBounce 1.1s cubic-bezier(.24,1.3,.54,.98) both;}

@keyframes waveSoft {
  0% {opacity:0.08; transform: scaleX(0.75);}
  100% {opacity:0.13; transform:scaleX(1);}
}
.animate-waveSoft {animation:waveSoft 1.5s cubic-bezier(.28,1.05,0.72,.95) both;}

@keyframes marqueeSoft {
  0% {transform:translateX(0);}
  100% {transform:translateX(-50%);}
}
.animate-marqueeSoft {
  animation: marqueeSoft 20s linear infinite;
}
`;

// -- Main HomePage Export --
function HomePage() {
  useEffect(() => {
    if (document.getElementById("landing-global-styles")) return;
    const el = document.createElement("style");
    el.id = "landing-global-styles";
    el.innerHTML = globalStyles;
    document.head.appendChild(el);
  }, []);

  return (
    <div className="bg-white min-h-screen relative antialiased">
      <HeroSection />
      <FeaturesSection />
      <InteractiveAnimationSection />
      <CompaniesMarquee />
      <PricingSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
}

export default HomePage;
