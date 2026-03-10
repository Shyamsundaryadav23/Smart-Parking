import { Link } from "react-router-dom";
import { ArrowRight, Car, CheckCircle2, Leaf } from "lucide-react";

const features = [
  "Live slot status",
  "Car and bus parking",
  "Clean, fast booking",
];

const Index = () => {
  return (
    <main className="landing-root min-h-screen overflow-y-auto bg-slate-100 md:h-[100dvh] md:overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 md:h-full">
        <header className="fade-up z-10 flex flex-wrap items-start justify-between gap-3 pb-2 sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="landing-glow rounded-2xl bg-white p-2.5 shadow-sm sm:p-3">
              <Car className="h-6 w-6 text-sky-600 sm:h-7 sm:w-7" />
            </div>

            <div className="landing-copy">
              <p className="text-[10px] tracking-[0.38em] text-slate-600 sm:text-xs md:tracking-[0.44em]">
                SMART PARKING
              </p>
              <h1 className="text-base font-semibold leading-[1.22] text-slate-900 sm:text-lg md:text-xl lg:text-2xl">
                Official Parking Portal
              </h1>
            </div>
          </div>

          <Link
            to="/login"
            className="landing-btn-dark rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition sm:px-6 sm:py-2.5 sm:text-base"
          >
            Login
          </Link>
        </header>

        <section className="landing-section grid gap-4 pt-3 md:min-h-0 md:flex-1 md:items-center md:gap-6 md:pt-2 xl:grid-cols-[1fr_1.08fr] xl:gap-8">
          <div className="min-h-0 max-w-2xl">
            <div className="landing-pill fade-up inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 sm:px-4 sm:py-2 sm:text-base">
              <Leaf className="landing-pill-icon h-4 w-4 sm:h-5 sm:w-5" />
              Smart. Secure. Green.
            </div>

            <h2 className="landing-hero fade-up mt-3 text-[clamp(1.7rem,5.1vw,4.4rem)] font-semibold leading-[1.12] tracking-[-0.01em] text-slate-900">
              Your parking spot,
              <br />
              just a click away.
            </h2>

            <p className="fade-up mt-3 max-w-[92%] text-[clamp(.95rem,1.35vw,1.55rem)] leading-[1.5] tracking-[0.01em] text-slate-600">
              Find nearby parking, check availability, and book in minutes.
            </p>

            <div className="fade-up mt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="landing-btn-primary landing-glow inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_-10px_rgba(2,132,199,.85)] transition hover:bg-sky-500 sm:px-6 sm:py-2.5 sm:text-base md:text-lg"
              >
                Get Started
                <ArrowRight className="landing-arrow h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              <Link
                to="/login"
                className="landing-btn-secondary rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:px-6 sm:py-2.5 sm:text-base md:text-lg"
              >
                Book Now
              </Link>
            </div>

            <div className="landing-features fade-up mt-3 grid gap-3 sm:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="landing-feature-card slide-up flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 sm:rounded-3xl sm:px-4 sm:py-2.5 sm:text-sm md:text-[0.95rem]"
                  style={{ animationDelay: `${index * 110 + 210}ms` }}
                >
                  <CheckCircle2 className="landing-check h-4 w-4 text-emerald-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-illustration float-soft fade-up min-h-0 overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-sky-300 via-sky-200 to-cyan-100 p-2 sm:rounded-[2.5rem] sm:p-3 lg:rounded-[3rem] lg:p-4">
            <svg
              viewBox="0 0 860 580"
              role="img"
              aria-label="Parking illustration"
              className="h-full max-h-[44vh] w-full rounded-[2rem] bg-sky-100 sm:max-h-[50vh] sm:rounded-[2.3rem] md:max-h-[55vh] lg:max-h-[58vh]"
            >
              <rect x="0" y="0" width="860" height="580" fill="#d8f0fb" />
              <rect x="0" y="80" width="860" height="300" rx="32" fill="#c5e6f5" />

              <g className="landing-cloud-left" fill="#ecf7fd">
                <rect x="70" y="38" width="160" height="52" rx="26" />
                <circle cx="115" cy="64" r="32" />
                <circle cx="196" cy="62" r="26" />
              </g>

              <g className="landing-cloud-right" fill="#ecf7fd">
                <rect x="575" y="90" width="210" height="56" rx="28" />
                <circle cx="620" cy="118" r="36" />
                <circle cx="715" cy="108" r="30" />
              </g>

              <g className="landing-city" fill="#a7d1e5">
                <rect x="95" y="220" width="95" height="160" rx="14" />
                <rect x="210" y="190" width="95" height="190" rx="14" />
                <rect x="330" y="160" width="95" height="220" rx="14" />
                <rect x="450" y="190" width="95" height="190" rx="14" />
                <rect x="570" y="150" width="95" height="230" rx="14" />
                <rect x="690" y="205" width="95" height="175" rx="14" />
              </g>

              <rect x="0" y="390" width="860" height="120" fill="#bce0c0" />
              <rect x="0" y="445" width="860" height="34" fill="#5f6a76" />
              <rect x="0" y="479" width="860" height="5" fill="#d7dee6" />
              <rect x="0" y="484" width="860" height="96" fill="#a1cca3" />

              <g className="landing-trees">
                <circle cx="130" cy="350" r="28" fill="#76ca82" />
                <rect x="118" y="348" width="20" height="68" rx="10" fill="#6a4a2b" />

                <circle cx="745" cy="332" r="30" fill="#76ca82" />
                <rect x="734" y="334" width="20" height="78" rx="10" fill="#6a4a2b" />
              </g>

              <g className="landing-car">
                <path
                  d="M210 392 L255 307 Q258 294 271 285 L352 193 Q368 173 393 173 H528 Q551 173 566 189 L623 257 Q634 273 649 273 H786 Q804 273 798 291 L786 392 Z"
                  fill="#2291dc"
                />
                <path
                  d="M362 318 L435 250 H514 Q529 250 541 264 L573 302 H362 Z"
                  fill="#dde8f1"
                />
                <rect x="555" y="302" width="176" height="52" rx="16" fill="#d8e5ee" />
                <circle className="landing-wheel" cx="374" cy="413" r="48" fill="#1f2a44" />
                <circle cx="374" cy="413" r="21" fill="#cfd7e0" />
                <circle className="landing-wheel" cx="640" cy="413" r="48" fill="#1f2a44" />
                <circle cx="640" cy="413" r="21" fill="#cfd7e0" />
                <rect x="250" y="380" width="34" height="15" rx="7" fill="#ffd15b" />
                <rect x="703" y="380" width="33" height="15" rx="7" fill="#ff7171" />
              </g>
            </svg>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Index;
