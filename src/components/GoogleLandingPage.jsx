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
  Menu,
  Lock,
  RefreshCw,
  User,

  Mail,
  Bell,
  ShieldAlert,
  Settings,
  FileText,
  ShieldCheck,
  Network,
  Filter,
  LayoutDashboard,
  Folder,
  Users,
  History,
} from "lucide-react";
import { buildGoogleAuthorizeUrl } from "../lib/googleAuthConfig";

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

export function GoogleLandingPage() {
  const handleGoogleLogin = () => {
    const authorizeUrl = buildGoogleAuthorizeUrl();
    if (!authorizeUrl) {
      window.alert("Google login is not configured. Set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_REDIRECT_URI.");
      return;
    }
    window.location.assign(authorizeUrl);
  };

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
            <span className="ml-2 text-xs font-medium text-slate-400 border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-full hidden sm:inline-block">Instagram CRM</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a href="/" className="hover:text-slate-900 transition-colors">Home</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button className="hidden sm:inline-flex rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm px-6 h-10" onClick={handleGoogleLogin}>
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="w-5 h-5" />
            </Button>
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
                onClick={handleGoogleLogin}
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Connect with</div>
                  <div className="text-sm font-bold">Google Workspace</div>
                </div>
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Free 14-day trial, no credit card
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
              <motion.div 
                animate={{ 
                  y: [48, 28, 48], 
                  rotate: [-6, -4, -6] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                style={{ x: 32 }}
                className="hidden sm:block w-[260px] h-[450px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden relative z-0"
              >
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
              </motion.div>

              {/* Center Phone */}
              <motion.div 
                animate={{ 
                  y: [0, -20, 0] 
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="w-[300px] sm:w-[320px] h-[500px] sm:h-[580px] bg-white rounded-[2.5rem] border-[10px] border-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.15)] z-10 overflow-hidden relative"
              >
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
              </motion.div>

              {/* Right Phone */}
              <motion.div 
                animate={{ 
                  y: [48, 28, 48], 
                  rotate: [6, 4, 6] 
                }}
                transition={{ 
                  duration: 6.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
                style={{ x: -32 }}
                className="hidden sm:block w-[260px] h-[450px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden relative z-0"
              >
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
              </motion.div>
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

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Card 1: Authentication */}
              
             <motion.div 
        {...fadeIn}
        className="w-full rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden bg-slate-50 text-slate-800 shadow-[10px_10px_40px_#cbd5e1,-10px_-10px_40px_#ffffff] border border-white/40 flex flex-col"
      >
        
        {/* Top Left Header Section */}
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-none mb-4">
            Authentication <br/> & Authorization.
          </h2>
          <div className="flex gap-1.5 ml-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
          </div>
        </div>

        {/* 2x2 Feature Split Layout Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-8 lg:gap-x-12 gap-y-12 flex-1">
          
          {/* Item 1: Multi-Account Management (Graphic Left, Text Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Outer Ring with Embedded Circular Exchange Arrows */}
            <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center shrink-0 relative shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] border border-slate-200">
              
              {/* Custom SVG Loop Arrow Tracks matching the screenshot */}
              <svg className="absolute inset-0 w-full h-full text-slate-400 p-2 transform -rotate-45" viewBox="0 0 100 100" fill="none">
                <path d="M 50,12 A 38,38 0 0,1 88,50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="88,50 83,43 93,43" fill="currentColor" />
                
                <path d="M 50,88 A 38,38 0 0,1 12,50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="12,50 17,57 7,57" fill="currentColor" />
              </svg>

              {/* Stacked Brand Circles Inside the Loop */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Instagram Circle (Top Left Position) */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/40 z-10 text-white"
                  style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </motion.div>
                {/* Google Circle (Bottom Right Position) */}
                <motion.div 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 z-20">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </motion.div>
              </div>

            </div>
            {/* Label Content */}
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Multi-Account Management</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:mx-0">
                Support for multiple Instagram and Google account integrations per user.
              </p>
            </div>
          </div>

          {/* Item 2: Secure OAuth 2.0 Integration (Text Left, Graphic Right) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Secure OAuth 2.0 Integration</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:ml-auto">
                Industry-standard authentication flows for Instagram and Google.
              </p>
            </div>
            {/* Right Graphic Frame */}
            <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center border-4 border-slate-300/40 shrink-0 relative shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <div className="relative w-20 h-20 flex items-center justify-start pl-2">
                {/* Dark Slate Lock Engine Base */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 via-slate-500 to-slate-800 flex items-center justify-center text-white shadow-md">
                  <Lock className="w-5 h-5" />
                </div>
                
                {/* Floating Stacked Brand Cards (Matches exact placement from design mockup) */}
                <div className="absolute right-0 top-1.5 flex flex-col gap-1.5 z-30">
                  {/* IG Floating Smooth Card */}
                  <motion.div 
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center shadow-[2px_4px_10px_rgba(15,23,42,0.08)] border border-white/40 z-10 text-white"
                    style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </motion.div>
                  {/* Google Floating Smooth Card */}
                  <motion.div 
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-[2px_4px_10px_rgba(15,23,42,0.08)] border border-slate-100">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Item 3: Session Management (Text Left, Graphic Right) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Session Management</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:ml-auto">
                Persistent, secure session handling with automatic token refresh.
              </p>
            </div>
            {/* Right Graphic Frame */}
            <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center border-4 border-slate-300/40 shrink-0 relative shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <div className="absolute inset-2 rounded-full border-[10px] border-slate-100 border-l-slate-800 border-t-slate-800 bg-white shadow-inner flex items-center justify-center rotate-45">
                <RefreshCw className="w-6 h-6 text-slate-700 -rotate-45" />
              </div>
              {/* Floating mini icons */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-[-10px] bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col items-center justify-center p-2 z-20">
                <RefreshCw className="w-3 h-3 text-slate-700 mb-1" />
                <span className="text-[9px] font-bold">Refresh</span>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 right-[-10px] bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col items-center justify-center p-2 z-20">
                <div className="w-3 h-3 rounded bg-slate-200 mb-1"></div>
                <span className="text-[9px] font-bold">Token</span>
              </motion.div>
            </div>
          </div>
          
          {/* Item 4: Role-Based Access Control (Graphic Left, Text Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center border-4 border-slate-300/40 shrink-0 relative shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <div className="flex flex-col items-center space-y-2 text-slate-700">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white border border-slate-600 shadow-sm">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="w-12 h-1.5 border-t border-x border-slate-300 rounded-t-sm"></div>
                <div className="flex space-x-2">
                  <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center text-white"><span className="w-1.5 h-1.5 bg-white rounded-full"></span></div>
                  <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center text-white"><span className="w-1.5 h-1.5 bg-white rounded-full"></span></div>
                  <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center text-white"><span className="w-1.5 h-1.5 bg-white rounded-full"></span></div>
                </div>
              </div>
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Role-Based Access Control</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:mx-0">
                Owner and workspace-level permission management.
              </p>
            </div>
          </div>

        </div>

        
      </motion.div>

              {/* Placeholder Card 2 */}
              <motion.div 
        {...fadeIn}
        className="w-full rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden bg-slate-50 text-slate-800 shadow-[10px_10px_40px_#cbd5e1,-10px_-10px_40px_#ffffff] border border-white/40 flex flex-col"
      >
        
        {/* Background Circuit/Connecting Lines (Matches Slide Design precisely) */}
        <svg className="absolute inset-0 w-full h-full text-slate-200 pointer-events-none stroke-current stroke-[1.5] fill-none hidden md:block" viewBox="0 0 800 500">
          <path d="M 160,210 L 380,210 L 380,310 L 640,310" strokeDasharray="4,4" />
          <path d="M 640,210 L 500,210 L 500,380 L 160,380" strokeDasharray="4,4" />
        </svg>

        {/* Top Header Row with Subtle Profile Tag */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-none mb-4">
              Instagram  Integration.
            </h2>
            <div className="flex gap-1.5 ml-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
            </div>
          </div>
          
          </div>

        {/* 2x2 Clean Alternating Rounded-Square Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-8 lg:gap-x-12 gap-y-12 flex-1 relative z-10">
          
          {/* Item 1: Comment Management (Icon Left, Text Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Neumorphic Squared-Circle Icon Wrapper */}
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] relative">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner"
              >
                <MessageSquare className="w-7 h-7" />
              </motion.div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Comment Management</h4>
              <div className="flex gap-1 my-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px]">
                Monitor, view, and respond to comments on Instagram posts seamlessly.
              </p>
            </div>
          </div>

          {/* Item 2: Direct Message Inbox (Text Left, Icon Right) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Direct Message Inbox</h4>
              <div className="flex gap-1 my-1.5 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] ml-auto">
                Unified inbox for managing direct messages across all connected accounts.
              </p>
            </div>
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner"
              >
                <Mail className="w-7 h-7" />
              </motion.div>
            </div>
          </div>

          {/* Item 3: Real-time Notifications (Text Left, Icon Right) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Real-time Notifications</h4>
              <div className="flex gap-1 my-1.5 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] ml-auto">
                Webhook-based real-time updates for sudden new comments and private messages.
              </p>
            </div>
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner"
              >
                <Bell className="w-7 h-7" />
              </motion.div>
            </div>
          </div>

          {/* Item 4: Account Registry (Icon Left, Text Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner"
              >
                <ShieldAlert className="w-7 h-7" />
              </motion.div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Account Registry</h4>
              <div className="flex gap-1 my-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px]">
                Centralized registry of securely connected profiles and metadata tracking.
              </p>
            </div>
          </div>

        </div>

        
        
      </motion.div>

              {/* Placeholder Card 3 */}
              <motion.div 
        {...fadeIn}
        className="w-full rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden bg-slate-50 text-slate-800 shadow-[10px_10px_40px_#cbd5e1,-10px_-10px_40px_#ffffff] border border-white/40 flex flex-col"
      >
        
        {/* Background Circuit/Connecting Lines (Matches Slide Design precisely) */}
        <svg className="absolute inset-0 w-full h-full text-slate-200 pointer-events-none stroke-current stroke-[1.5] fill-none hidden md:block" viewBox="0 0 800 500">
          <path d="M 160,210 L 380,210 L 380,310 L 640,310" strokeDasharray="4,4" />
          <path d="M 640,210 L 500,210 L 500,380 L 160,380" strokeDasharray="4,4" />
        </svg>

        {/* Top Header Row with Subtle Profile Tag */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-none mb-4">Automation Engine</h2>
            <div className="flex gap-1.5 ml-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
            </div>
          </div>
          
          
        </div>

        {/* 2x2 Clean Alternating Rounded-Square Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-8 lg:gap-x-12 gap-y-12 flex-1 relative z-10">
          
          {/* Item 1: Smart Workflows (Icon Left, Text Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Neumorphic Squared-Circle Icon Wrapper */}
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner"
              >
                <Settings className="w-7 h-7" />
              </motion.div>
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Smart Workflows</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:mx-0">
                Define conditional automation rules for comments and DMs.
              </p>
            </div>
          </div>

          {/* Item 2: Campaign Management (Text Left, Icon Right) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Campaign Management</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:ml-auto">
                Launch targeted campaigns with performance tracking tools.
              </p>
            </div>
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner"
              >
                <BarChart3 className="w-7 h-7" />
              </motion.div>
            </div>
          </div>

          {/* Item 3: Customizable Responses (Text Left, Icon Right) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Customizable Responses</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:ml-auto">
                Create templated responses triggered by specific keywords or conditions.
              </p>
            </div>
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner"
              >
                <FileText className="w-7 h-7" />
              </motion.div>
            </div>
          </div>

          {/* Item 4: Audit Logging (Icon Left, Text Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner"
              >
                <ShieldCheck className="w-7 h-7" />
              </motion.div>
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Audit Logging</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:mx-0">
                Complete audit trail history of all background automation executions.
              </p>
            </div>
          </div>

        </div>

        
        
      </motion.div>

              {/* Placeholder Card 4 */}
              <motion.div 
        {...fadeIn}
        className="w-full rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden bg-slate-50 text-slate-800 shadow-[10px_10px_40px_#cbd5e1,-10px_-10px_40px_#ffffff] border border-white/40 flex flex-col"
      >
        
        {/* Background Circuitry/Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full text-slate-200 pointer-events-none stroke-current stroke-[1.2] fill-none hidden md:block" viewBox="0 0 800 500">
          <path d="M 160,210 L 380,210 L 380,310 L 640,310" strokeDasharray="4,4" />
          <path d="M 640,210 L 500,210 L 500,380 L 160,380" strokeDasharray="4,4" />
          <path d="M 380,210 L 380,120 L 580,120" strokeDasharray="2,2" />
          <path d="M 500,380 L 500,440 L 320,440" strokeDasharray="2,2" />
        </svg>

        {/* Top Header Row with Subtle Account/User Tag */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-none mb-4">
              Analytics & <br /> Reporting.
            </h2>
            <div className="flex gap-1.5 ml-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
            </div>
          </div>
          
          {/* Top Right User Context Badge */}
          
        </div>

        {/* 2x2 Neumorphic Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-8 lg:gap-x-12 gap-y-12 flex-1 relative z-10">
          
          {/* Item 1: Post Performance Metrics (Icon Left, Text Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Soft Squared Rounding Neumorphic Block */}
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shadow-inner"
              >
                <BarChart3 className="w-7 h-7" />
              </motion.div>
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Post Performance Metrics</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:mx-0">
                Track engagement, reach, and impressions for published content.
              </p>
            </div>
          </div>

          {/* Item 2: Lead Tracking (Text Left, Icon Right) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Lead Tracking</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:ml-auto">
                Comprehensive lead management and conversion funnel analysis.
              </p>
            </div>
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner"
              >
                <Filter className="w-7 h-7" />
              </motion.div>
            </div>
          </div>

          {/* Item 3: Workspace Analytics (Text Left, Icon Right) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Workspace Analytics</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:ml-auto">
                Aggregate insights across multiple connected Instagram accounts.
              </p>
            </div>
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner"
              >
                <Network className="w-7 h-7" />
              </motion.div>
            </div>
          </div>

          {/* Item 4: Real-time Dashboards (Icon Left, Text Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner"
              >
                <LayoutDashboard className="w-7 h-7" />
              </motion.div>
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Real-time Dashboards</h4>
              <div className="flex gap-1 my-1.5 justify-center sm:justify-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto sm:mx-0">
                Live dashboard updates tracking key real-time performance indicators.
              </p>
            </div>
          </div>

        </div>

       
        
      </motion.div>

      {/* Placeholder Card 5 */}
      <motion.div 
        {...fadeIn}
        className="w-full xl:col-span-2 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden bg-slate-50 text-slate-800 shadow-[10px_10px_40px_#cbd5e1,-10px_-10px_40px_#ffffff] border border-white/40 flex flex-col"
      >
        
        {/* Background Circuitry / Architectural Connector Lines */}
        <svg className="absolute inset-0 w-full h-full text-slate-200 pointer-events-none stroke-current stroke-[1.2] fill-none hidden md:block" viewBox="0 0 800 500">
          <path d="M 180,210 L 400,210 L 400,320 L 620,320" strokeDasharray="4,4" />
          <path d="M 180,210 L 180,320 L 320,320" strokeDasharray="4,4" />
          <path d="M 400,210 L 400,140 L 580,140" strokeDasharray="2,2" />
        </svg>

        {/* Top Header Row with Profile Identity Accent */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-none mb-4">
              Team <br /> Collaboration.
            </h2>
            <div className="flex gap-1.5 ml-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
            </div>
          </div>
          
          
        </div>

        {/* 3-Column Asset Row Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 relative z-10 mb-6">
          
          {/* Item 1: Workspace Management */}
          <div className="flex flex-col items-start gap-4">
            {/* Neumorphic Rounded Wrapper with Label Index */}
            <div className="relative">
              <span className="absolute -top-4 -left-4 text-3xl font-extrabold text-slate-200/80 select-none">1</span>
              <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner"
                >
                  <Folder className="w-7 h-7" />
                </motion.div>
              </div>
            </div>
            <div className="mt-2">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Workspace Management</h4>
              <div className="flex gap-1 my-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[220px]">
                Organize team members and accounts into logical, contained workspaces.
              </p>
            </div>
          </div>

          {/* Item 2: User Management */}
          <div className="flex flex-col items-start gap-4 md:translate-y-4">
            <div className="relative">
              <span className="absolute -top-4 -left-4 text-3xl font-extrabold text-slate-200/80 select-none">2</span>
              <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner"
                >
                  <Users className="w-7 h-7" />
                </motion.div>
              </div>
            </div>
            <div className="mt-2">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">User Management</h4>
              <div className="flex gap-1 my-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[220px]">
                Invite and manage team members with highly granular permission controls.
              </p>
            </div>
          </div>

          {/* Item 3: Activity History */}
          <div className="flex flex-col items-start gap-4">
            <div className="relative">
              <span className="absolute -top-4 -left-4 text-3xl font-extrabold text-slate-200/80 select-none">3</span>
              <div className="w-28 h-28 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-200 shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]">
                <motion.div 
                  animate={{ rotate: [0, -45, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner"
                >
                  <History className="w-7 h-7" />
                </motion.div>
              </div>
            </div>
            <div className="mt-2">
              <h4 className="text-lg font-bold text-slate-900 leading-snug">Activity History</h4>
              <div className="flex gap-1 my-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[220px]">
                Track all user actions and system events for complete compliance and auditing.
              </p>
            </div>
          </div>

        </div>

        
        
      </motion.div>

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
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold w-full sm:w-auto" onClick={handleGoogleLogin}>
                  <div className="w-5 h-5 mr-2 rounded-full bg-slate-900 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-white rounded-full"></div></div> 
                  Connect Google Workspace
                </Button>
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
