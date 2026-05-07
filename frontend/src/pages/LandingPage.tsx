import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  Trophy,
  Zap,
  BookOpen,
  Target,
  Rocket,
  ShieldCheck,
  Code,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";

// --- Animation Variants ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

// --- Main Page Component ---
export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      <Navbar />
      <main>
        <HeroSection />
        <GlobalTrustMarquee />
        <UnifiedEcosystem />
        <ProjectMarketplaceSection />
        <FeaturesGrid />
        <GamificationShowcase />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

// --- Sections ---

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50"
    >
      <div className="mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
            <GraduationCap size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            PeerLearning
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8 px-8 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md">
          <NavLink label="Curriculum" />
          <NavLink label="Lobbies" />
          <NavLink label="Projects" />
          <NavLink label="Leaderboard" />
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden md:block font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-white transition-all duration-300 bg-blue-600 rounded-xl overflow-hidden shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
            <span className="relative flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative pt-40 pb-20 lg:pt-56 lg:pb-40 px-6 overflow-hidden min-h-screen flex items-center">
      {/* Animated Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/20 dark:bg-blue-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-violet-600/20 dark:bg-violet-600/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        style={{ y: yText, opacity: opacityText }}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto text-center relative z-10 w-full"
      >
        <motion.div variants={fadeUp} className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-8 text-xs font-black tracking-widest uppercase border border-blue-200/50 dark:border-blue-800/50 shadow-sm backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" />
            The Unified Workspace for Builders
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white leading-[0.9]"
        >
          <span className="block mb-2">Master Mastery.</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500">
            Build Reality.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          Bridge the gap between theory and execution. Join elite cohorts to tackle complex LMS tracks, compete in live lobbies, and ship industrial-grade projects.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center gap-3"
          >
            Enter Arena <Rocket size={22} className="text-blue-500" />
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto group bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-black text-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm"
          >
            Browse Projects <Layers className="group-hover:rotate-12 transition-transform text-violet-500" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function GlobalTrustMarquee() {
  const trustItems = [
    { icon: <Code size={24} />, label: "OpenSource Built" },
    { icon: <ShieldCheck size={24} />, label: "Verified Mentors" },
    { icon: <Activity size={24} />, label: "Live Training" },
    { icon: <Trophy size={24} />, label: "XP Backed" },
    { icon: <Users size={24} />, label: "Global Cohorts" },
    { icon: <Zap size={24} />, label: "High Performance" },
  ];

  return (
    <div className="py-12 bg-white/40 dark:bg-[#020617]/40 border-y border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl overflow-hidden relative flex">
      {/* Gradient Fades for Marquee */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 dark:from-[#020617] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 dark:from-[#020617] to-transparent z-10" />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        className="flex whitespace-nowrap gap-16 px-8 items-center"
      >
        {/* Double array for seamless looping */}
        {[...trustItems, ...trustItems].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-slate-400 dark:text-slate-600 font-black text-lg uppercase tracking-tighter hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function UnifiedEcosystem() {
  return (
    <section className="py-32 px-6 relative z-10">
      <div className="mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-24"
        >
          <motion.p variants={fadeUp} className="text-blue-600 dark:text-blue-500 font-black uppercase tracking-widest text-sm mb-4">
            Theory + Assessment + Collaboration
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            A Single, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-500">Powerful</span> Ecosystem
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-3 gap-8"
        >
          <EcoCard
            icon={<BookOpen size={32} className="text-blue-500" />}
            title="Intelligent LMS"
            desc="Structured curriculum tracks synced with your cohort. Every module is a step toward project readiness."
            delay={0}
          />
          <EcoCard
            icon={<Zap size={32} className="text-amber-500" fill="currentColor" />}
            title="Live Peer Arenas"
            desc="Timed assessment lobbies. Compete with 50+ peers simultaneously in real-time technical duels."
            delay={0.2}
          />
          <EcoCard
            icon={<Code size={32} className="text-violet-500" />}
            title="Project Marketplace"
            desc="Host your ideas, hire teammates, and build modular software with integrated review cycles."
            delay={0.4}
          />
        </motion.div>
      </div>
    </section>
  );
}

function ProjectMarketplaceSection() {
  return (
    <section className="py-24 px-6 mx-4 md:mx-10 my-20 bg-[#0B0F19] rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-800">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className=" mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 mb-8 text-xs font-black tracking-widest uppercase border border-blue-500/20 backdrop-blur-md">
            <Rocket size={14} /> The Production Engine
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
            Don't just code. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 italic font-serif">Ship together.</span>
          </motion.h2>
          <motion.div variants={staggerContainer} className="space-y-6">
            <FeatureCheck label="Divide projects into specific, hireable roles" />
            <FeatureCheck label="Shortlist peers based on verified cohort reputation" />
            <FeatureCheck label="Integrated submission gateways with PR feedback" />
          </motion.div>
        </motion.div>

        {/* Complex Animated UI Block */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="relative group perspective-1000"
        >
          <motion.div
            whileHover={{ rotateY: -5, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              </div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Workspace_v2.0</span>
            </div>
            
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex items-center justify-between group-hover:border-blue-500/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-blue-500/10 rounded-xl text-blue-400"><Code size={22} /></div>
                  <div>
                    <p className="text-white font-bold text-base mb-1">Auth API Service</p>
                    <p className="text-xs text-slate-400 font-semibold">3 Applicants Pending Review</p>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20">Shortlist</button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-400"><Activity size={22} /></div>
                  <div>
                    <p className="text-white font-bold text-base mb-1">Realtime Socket Hub</p>
                    <p className="text-[10px] text-emerald-400 tracking-widest font-black uppercase">Active Node Assigned</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-700 flex items-center justify-center text-xs font-black text-white shadow-inner">JD</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Callout Element */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-700 z-20"
          >
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-tighter leading-none mb-1">Task Approved</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">120 XP earned by peer</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function GamificationShowcase() {
  return (
    <section className="py-32 px-6 bg-slate-50 dark:bg-[#020617]">
      <div className="mx-auto flex flex-col items-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center max-w-3xl mb-20"
        >
          <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
            The Leaderboard is your Resume.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-400 text-xl font-medium leading-relaxed">
            Every lobby you win and every project module you complete earns you XP. Build a verifiable proof-of-work that actually means something.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
        >
          <StatDisplay icon={<Target className="text-emerald-500 w-8 h-8" />} value="99.2%" label="Accuracy" />
          <StatDisplay icon={<Users className="text-blue-500 w-8 h-8" />} value="240+" label="Collaborators" />
          <StatDisplay icon={<Activity className="text-orange-500 w-8 h-8" />} value="365d" label="Hard Streak" />
          <StatDisplay icon={<Trophy className="text-amber-500 w-8 h-8" />} value="#4" label="Global Rank" />
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  return (
    <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900/30">
      <div className="max-w-8xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureTile icon={<Code size={24} />} label="Git-Sync Progress" />
        <FeatureTile icon={<Users size={24} />} label="Cohort Matching" />
        <FeatureTile icon={<Activity size={24} />} label="Real-time Analytics" />
        <FeatureTile icon={<ShieldCheck size={24} />} label="Verified Credentials" />
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-40 text-center px-6 relative overflow-hidden bg-slate-900 dark:bg-[#020617] text-white">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="mx-auto relative z-10"
      >
        <motion.h2 variants={scaleIn} className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
          Ready to enter <br className="hidden md:block" /> the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Arena</span>?
        </motion.h2>
        <motion.p variants={fadeUp} className="text-slate-400 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          The most ambitious students in the world are waiting for you. Stop watching tutorials, start shipping.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            to="/register"
            className="group inline-flex items-center gap-3 bg-white text-slate-900 px-12 py-6 rounded-2xl font-black text-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/20 active:scale-95"
          >
            Begin Your Journey <Rocket size={28} className="text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] py-20 px-6 relative z-10">
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              PeerLearning
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 text-lg">
            Building the next generation of engineers through competition and cohort-based collaboration.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Code size={20} />} />
            <SocialIcon icon={<Activity size={20} />} />
            <SocialIcon icon={<Target size={20} />} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 w-full md:w-auto">
          <FooterColumn title="Platform" links={["Curriculum", "Arenas", "Marketplace"]} />
          <FooterColumn title="Community" links={["Lobbies", "Leaderboard", "Discord"]} />
          <FooterColumn title="Legal" links={["Privacy Policy", "Terms of Service"]} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} PeerLearning Labs.
        </p>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          Built for the Arena <Zap size={14} className="text-amber-500" />
        </p>
      </div>
    </footer>
  );
}

// --- Helper Components ---

function NavLink({ label }: { label: string }) {
  return (
    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors relative group">
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all group-hover:w-full" />
    </span>
  );
}

function EcoCard({ icon, title, desc, delay }: { icon: any; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -10 }}
      className="p-10 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] group-hover:bg-blue-500/10 transition-colors" />
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm relative z-10">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight relative z-10">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10 text-lg">{desc}</p>
    </motion.div>
  );
}

function FeatureCheck({ label }: { label: string }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-4">
      <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
        <CheckCircle2 size={16} className="text-blue-400" />
      </div>
      <span className="text-slate-300 font-semibold text-xl tracking-tight">{label}</span>
    </motion.div>
  );
}

function StatDisplay({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-10 rounded-[2rem] text-center shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300"
    >
      <div className="flex justify-center mb-6">{icon}</div>
      <div className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{value}</div>
      <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">{label}</div>
    </motion.div>
  );
}

function FeatureTile({ icon, label }: { icon: any; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all cursor-default"
    >
      <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <span className="font-black text-sm uppercase tracking-widest text-slate-700 dark:text-slate-300">{label}</span>
    </motion.div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.25em] mb-2">{title}</p>
      {links.map((l) => (
        <span key={l} className="text-base font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
          {l}
        </span>
      ))}
    </div>
  );
}

function SocialIcon({ icon }: { icon: any }) {
  return (
    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all cursor-pointer border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1">
      {icon}
    </div>
  );
}