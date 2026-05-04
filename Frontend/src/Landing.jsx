


import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Smart Search",
    desc: "Find trusted professionals instantly.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "Instant Booking",
    desc: "Book services in real time without delay.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Live Chat",
    desc: "Talk directly with providers securely.",
    color: "from-pink-500 to-purple-500",
  },
];

const Landing = () => {
  return (
    <div className="h-screen overflow-hidden bg-[#070A1A] text-white flex flex-col relative">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-[160px] rounded-full top-[-120px] left-[-120px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[160px] rounded-full bottom-[-120px] right-[-120px]" />

      {/* NAVBAR */}
      <header className="h-[70px] flex items-center justify-between px-10 border-b border-white/10 backdrop-blur-xl z-10 shrink-0">

        <h1 className="text-xl font-bold tracking-wide">
          Service<span className="text-indigo-400">Hub</span>
        </h1>

        <div className="flex gap-3">

          {/* 🔥 LOGIN BUTTON (NEW PREMIUM STYLE) */}
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 
                       hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-300"
          >
            Login
          </Link>

          {/* USER REGISTER (NO GREEN → CYAN) */}
          <Link
            to="/register/user"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition"
          >
            User
          </Link>

          {/* PROVIDER REGISTER (BLUE-PURPLE) */}
          <Link
            to="/register/provider"
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition"
          >
            Provider
          </Link>

        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 grid grid-rows-[1fr_auto] px-10 py-6 overflow-hidden z-10">

        {/* HERO */}
        <div className="grid md:grid-cols-2 items-center gap-10">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl font-bold leading-tight">
              Book Trusted <br />
              <span className="text-indigo-400">Professional Services</span>
            </h2>

            <p className="text-gray-300 mt-5 text-lg">
              Connect with verified professionals instantly with a smooth experience.
            </p>

            <div className="flex gap-4 mt-8">

              <Link
                to="/register/user"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 
                           hover:scale-105 transition shadow-lg"
              >
                Join as User
              </Link>

              <Link
                to="/register/provider"
                className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 
                           hover:scale-105 transition shadow-lg"
              >
                Join as Provider
              </Link>

            </div>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-center"
          >
            <motion.img
              src="https://www.naapbooks.com/media/rogk5fqo/qcxlxzyt.png?width=500"
              className="w-[360px] md:w-[420px] rounded-2xl shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[140px]">

          {features.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl p-[1px] bg-gradient-to-r from-white/10 to-white/5"
            >
              <div className="h-full bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">

                <div className={`w-9 h-9 rounded-md mb-3 bg-gradient-to-r ${item.color}`} />

                <h3 className="text-sm font-semibold">{item.title}</h3>

                <p className="text-gray-300 text-xs mt-1">{item.desc}</p>

              </div>
            </motion.div>
          ))}

        </div>

      </main>
    </div>
  );
};

export { Landing };