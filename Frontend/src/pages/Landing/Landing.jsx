import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const heroSlides = [
  { image: "https://res.cloudinary.com/dx9y09tya/image/upload/v1765894401/premium_photo-1681843126728-04eab730febe_tnn99n.avif" },
  { image: "https://res.cloudinary.com/dx9y09tya/image/upload/v1765894796/premium_photo-1691708773257-62f8a0cecadf_hestfu.avif" },
  { image: "https://res.cloudinary.com/dx9y09tya/image/upload/v1765895016/premium_photo-1663013675008-bd5a7898ac4f_iy8wqm.avif" },
  { image: "https://res.cloudinary.com/dx9y09tya/image/upload/v1765895106/premium_photo-1661911309991-cc81afcce97d_prqnhi.avif" },
  { image: "https://res.cloudinary.com/dx9y09tya/image/upload/v1765895182/photo-1554734867-bf3c00a49371_vpezvw.avif" },
];

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const slideCount = heroSlides.length;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setSlide((prev) => (prev + 1) % slideCount);
        setFade(true);
      }, 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, [slide, slideCount]);

  const goTo = (idx) => {
    setFade(false);
    setTimeout(() => {
      setSlide(idx);
      setFade(true);
    }, 400);
  };
  const prevSlide = () => goTo((slide - 1 + slideCount) % slideCount);
  const nextSlide = () => goTo((slide + 1) % slideCount);

  return (
    <div className="">
      <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-400 rounded-lg flex items-center justify-center shadow-md">
                  <img src="logo.png" alt="EasyFind logo"/>
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-gray-900">EasyFind</h1>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button onClick={()=>navigate("/login")} className="px-4 py-2 border rounded-xl border-blue-600 text-gray-700 hover:text-blue-600 transition-colors font-medium">Login</button>
              <button onClick={()=>navigate("/register")} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Register</button>
              <button onClick={()=>navigate("/admin/login")} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Admin Login</button>
              <button onClick={()=>navigate("/provider/login")} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Provider Login</button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              <div className="flex flex-col space-y-3">
                <button onClick={() => {navigate("/login"); setMobileMenuOpen(false)}} className="px-4 py-2 border rounded-xl border-blue-600 text-gray-700 text-left hover:text-blue-600 font-medium">Login</button>
                <button onClick={() => {navigate("/register"); setMobileMenuOpen(false)}} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-left">Register</button>
                <button onClick={() => {navigate("/admin/login"); setMobileMenuOpen(false)}} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-left">Admin Login</button>
                <button onClick={() => {navigate("/provider/login"); setMobileMenuOpen(false)}} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-left">Provider Login</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="relative min-h-screen h-screen overflow-hidden flex items-center">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-x-hidden">
            <div className="flex transition-transform duration-700 ease-in-out h-full w-full" style={{transform: `translateX(-${slide * 100}vw)`}}>
              {heroSlides.map((s, idx) => (
                <div key={idx} className={`relative flex-shrink-0 w-screen h-full transition-transform duration-700 ease-in-out ${idx === slide ? 'scale-105 z-20' : 'scale-95 z-10'}`} style={{backgroundImage: `url('${s.image}')`, backgroundSize: 'cover', backgroundPosition: 'center'}} aria-hidden={false} />
              ))}
            </div>

            <button onClick={prevSlide} aria-label="Previous slide" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow z-20">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} aria-label="Next slide" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow z-20">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroSlides.map((_, idx) => (
                <button key={idx} onClick={() => goTo(idx)} className={`w-3 h-3 rounded-full border-2 ${slide === idx ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'} transition-all`} aria-label={`Go to slide ${idx+1}`} />
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-4xl mx-auto rounded-2xl bg-black/55 backdrop-blur-sm p-4 md:p-8" />
              </div>
              <div className="text-center max-w-4xl mx-auto relative z-10">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg">Find Verified Professionals Instantly</h1>
                <p className="text-lg md:text-xl lg:text-2xl text-white mb-4 drop-shadow">Doctors, Teachers & Technicians — Trusted, Verified, and Available in Real-Time</p>
                <p className="text-base md:text-lg text-white mb-8 md:mb-10 max-w-3xl mx-auto drop-shadow">Book appointments, chat instantly, or request urgent help from verified professionals near you.</p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pointer-events-auto">
                  <button onClick={()=>navigate("/login")} className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-semibold rounded-lg shadow transition-colors">Find a Service</button>
                  <button onClick={()=>navigate("/login")} className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 border bg-red-600 border-white text-white hover:bg-white hover:text-yellow-600 text-base md:text-lg font-medium rounded-lg transition-colors">Urgent Help</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Services</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Browse services offered by verified professionals on EasyFind.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="group hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-200">
                <div className="p-6 md:p-8 text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v6m0 0a4 4 0 100 8 4 4 0 000-8" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Doctor Consultation</h3>
                  <p className="text-gray-600 text-xs md:text-sm">Connect with verified medical professionals for consultations and follow-ups.</p>
                </div>
              </div>

              <div className="group hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-200">
                <div className="p-6 md:p-8 text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Home Tutors</h3>
                  <p className="text-gray-600 text-xs md:text-sm">Find qualified tutors for in-person or online lessons.</p>
                </div>
              </div>

              <div className="group hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-200">
                <div className="p-6 md:p-8 text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Electricians</h3>
                  <p className="text-gray-600 text-xs md:text-sm">Certified electricians for safe wiring, repairs and installations.</p>
                </div>
              </div>

              <div className="group hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-200">
                <div className="p-6 md:p-8 text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10v10a1 1 0 001 1h8a1 1 0 001-1V10" /></svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Plumbers</h3>
                  <p className="text-gray-600 text-xs md:text-sm">Fast-response plumbing services for homes and businesses.</p>
                </div>
              </div>

              <div className="group hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-200">
                <div className="p-6 md:p-8 text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Emergency Services</h3>
                  <p className="text-gray-600 text-xs md:text-sm">Priority handling for urgent and emergency requests.</p>
                </div>
              </div>

              <div className="group hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-200">
                <div className="p-6 md:p-8 text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v4H3zM3 13h18v8H3z" /></svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Appliance Repair</h3>
                  <p className="text-gray-600 text-xs md:text-sm">Trusted technicians to fix appliances quickly and safely.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">EasyFind Process</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">From choosing a role to getting instant or scheduled service in four easy steps.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { step: "1", title: "Choose Your Role", desc: "Select User, Provider or Admin" },
                { step: "2", title: "Login / Register", desc: "Secure sign-in to start" },
                { step: "3", title: "Connect with Verified Professionals", desc: "Chat or book appointments" },
                { step: "4", title: "Get Instant or Scheduled Service", desc: "Receive help when you need it" },
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-lg md:text-2xl font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 md:top-8 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-8"></div>
                  )}
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-to-r from-blue-50 via-white to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Get Started with EasyFind Today</h2>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">Secure • Verified • Real-Time Assistance</p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <button onClick={()=>navigate('/login')} className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-semibold rounded-lg shadow transition-colors">Login Now</button>
                <div className="flex gap-2">
                  <button onClick={()=>navigate('/register')} className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 border border-blue-600 text-blue-600 hover:bg-blue-50 text-base md:text-lg font-medium rounded-lg">Register as User</button>
                  <button onClick={()=>navigate('/provider/register')} className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 border border-blue-600 text-blue-600 hover:bg-blue-50 text-base md:text-lg font-medium rounded-lg">Register as Provider</button>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-4 md:mt-6">Secure • Verified • Real-Time Assistance</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <img src="logo.png" alt="EasyFind" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg">EasyFind</h3>
                  <p className="text-xs md:text-sm opacity-80">Connect with trusted, verified professionals near you.</p>
                </div>
              </div>
              <p className="text-xs md:text-sm opacity-80 mb-3 md:mb-4 max-w-md">EasyFind connects users with verified professionals for consultations, repairs, tutoring and urgent support.</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Quick Links</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm opacity-80">
                <li onClick={()=>navigate('/login')} className="cursor-pointer">Login</li>
                <li onClick={()=>navigate('/register')} className="cursor-pointer">Register</li>
                <li onClick={()=>navigate('/services')} className="cursor-pointer">Services</li>
                <li onClick={()=>navigate('/contact')} className="cursor-pointer">Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Support</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm opacity-80">
                <li>Help Desk</li>
                <li>FAQ</li>
                <li>Contact Us</li>
                <li>Feedback</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-6 md:mt-8 pt-4 md:pt-6 text-center">
            <p className="text-xs md:text-sm opacity-60">© 2025 EasyFind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;