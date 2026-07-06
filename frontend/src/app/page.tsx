"use client";

import { motion } from "framer-motion";
import {
  Search,
  BarChart3,
  Brain,
  Shield,
  Users,
  TrendingUp,
  Zap,
  Target,
  ChevronRight,
  Star,
  ArrowRight,
  Activity,
  Database,
  LineChart,
  Globe,
  Lock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Floating Particles ──────────────────────────────────────────────────────

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-electric/10"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 group cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-electric-bright" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ─── Pipeline Step ───────────────────────────────────────────────────────────

function PipelineStep({
  step,
  title,
  description,
  delay,
}: {
  step: number;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-4 items-start"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-emerald flex items-center justify-center text-white font-bold text-sm shrink-0">
        {step}
      </div>
      <div>
        <h4 className="text-base font-semibold text-text-primary mb-1">{title}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Testimonial Card ────────────────────────────────────────────────────────

function TestimonialCard({
  quote,
  name,
  role,
  delay,
}: {
  quote: string;
  name: string;
  role: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6"
    >
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber fill-amber" />
        ))}
      </div>
      <p className="text-sm text-text-secondary mb-4 italic leading-relaxed">
        &quot;{quote}&quot;
      </p>
      <div>
        <p className="text-sm font-semibold text-text-primary">{name}</p>
        <p className="text-xs text-text-muted">{role}</p>
      </div>
    </motion.div>
  );
}

// ─── Pricing Card ────────────────────────────────────────────────────────────

