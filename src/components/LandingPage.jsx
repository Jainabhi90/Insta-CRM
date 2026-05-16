import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Instagram,
  MessageSquare,
  Sparkles,
  Target,
  Zap,
  Play,
  ArrowRight,
  Menu
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 }
};

export function LandingPage({
  onGetStarted,
  onLogin,
  onCreateAccount,
  onGoToPricing,
  isGoogleAuthenticated,
  onGoToGoogleLanding,
  onLogout,
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#f1f5f9,transparent)]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">InstaLead</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a href="#" className="hover:text-slate-900 transition-colors">Home</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
            <a href="#reviews" className="hover:text-slate-900 transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#blog" className="hover:text-slate-900 transition-colors">Blog</a>
          </nav>
          <div className="flex items-center gap-3">
            {!isGoogleAuthenticated ? (
              <>
                <Button variant="outline" className="hidden sm:inline-flex rounded-full text-slate-600 border-slate-200 hover:bg-slate-50 px-6 h-10" onClick={onLogin}>
                  Login
                </Button>
                <Button className="hidden sm:inline-flex rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm px-6 h-10" onClick={onGoToGoogleLanding}>
                  Signup
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="hidden sm:inline-flex rounded-full text-slate-600 border-slate-200 hover:bg-slate-50 px-6 h-10" onClick={onLogout}>
                  Logout
                </Button>
                <Button className="hidden sm:inline-flex rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm px-6 h-10" onClick={onCreateAccount || onGetStarted}>
                  Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-20 pb-0 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
          <motion.div {...fadeIn}>
            <h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
              Turn <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Instagram Comments</span> <br className="hidden sm:block" />
              into Leads in Seconds
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              Just connect your Instagram, we'll turn every comment and DM into a trackable lead, complete with auto-replies, scoring, and a clean pipeline.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                className="group flex h-14 items-center gap-3 rounded-full bg-slate-900 px-8 text-white hover:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform hover:scale-105 active:scale-95"
                onClick={onCreateAccount || onGetStarted}
              >
                <Instagram className="w-5 h-5" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Connect with</div>
                  <div className="text-sm font-bold">Instagram</div>
                </div>
              </button>
              <span className="text-sm font-bold text-slate-400">Or</span>
              <button 
                className="group flex h-14 items-center gap-3 rounded-full bg-slate-900 px-8 text-white hover:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform hover:scale-105 active:scale-95"
                onClick={onGoToGoogleLanding}
              >
                <Play className="w-5 h-5 fill-white" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Watch our</div>
                  <div className="text-sm font-bold">Video Demo</div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Hero 3 Phones Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-20 relative mx-auto max-w-5xl h-[450px] sm:h-[550px] lg:h-[600px]"
          >
            <div className="absolute inset-0 flex justify-center items-end gap-2 sm:gap-6">
              
              {/* Left Phone */}
              <div className="hidden sm:block w-[260px] h-[450px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl rotate-[-6deg] translate-y-12 translate-x-8 overflow-hidden relative z-0">
                <div className="absolute top-0 inset-x-0 h-6 bg-white z-10 flex justify-center">
                  <div className="w-24 h-4 bg-slate-900 rounded-b-2xl"></div>
                </div>
                <div className="p-4 pt-10 h-full bg-slate-50 flex flex-col">
                  <h3 className="font-bold text-lg mb-4">Recent DMs</h3>
                  <div className="space-y-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-2 w-20 bg-slate-800 rounded-full"></div>
                          <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Phone */}
              <div className="w-[300px] sm:w-[320px] h-[500px] sm:h-[580px] bg-white rounded-[2.5rem] border-[10px] border-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.15)] z-10 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-7 bg-white z-20 flex justify-center">
                  <div className="w-28 h-5 bg-slate-900 rounded-b-2xl"></div>
                </div>
                <div className="p-6 pt-14 h-full bg-white flex flex-col text-center">
                  <h3 className="font-bold text-2xl mb-2 text-slate-900 leading-tight">What Auto-Reply <br/> Will You Create?</h3>
                  <p className="text-xs text-slate-500 mb-8">Active Leads: 418 today</p>
                  
                  <div className="w-16 h-16 bg-slate-900 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-10 bg-slate-50 rounded-full border border-slate-100 flex items-center px-4 gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-400"></div>
                      <div className="h-2 w-32 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-10 bg-slate-50 rounded-full border border-slate-100 flex items-center px-4 gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                      <div className="h-2 w-24 bg-slate-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Phone */}
              <div className="hidden sm:block w-[260px] h-[450px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl rotate-[6deg] translate-y-12 -translate-x-8 overflow-hidden relative z-0">
                <div className="absolute top-0 inset-x-0 h-6 bg-white z-10 flex justify-center">
                  <div className="w-24 h-4 bg-slate-900 rounded-b-2xl"></div>
                </div>
                <div className="p-4 pt-10 h-full bg-slate-50 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Lead Score</h3>
                    <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end gap-2 pb-4">
                    <div className="flex items-end gap-2 h-32 px-2">
                      <div className="w-full bg-slate-200 rounded-t-md h-[40%]"></div>
                      <div className="w-full bg-slate-300 rounded-t-md h-[60%]"></div>
                      <div className="w-full bg-slate-800 rounded-t-md h-[90%]"></div>
                      <div className="w-full bg-slate-400 rounded-t-md h-[50%]"></div>
                      <div className="w-full bg-slate-900 rounded-t-md h-[100%]"></div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <div className="h-2 w-16 bg-slate-800 rounded-full mb-2"></div>
                      <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Massive White fade at bottom to blend phones into background */}
            <div className="absolute inset-x-0 bottom-[-50px] h-64 bg-gradient-to-t from-white via-white to-transparent pointer-events-none z-20"></div>
          </motion.div>
        </section>

        {/* Social Proof & Stats */}
        <section className="bg-white pt-10 pb-20 relative z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              Loved by 500+ brands worldwide
            </p>
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="text-xs font-bold text-slate-700 ml-2">4.9/5 from 200+ reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { label: "Active Brands", value: "500+" },
                { label: "Comments Processed", value: "2.4M+" },
                { label: "Reply Speed Uplift", value: "8.3x" },
                { label: "Avg. Setup Time", value: "4 min" },
              ].map((stat, i) => (
                <div key={i} className="border border-slate-100 rounded-2xl py-8 px-4 shadow-sm bg-white hover:border-slate-200 transition-colors">
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{stat.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Features Section */}
        <section id="features" className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">• Features</h2>
              <h3 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Everything You Need to <br/> Dominate Instagram DMs
              </h3>
              <p className="text-lg text-slate-500 font-medium">
                One app. Every tool serious creators need to grow fast and <br/> handle DMs without burnout.
              </p>
            </motion.div>

            <motion.div 
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Feature 1 - Chart */}
              <motion.div variants={fadeIn} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Model Performance</h4>
                <p className="text-sm text-slate-500 mb-8">Track how your AI replies perform over time and identify revenue lift.</p>
                <div className="h-48 w-full flex items-end gap-2 px-4">
                  <div className="w-full bg-slate-100 rounded-t-lg h-[30%]"></div>
                  <div className="w-full bg-slate-200 rounded-t-lg h-[45%]"></div>
                  <div className="w-full bg-slate-300 rounded-t-lg h-[60%]"></div>
                  <div className="w-full bg-slate-400 rounded-t-lg h-[80%]"></div>
                  <div className="w-full bg-slate-900 rounded-t-lg h-[100%] shadow-lg"></div>
                </div>
              </motion.div>

              {/* Feature 2 - Funnel */}
              <motion.div variants={fadeIn} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">AI Workflow Funnel</h4>
                <p className="text-sm text-slate-500 mb-8">Visualize how your data moves from comment to closed lead instantly.</p>
                <div className="h-48 w-full flex flex-col gap-2 justify-center">
                  <div className="w-full bg-slate-900 rounded-md h-8 text-white text-xs flex items-center px-4 font-bold">45,820 Impressions</div>
                  <div className="w-[80%] bg-slate-600 rounded-md h-8 text-white text-xs flex items-center px-4 font-bold">8,234 Comments</div>
                  <div className="w-[50%] bg-slate-400 rounded-md h-8 text-white text-xs flex items-center px-4 font-bold">2,456 DMs</div>
                  <div className="w-[30%] bg-slate-200 rounded-md h-8 text-slate-900 text-xs flex items-center px-4 font-bold">1,364 Leads</div>
                </div>
              </motion.div>

              {/* Feature 3 - Intelligence */}
              <motion.div variants={fadeIn} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">User Intelligence</h4>
                <p className="text-sm text-slate-500 mb-8">Understand follower sentiment and measure engagement accurately.</p>
                <div className="flex gap-8 items-center h-32">
                  <div className="w-24 h-24 rounded-full border-[12px] border-slate-100 border-t-slate-900 border-r-slate-900"></div>
                  <div className="space-y-3 flex-1">
                    <div className="h-3 bg-slate-900 rounded-full w-[80%]"></div>
                    <div className="h-3 bg-slate-200 rounded-full w-[40%]"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-[60%]"></div>
                  </div>
                </div>
              </motion.div>

              {/* Feature 4 - Monitoring */}
              <motion.div variants={fadeIn} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">System Monitoring</h4>
                <p className="text-sm text-slate-500 mb-8">Maintain health across all connected Instagram workspaces.</p>
                <div className="grid grid-cols-4 gap-2 h-32">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className={`rounded-md ${i % 3 === 0 ? 'bg-slate-900' : i % 5 === 0 ? 'bg-slate-400' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Watch It Happen (App View) */}
        <section className="py-24 bg-white relative">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div {...fadeIn}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">• In Action</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                From Rough Idea to Closed Lead <br/> Watch It Happen
              </h3>
              <p className="text-lg text-slate-500 font-medium mb-16 max-w-2xl mx-auto">
                Just drop a prompt or paste your old comment scripts. InstaLead transforms it into a polished, high-performing auto-reply sequence in under 4 seconds.
              </p>
            </motion.div>

            {/* Browser Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white overflow-hidden text-left"
            >
              {/* Browser Header */}
              <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto w-64 h-6 bg-white rounded-md border border-slate-200 shadow-sm flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 font-medium">instalead.app/automations</span>
                </div>
              </div>
              {/* Browser Content */}
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-48 border-r border-slate-100 p-4 bg-slate-50 hidden sm:block">
                  <div className="space-y-4">
                    <div className="h-4 w-20 bg-slate-200 rounded-full mb-8"></div>
                    <div className="h-3 w-24 bg-slate-900 rounded-full"></div>
                    <div className="h-3 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-28 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
                {/* Main */}
                <div className="flex-1 p-8 bg-white flex flex-col gap-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div className="h-5 w-40 bg-slate-900 rounded-full"></div>
                    <div className="h-8 w-24 bg-slate-100 border border-slate-200 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-6 flex flex-col gap-4">
                    <div className="h-4 w-[60%] bg-slate-300 rounded-full"></div>
                    <div className="h-4 w-[80%] bg-slate-200 rounded-full"></div>
                    <div className="h-4 w-[40%] bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="flex justify-end">
                    <div className="h-10 w-32 bg-slate-900 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                From Idea to Closed Lead <br/> in 3 Simple Steps
              </h3>
              <p className="text-lg text-slate-500 font-medium">
                No learning curve. No complicated setup. Just open the <br/> app and start automating.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Connect Profile", desc: "Type your rough idea, paste a URL, or record a voice note. InstaLead understands the context instantly." },
                { step: "02", title: "AI Drafts Reply", desc: "InstaLead generates a scroll-stopping reply sequence complete with tone, formatting, and the right links." },
                { step: "03", title: "Review & Automate", desc: "Make any tweaks you want, then save it straight to your automated DM funnel." },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-6">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{item.desc}</p>
                  
                  {/* Fake small mockup inside step */}
                  <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <div className="h-3 w-16 bg-slate-300 rounded-full mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-[80%] bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials - Dark Card */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              {...fadeIn}
              className="bg-slate-900 rounded-[3rem] p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#334155,transparent_50%)]"></div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 relative z-10">• Testimonials</h2>
              <h3 className="text-4xl sm:text-5xl font-bold text-white mb-16 tracking-tight relative z-10">
                Creators Are Growing. <br/> Fast.
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {[
                  { name: "Sarah Jenkins", handle: "@sarahj", role: "E-com Founder", text: "This is the only IG tool I need. It completely automated my comment replies and now my sales are up 40%." },
                  { name: "Marcus Growth", handle: "@marcusg", role: "Agency Owner", text: "Best Instagram writing tool. The lead scoring feature alone saves my team 15 hours a week." },
                  { name: "Zoe Designs", handle: "@zoedesigns", role: "Creator", text: "Turned my messy inbox into a clean pipeline. I don't miss any brand deal requests anymore." },
                  { name: "Sam C.", handle: "@samcrypto", role: "Consultant", text: "Started at 800 followers. Hit 10K in 3 months just by being able to engage with everyone instantly." },
                ].map((review, i) => (
                  <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl text-left flex flex-col gap-4">
                    <p className="text-slate-300 text-sm leading-relaxed flex-1">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-600"></div>
                      <div>
                        <p className="text-white text-sm font-bold">{review.name}</p>
                        <p className="text-slate-400 text-xs">{review.handle} • {review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">• Pricing</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Simple, Transparent <br/> Pricing
              </h3>
              <p className="text-lg text-slate-500 font-medium">Start for free, upgrade when you need more power.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Free */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Free</h4>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-500 font-medium mb-1">/mo</span>
                </div>
                <div className="space-y-4 mb-8">
                  {['1 Instagram Account', '100 Auto-Replies/mo', 'Basic Pipeline'].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-slate-900" /> {f}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full rounded-full border-slate-200 text-slate-900 h-12 font-bold" onClick={onCreateAccount || onGetStarted}>Get Started Free</Button>
              </div>

              {/* Pro (Dark) */}
              <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl relative scale-105 z-10">
                <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                  <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Pro</h4>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">$9.99</span>
                  <span className="text-slate-400 font-medium mb-1">/mo</span>
                </div>
                <div className="space-y-4 mb-8">
                  {['3 Instagram Accounts', 'Unlimited Auto-Replies', 'AI Lead Scoring', 'Advanced Analytics'].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-white" /> {f}
                    </div>
                  ))}
                </div>
                <Button className="w-full rounded-full bg-white text-slate-900 hover:bg-slate-100 h-12 font-bold" onClick={onCreateAccount || onGetStarted}>Start 14-Day Trial</Button>
              </div>

              {/* Agency */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Agency</h4>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900">$29.99</span>
                  <span className="text-slate-500 font-medium mb-1">/mo</span>
                </div>
                <div className="space-y-4 mb-8">
                  {['Unlimited Accounts', 'White-label Reports', 'Dedicated Account Manager'].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-slate-900" /> {f}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full rounded-full border-slate-200 text-slate-900 h-12 font-bold" onClick={onCreateAccount || onGetStarted}>Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeIn} className="text-center mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">• FAQ</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Questions? We've Got <br/> Answers.
              </h3>
              <p className="text-lg text-slate-500 font-medium">Everything you need to know about InstaLead.</p>
            </motion.div>

            <div className="space-y-4">
              {[
                "How does InstaLead connect to Instagram?",
                "Will my account get banned for using automation?",
                "Can I cancel my subscription anytime?",
                "Does it work for Creator accounts?",
              ].map((q, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl p-6 flex justify-between items-center cursor-pointer hover:border-slate-300 transition-colors">
                  <span className="font-bold text-slate-900">{q}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section (Dark Mode Footer) */}
        <section className="relative py-32 bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute right-0 bottom-0 opacity-10">
            {/* Fake overlapping squares decoration */}
            <div className="w-64 h-64 border-4 border-white rounded-[3rem] rotate-12 translate-x-20 translate-y-20"></div>
            <div className="w-64 h-64 border-4 border-white rounded-[3rem] rotate-45 absolute top-0 left-0"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <motion.div {...fadeIn}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">• Launch Your Growth</h2>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-10 tracking-tight leading-[1.1]">
                Start Creating <br/> Viral Leads Today
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold w-full sm:w-auto" onClick={onCreateAccount || onGetStarted}>
                  <Instagram className="w-5 h-5 mr-2" /> Connect Instagram
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-700 text-white hover:bg-slate-800 font-bold w-full sm:w-auto" onClick={onGoToGoogleLanding}>
                  <Play className="w-5 h-5 mr-2 fill-white" /> Watch Demo
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
                  <span className="text-white font-bold text-sm">12K+</span>
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Users</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
                  <span className="text-white font-bold text-sm">4.9</span>
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
                  <span className="text-white font-bold text-sm">2.4M</span>
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Posts</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer Minimal */}
      <footer className="bg-slate-950 pt-0 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-white">
              <Sparkles className="h-3 w-3" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">InstaLead</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-white transition-colors">X (Twitter)</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
