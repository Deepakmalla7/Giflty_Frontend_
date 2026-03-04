"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { url } from "inspector";

const heroImages = [
  
  {
    url: "https://img.freepik.com/premium-photo/red-robotic-claw-takes-christmas-gift-box-winner-concept-3d-rendering_776674-575499.jpg?w=1480",
    caption: "Wrapped with Love",
  },
  {
    url: "https://img.freepik.com/premium-photo/red-robotic-claw-takes-christmas-gift-box-winner-concept-3d-rendering_776674-575473.jpg?w=1480",
    caption: "Celebrate Every Moment",
  },
  {
    url:"https://img.freepik.com/free-photo/3d-delivery-robot-working_23-2151150056.jpg?t=st=1771924502~exp=1771928102~hmac=0853ab483bc5062f03e8f08062fc5298d427e72f4bf82ea6ff6cd00e987a9421&w=1480",
    caption: "Perfect Surprises Await",
  },
];

export default function Home() {
  const router = useRouter();
  const [event, setEvent] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    setError("");
    router.push("/register");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Gi_ftly</span>
              <span className="text-2xl"></span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-300 hover:text-white font-medium transition">
                Login
              </Link>
              <Link href="/register" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Gift Finder Form */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-2">Find Your Perfect Gift</h2>
            <p className="text-slate-400 mb-8">Answer a few quick questions to get personalized recommendations</p>

            <div className="space-y-6">
              {/* Event Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Event Type <span className="text-violet-400">*</span>
                </label>
                <select
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur"
                >
                  <option value="" className="bg-slate-900">Select an event</option>
                  <option value="birthday" className="bg-slate-900">Birthday</option>
                  <option value="anniversary" className="bg-slate-900">Anniversary</option>
                  <option value="wedding" className="bg-slate-900">Wedding</option>
                  <option value="valentines" className="bg-slate-900">Valentines</option>
                </select>
              </div>

              {/* Age Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Recipient's Age <span className="text-violet-400">*</span>
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur"
                >
                  <option value="" className="bg-slate-900">Select an age</option>
                  {Array.from({ length: 116 }, (_, i) => i + 5).map((age) => (
                    <option key={age} value={age} className="bg-slate-900">
                      {age} years old
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Gender <span className="text-violet-400">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur"
                >
                  <option value="" className="bg-slate-900">Select a gender</option>
                  <option value="male" className="bg-slate-900">Male</option>
                  <option value="female" className="bg-slate-900">Female</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Get Started Button */}
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3.5 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25"
              >
                Get Started
              </button>

              <p className="text-xs text-slate-500 text-center">
                Takes less than 1 minute to get personalized recommendations
              </p>
            </div>
          </div>

          {/* Right Side - Hero Image Slider and Features */}
          <div className="space-y-8">
            {/* Hero Image Slider */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ minHeight: "24rem" }}>
              {heroImages.map((image, index) => (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    opacity: currentSlide === index ? 1 : 0,
                    transition: "opacity 1s ease-in-out",
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover"
                    style={{ minHeight: "24rem" }}
                  />
                  {/* Dark overlay gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0.3) 50%, transparent 100%)",
                    }}
                  />
                </div>
              ))}

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <h3 className="text-3xl font-bold text-white mb-2">
                  Your Perfect Gift Awaits
                </h3>
                <p className="text-slate-300 mb-5">
                  Smart recommendations based on age, event, and gender preferences
                </p>

                {/* Slide indicators */}
                <div className="flex gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      style={{
                        height: "6px",
                        borderRadius: "9999px",
                        transition: "all 0.5s ease",
                        width: currentSlide === index ? "32px" : "16px",
                        backgroundColor:
                          currentSlide === index
                            ? "rgb(167,139,250)"
                            : "rgba(255,255,255,0.3)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-violet-500/30 transition">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">1</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Fast & Easy</h4>
                    <p className="text-sm text-slate-400">Get recommendations in seconds</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-violet-500/30 transition">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">2</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Personalized</h4>
                    <p className="text-sm text-slate-400">Tailored to your specific needs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-violet-500/30 transition">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">3</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Quality Picks</h4>
                    <p className="text-sm text-slate-400">Carefully curated gift suggestions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="bg-slate-900/50 border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Select Details</h3>
              <p className="text-slate-400">Choose the event, recipient's age, and gender</p>
            </div>

            <div className="text-center">
              <div className="bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Get Recommendations</h3>
              <p className="text-slate-400">View personalized gift suggestions</p>
            </div>

            <div className="text-center">
              <div className="bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Choose & Give</h3>
              <p className="text-slate-400">Pick the perfect gift and make someone happy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 text-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Giftly</span>
              <span className="text-lg">🇬</span>
            </div>
            <p className="text-slate-500">© 2026 Giftly. Finding perfect gifts since 2026.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}