function PricingCard({
  name,
  price,
  features,
  popular,
  delay,
}: {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-6 relative ${popular ? "border-electric/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]" : ""}`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-electric to-emerald text-white text-xs font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-lg font-bold text-text-primary mb-1">{name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold text-gradient">{price}</span>
        {price !== "Custom" && <span className="text-text-muted text-sm">/month</span>}
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <button
        className={popular ? "btn-primary w-full justify-center" : "btn-secondary w-full justify-center"}
      >
        Get Started
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  return (
    <div className="relative">
      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid" />
        <div className="hero-gradient absolute inset-0" />
        <div className="spotlight-left" />
        <div className="spotlight-right" />
        <Particles />

        {/* Stadium silhouette gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-midnight to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-electric/10 border border-electric/20 rounded-full px-4 py-1.5 mb-8">
              <Zap className="w-4 h-4 text-electric-bright" />
              <span className="text-sm text-electric-bright font-medium">
                AI-Powered Football Intelligence
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="text-text-primary">Scout Smarter.</span>
              <br />
              <span className="text-gradient">Sign Better.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              The intelligent recruitment platform that combines advanced analytics,
              machine learning, and tactical analysis to find the perfect signing
              for your club.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
                <Search className="w-5 h-5" />
                Start Scouting
              </Link>
              <Link href="/dashboard/players" className="btn-secondary text-base px-8 py-3">
                <Users className="w-5 h-5" />
                Explore Players
              </Link>
              <Link href="/dashboard" className="btn-emerald text-base px-8 py-3">
                <Brain className="w-5 h-5" />
                Transfer Intelligence
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass-card inline-flex flex-wrap justify-center gap-8 md:gap-16 px-8 py-5"
          >
            {[
              { value: 15000, suffix: "+", label: "Players Tracked" },
              { value: 120, suffix: "+", label: "Leagues Covered" },
              { value: 98, suffix: "%", label: "Accuracy Rate" },
              { value: 500, suffix: "+", label: "Clubs Trust Us" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ──────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-dots" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-electric-bright text-sm font-semibold uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Everything You Need to{" "}
              <span className="text-gradient">Scout Like a Pro</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Professional-grade tools designed for elite recruitment departments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="AI Recommendations"
              description="Machine learning models analyze thousands of data points to recommend the perfect signing for your tactical system."
              delay={0}
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="xG, xA, progressive actions, pressing metrics, and 50+ advanced statistics visualized with interactive charts."
              delay={0.1}
            />
            <FeatureCard
              icon={Target}
              title="Tactical Fit Analysis"
              description="Define your playing style and formation. Our AI evaluates how well each player fits your tactical requirements."
              delay={0.2}
            />
            <FeatureCard
              icon={Activity}
              title="Medical Intelligence"
              description="Comprehensive injury history analysis, recurring pattern detection, and AI-powered injury risk prediction."
              delay={0.3}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Financial Modeling"
              description="Transfer fee analysis, salary projections, ROI calculations, and FFP impact assessment."
              delay={0.4}
            />
            <FeatureCard
              icon={LineChart}
              title="Performance Prediction"
              description="Age-curve modeling and regression analysis to predict a player's trajectory over the next 2-5 years."
              delay={0.5}
            />
            <FeatureCard
              icon={Database}
              title="Player Database"
              description="Search and filter through thousands of players with instant results. 30+ filter dimensions available."
              delay={0.6}
            />
            <FeatureCard
              icon={Globe}
              title="Multi-League Coverage"
              description="Data from the top 5 European leagues, South America, and emerging markets worldwide."
              delay={0.7}
            />
            <FeatureCard
              icon={Lock}
              title="Explainable AI"
              description="Every recommendation comes with a detailed explanation. Understand WHY a player is recommended."
              delay={0.8}
            />
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-navy/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-emerald-bright text-sm font-semibold uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              From Requirement to{" "}
              <span className="text-gradient">Signing</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              A streamlined workflow that mirrors elite club recruitment processes.
            </p>
          </motion.div>

          <div className="space-y-8">
            <PipelineStep
              step={1}
              title="Define Requirements"
              description="The manager or sporting director defines the tactical requirements — position, playing style, budget, age profile, and key attributes."
              delay={0}
            />
            <PipelineStep
              step={2}
              title="AI Candidate Generation"
              description="Our AI engine scans the database, applies hard and soft filters, and generates a ranked list of candidates with match scores."
              delay={0.1}
            />
            <PipelineStep
              step={3}
              title="Deep Analysis"
              description="Analysts dive into each candidate's statistics, tactical fit, medical history, and financial profile using our visualization tools."
              delay={0.2}
            />
            <PipelineStep
              step={4}
              title="Scout Reports"
              description="Scouts submit detailed reports after watching candidates. Reports are combined with data to create a holistic assessment."
              delay={0.3}
            />
            <PipelineStep
              step={5}
              title="Shortlist & Decision"
              description="The recruitment team builds a shortlist, compares candidates side-by-side, and makes a data-driven signing decision."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-bright text-sm font-semibold uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Trusted by{" "}
              <span className="text-gradient">Elite Clubs</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="ScoutAI has revolutionized our recruitment process. We identified three key signings last window that we would have never found through traditional scouting."
              name="Marco Silveira"
              role="Sporting Director, FC Porto"
              delay={0}
            />
            <TestimonialCard
              quote="The tactical fit analysis is incredible. It accurately predicted how well our new midfielder would integrate into our pressing system."
              name="Anna Kessler"
              role="Head of Analytics, RB Leipzig"
              delay={0.1}
            />
            <TestimonialCard
              quote="The medical risk module saved us from a €30M transfer that looked perfect on paper but had a significant recurring injury pattern."
              name="James Whitfield"
              role="Chief Scout, Brighton & Hove Albion"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-navy/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-purple-bright text-sm font-semibold uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Plans for Every{" "}
              <span className="text-gradient">Club Size</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              name="Scout"
              price="€299"
              features={[
                "5,000 players",
                "Basic analytics",
                "Player search & filtering",
                "5 shortlists",
                "PDF reports",
                "Email support",
              ]}
              delay={0}
            />
            <PricingCard
              name="Professional"
              price="€799"
              popular
              features={[
                "15,000 players",
                "Advanced analytics & xG",
                "AI recommendations",
                "Unlimited shortlists",
                "Tactical fit analysis",
                "Medical intelligence",
                "Priority support",
              ]}
              delay={0.1}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              features={[
                "Unlimited players",
                "Full AI suite",
                "Custom data integrations",
                "API access",
                "Dedicated account manager",
                "On-premise deployment",
                "24/7 support",
              ]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <Particles />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your{" "}
            <span className="text-gradient">Recruitment?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Join 500+ clubs already using ScoutAI to make data-driven transfer decisions.
          </p>
          <Link href="/login" className="btn-primary text-lg px-10 py-4">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-emerald flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-text-primary">ScoutAI</span>
              </div>
              <p className="text-xs text-text-muted">
                AI-powered football recruitment for the modern era.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Features</li>
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Integrations</li>
                <li className="hover:text-text-secondary cursor-pointer transition-colors">API</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="hover:text-text-secondary cursor-pointer transition-colors">About</li>
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Privacy</li>
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Terms</li>
                <li className="hover:text-text-secondary cursor-pointer transition-colors">Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-xs text-text-muted">
            © {new Date().getFullYear()} ScoutAI. All rights reserved. Built for elite football recruitment.
          </div>
        </div>
      </footer>
    </div>
  );
}
