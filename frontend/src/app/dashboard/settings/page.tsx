"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Globe,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-text-secondary" /> Settings
        </h1>
        <p className="text-sm text-text-secondary mt-1">Configure your ScoutAI workspace</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2"><User className="w-4 h-4" /> Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block">Full Name</label>
            <input type="text" defaultValue="Demo User" className="input-field py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Email</label>
            <input type="email" defaultValue="demo@scoutai.com" className="input-field py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Role</label>
            <select className="input-field py-2 text-sm">
              <option>Scout</option>
              <option>Analyst</option>
              <option>Sporting Director</option>
              <option>Manager</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Club</label>
            <input type="text" defaultValue="Demo FC" className="input-field py-2 text-sm" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>
        <div className="space-y-3">
          {[
            "Transfer market updates",
            "Shortlist player availability changes",
            "New scouting reports",
            "Medical alerts for tracked players",
            "AI recommendation engine results",
          ].map((item) => (
            <label key={item} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-secondary">{item}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-electric" />
            </label>
          ))}
        </div>
      </div>

      {/* Data Preferences */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2"><Database className="w-4 h-4" /> Data Preferences</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block">Default Currency</label>
            <select className="input-field py-2 text-sm">
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>USD ($)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Primary Leagues</label>
            <select className="input-field py-2 text-sm" multiple>
              <option selected>Premier League</option>
              <option selected>La Liga</option>
              <option selected>Bundesliga</option>
              <option>Serie A</option>
              <option>Ligue 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary py-2.5">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
