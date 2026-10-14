import React from 'react';
import { Home, Sparkles, Heart, Shield, Cpu, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Smart<span className="text-blue-500">Rent</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation real estate matching platform powered by machine learning, transparent valuation metrics, and conversational intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>AI Engine: Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Search Properties
                </Link>
              </li>
              <li>
                <Link to="/ai-match" className="hover:text-white transition-colors">
                  AI Preference Matcher
                </Link>
              </li>
              <li>
                <Link to="/price-predictor" className="hover:text-white transition-colors">
                  Rental Price Predictor
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  Property Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Solutions By Role
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Tenants: Smart Shortlisting
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Landlords: AI Price Guidance
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Admins: Platform Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Features badge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Explainable AI
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <Sparkles className="w-4 h-4" /> Transparent Matching
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Every property recommendation features a granular percentage breakdown across budget, transit, lifestyle, and security.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AI Smart House Rent Recommendation System. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with modern Full-Stack AI Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
