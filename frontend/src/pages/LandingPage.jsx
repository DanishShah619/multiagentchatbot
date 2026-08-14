import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../utils/firebase';
import api from '../../utils/axios';
import { setUserdata } from '../redux/userSlice';
import { FcGoogle } from 'react-icons/fc';
import { 
  Sparkles, 
  Code2, 
  FileText, 
  Presentation, 
  Image as ImageIcon, 
  Search, 
  Bot, 
  Zap, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  ChevronRight,
  Database,
  CheckCircle2
} from 'lucide-react';

import ParticleText from '../components/reactbits/ParticleText';
import StrokeText from '../components/reactbits/StrokeText';
import CursorGrid from '../components/reactbits/CursorGrid';
import CardSwap, { Card } from '../components/reactbits/CardSwap';
import MagicRings from '../components/reactbits/MagicRings';

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const { data } = await api.post('/api/auth/login', { token });
      dispatch(setUserdata(data));
      navigate('/app');
    } catch (error) {
      console.error('[GoogleLogin]', error);
    } finally {
      setAuthLoading(false);
      setShowAuthModal(false);
    }
  };

  const handleLaunchApp = () => {
    if (userData) {
      navigate('/app');
    } else {
      setShowAuthModal(true);
    }
  };

  const agentFeatures = [
    {
      icon: <Code2 className="w-8 h-8 text-cyan-400" />,
      title: "Deep Coding Agent",
      badge: "DeepSeek V3",
      desc: "Full-stack code generation, multi-file project architecture, and live editable code artifacts in real-time.",
      tags: ["Multi-file", "Syntax Highlighted", "Live Preview"],
      accent: "from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-400"
    },
    {
      icon: <FileText className="w-8 h-8 text-violet-400" />,
      title: "PDF RAG Intelligence",
      badge: "Qdrant Vector DB",
      desc: "Upload multi-page research documents and query them instantly with zero-hallucination semantic search.",
      tags: ["Vector Embeddings", "Qdrant", "Chunked Retrieval"],
      accent: "from-violet-500/20 to-purple-600/10 border-violet-500/30 text-violet-400"
    },
    {
      icon: <Presentation className="w-8 h-8 text-amber-400" />,
      title: "Presentation Engine",
      badge: "PPTX Export",
      desc: "Turn topics into presentation decks with structured layouts, bullet points, and instant .pptx downloads.",
      tags: ["Automated Layouts", "PowerPoint Export", "Executive Themes"],
      accent: "from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-400"
    },
    {
      icon: <ImageIcon className="w-8 h-8 text-pink-400" />,
      title: "Vision & Image Studio",
      badge: "8K Generation",
      desc: "Synthesize photorealistic visuals and inspect image pixels for OCR transcription and chart analysis with Gemini.",
      tags: ["Text-to-Image", "Multimodal OCR", "Cloudinary CDN"],
      accent: "from-pink-500/20 to-rose-600/10 border-pink-500/30 text-pink-400"
    },
    {
      icon: <Search className="w-8 h-8 text-emerald-400" />,
      title: "Deep Web Search",
      badge: "Tavily AI",
      desc: "Perform real-time web research, verify breaking news, and synthesize verified citations without leaving the chat.",
      tags: ["Live Web Crawl", "Fact Verification", "Cited Answers"],
      accent: "from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400"
    },
    {
      icon: <Bot className="w-8 h-8 text-indigo-400" />,
      title: "Conversational Core",
      badge: "Groq Llama 3.3 70B",
      desc: "Ultra-fast conversational AI with Redis-backed long-term memory and intelligent multi-agent routing.",
      tags: ["Sub-second Latency", "Redis Memory", "Autonomous Router"],
      accent: "from-indigo-500/20 to-violet-600/10 border-indigo-500/30 text-indigo-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden font-sans">
      
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090a0f]/80 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0d0f17] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                QuantumAI
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-purple-400">
                Multi-Agent OS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#agents" className="hover:text-white transition-colors">Agents</a>
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-white transition-colors">Credits & Plans</a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-4">
            {userData ? (
              <button
                onClick={() => navigate('/app')}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200 cursor-pointer"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-white text-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <FcGoogle className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-500/15 to-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Feature badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-purple-300 mb-8 backdrop-blur shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Next-Generation Autonomous Multi-Agent Platform</span>
        </div>

        {/* Brand Particle Text from React Bits */}
        <div className="w-full max-w-4xl h-[160px] md:h-[220px] relative mb-4">
          <ParticleText
            text="QuantumAI"
            particleSize={2.2}
            density={3.5}
            color="#ffffff"
            highlightColor="#8b5cf6"
            scatter={160}
            gatherDuration={1500}
            stagger={380}
            pointerRepel={45}
            repelRadius={130}
            idleDrift={0.8}
            trigger="hover"
            fontSize="clamp(3.5rem, 10vw, 7.5rem)"
            fontWeight={900}
            glow
          />
        </div>

        {/* Animated Slogan using StrokeText from React Bits */}
        <div className="w-full max-w-3xl h-[80px] md:h-[110px] relative mb-8 flex items-center justify-center">
          <StrokeText
            text="All Your AI Needs"
            strokeColor="#a855f7"
            fillColor="#f8fafc"
            strokeWidth={1.8}
            drawDuration={1.5}
            fillDelay={0.2}
            stagger={0.04}
            trigger="mount"
            fillMode="wipe"
            fontSize={64}
            fontWeight={800}
            letterSpacing={-2}
          />
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl text-base md:text-lg text-slate-400 leading-relaxed mb-10">
          Unleash the power of autonomous AI. A unified ecosystem for full-stack code generation, semantic PDF vector intelligence, presentations, 8K vision rendering, and live web research.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
          <button
            onClick={handleLaunchApp}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-base shadow-xl shadow-purple-500/25 flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Get Started Free — 50 Credits</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <a
            href="#agents"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 hover:text-white font-medium text-base transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Explore 6 Agents</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/[0.06] w-full max-w-4xl text-left">
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">6 Agents</div>
            <div className="text-xs text-slate-400 mt-0.5">Specialized autonomous models</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400 tracking-tight">&lt; 0.8s</div>
            <div className="text-xs text-slate-400 mt-0.5">Groq Llama 3.3 inference</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 tracking-tight">Qdrant RAG</div>
            <div className="text-xs text-slate-400 mt-0.5">Vector semantic search</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">100% Free</div>
            <div className="text-xs text-slate-400 mt-0.5">Starter credit allocation</div>
          </div>
        </div>

      </section>

      {/* ── MAIN BODY WITH REACT BITS CURSORGRID BACKGROUND & CARDSWAP STACK ── */}
      <section id="agents" className="relative py-24 px-6 border-t border-white/[0.06] bg-[#07080d]">
        
        {/* Interactive Cursor Grid from React Bits */}
        <div className="absolute inset-0 pointer-events-auto opacity-60">
          <CursorGrid
            cellSize={75}
            color="#8B5CF6"
            radius={160}
            falloff="smooth"
            holdTime={350}
            fadeDuration={700}
            lineWidth={1.2}
            maxOpacity={0.8}
            gridOpacity={0.03}
            clickPulse={true}
            pulseSpeed={550}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Agent Showcase</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              One Interface. Six Specialized Intelligences.
            </h2>
            <p className="text-base text-slate-400">
              Watch our multi-agent stack dynamically adapt to code creation, vector retrieval, presentation compilation, and vision synthesis.
            </p>
          </div>

          {/* Two-Column Section: Left details, Right CardSwap stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Feature Highlights */}
            <div className="lg:col-span-6 space-y-6">
              {agentFeatures.slice(0, 3).map((agent, i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-2xl bg-[#0f111a]/80 backdrop-blur border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 shadow-xl group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:scale-110 transition-transform duration-200">
                      {agent.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {agent.title}
                        </h3>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                          {agent.badge}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                        {agent.desc}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {agent.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.03] text-slate-400 border border-white/[0.05]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: React Bits CardSwap Component */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-[520px] h-[480px] relative flex items-center justify-center">
                <CardSwap
                  width={460}
                  height={340}
                  cardDistance={45}
                  verticalDistance={55}
                  delay={3800}
                  pauseOnHover={true}
                  skewAmount={4}
                >
                  {agentFeatures.map((agent, idx) => (
                    <Card key={idx} className="p-7 flex flex-col justify-between border border-white/[0.12] bg-[#12141f]/95 backdrop-blur-md rounded-2xl">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.1]">
                            {agent.icon}
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border bg-gradient-to-r ${agent.accent}`}>
                            {agent.badge}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{agent.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{agent.desc}</p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Autonomous Pipeline</span>
                        </div>
                        <button
                          onClick={handleLaunchApp}
                          className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-xs font-semibold text-white transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Try Now</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>

              {/* Action trigger below cards */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleLaunchApp}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FcGoogle className="w-4 h-4" />
                  <span>Sign In & Try All 6 Agents</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── ARCHITECTURE SECTION ── */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.06] bg-[#090a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Microservice Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Engineered with 7 containerized services, sub-second WebSocket pipelines, and automated zero-downtime SSL.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-[#0f111a] border border-white/[0.06]">
              <Zap className="w-7 h-7 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-white">Groq & DeepSeek Inference</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Dual high-throughput LLM pipelines for conversational responsiveness and deep-reasoning multi-file coding projects.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#0f111a] border border-white/[0.06]">
              <Database className="w-7 h-7 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white">Qdrant Vector Engine</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                High-dimensional vector indexing ensures PDF chunk searches execute with semantic relevance and precise citations.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#0f111a] border border-white/[0.06]">
              <ShieldCheck className="w-7 h-7 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white">Hardened Gateway & Auth</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                OWASP security headers, Redis session store, SameSite=None secure cross-origin cookies, and Stripe webhooks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-24 px-6 border-t border-white/[0.06] bg-[#07080d]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Transparent, Credit-Based Pricing
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            Start immediately with 50 free credits. Top up on-demand with secure Stripe checkout.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-[#0f111a] border border-white/[0.08] text-left flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300">Starter</span>
                <div className="text-3xl font-extrabold text-white mt-4">$0</div>
                <div className="text-xs text-slate-400 mt-1">Free upon Google signup</div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 50 Free credits</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Access to all 6 agents</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Web search & PDF RAG</li>
                </ul>
              </div>
              <button 
                onClick={handleLaunchApp}
                className="w-full mt-8 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-purple-950/40 to-[#0f111a] border border-purple-500/40 text-left flex flex-col justify-between relative shadow-2xl shadow-purple-500/10">
              <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[11px] font-bold text-white tracking-wide uppercase">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Pro Developer</span>
                <div className="text-3xl font-extrabold text-white mt-4">$10 <span className="text-sm font-normal text-slate-400">/ pack</span></div>
                <div className="text-xs text-purple-300 mt-1">1,000 High-Speed Credits</div>
                <ul className="mt-6 space-y-3 text-sm text-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> 1,000 Quantum Credits</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> DeepSeek V3 full coding projects</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> 8K Vision generation & PPT downloads</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Priority throughput</li>
                </ul>
              </div>
              <button 
                onClick={handleLaunchApp}
                className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl bg-[#0f111a] border border-white/[0.08] text-left flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300">Custom</span>
                <div className="text-3xl font-extrabold text-white mt-4">Enterprise</div>
                <div className="text-xs text-slate-400 mt-1">Dedicated compute & vectors</div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited RAG collections</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated Qdrant cluster</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom agent fine-tuning</li>
                </ul>
              </div>
              <button 
                onClick={handleLaunchApp}
                className="w-full mt-8 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTH MODAL / PORTAL WITH REACT BITS MAGICRINGS ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0f111c] border border-white/[0.12] rounded-3xl p-8 overflow-hidden shadow-2xl">
            
            {/* React Bits MagicRings Background Effect */}
            <div className="absolute inset-0 opacity-40">
              <MagicRings
                color="#8B5CF6"
                colorTwo="#38BDF8"
                ringCount={6}
                speed={0.9}
                attenuation={9}
                lineThickness={2}
                baseRadius={0.35}
                opacity={0.8}
                blur={0}
                followMouse={true}
                mouseInfluence={0.15}
                hoverScale={1.15}
                clickBurst={true}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] mb-5 shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#0d0f17] rounded-[15px] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                Welcome to QuantumAI
              </h3>
              <p className="text-sm text-slate-400 mt-2 mb-8">
                Sign in to launch your autonomous multi-agent workspace and claim your 50 free credits.
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <FcGoogle className="w-5 h-5" />
                <span>{authLoading ? "Authenticating..." : "Continue with Google"}</span>
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel and return to home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-white/[0.06] bg-[#06070a] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">QuantumAI Multi-Agent Platform</span>
            <span>•</span>
            <span>All rights reserved &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#agents" className="hover:text-slate-300 transition-colors">Agents</a>
            <a href="#features" className="hover:text-slate-300 transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
