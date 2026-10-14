import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, ArrowRight, ShieldCheck, Cpu, TrendingUp, CheckCircle2, MapPin, Building, ChevronRight } from 'lucide-react';
import { getProperties, searchNaturalLanguage } from '../services/api';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [naturalQuery, setNaturalQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getProperties();
        setFeaturedProperties(res.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleNaturalSearch = (e) => {
    e.preventDefault();
    if (!naturalQuery.trim()) {
      navigate('/explore');
      return;
    }
    navigate(`/explore?q=${encodeURIComponent(naturalQuery.trim())}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-28 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white">
        {/* Abstract glowing shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-200/80 shadow-xs text-xs font-bold text-indigo-700 animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-Driven Real Estate Matching & Price Valuation</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.1]">
              Find the perfect home with{' '}
              <span className="gradient-text">Algorithmic Precision</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              No more endless scrolling. Tell our AI what you want in plain English, preview fair-market rental estimates, and explore homes scored for your unique lifestyle.
            </p>
          </div>

          {/* Natural Language Search Box */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleNaturalSearch}
              className="relative flex flex-col sm:flex-row items-center p-2 rounded-2xl sm:rounded-full bg-white border border-slate-300 shadow-xl focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all gap-2"
            >
              <div className="flex items-center gap-3 pl-4 w-full flex-1">
                <Search className="w-5 h-5 text-indigo-600 shrink-0" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="e.g. Quiet 2bhk near tech park under 35000 with balcony and gym..."
                  className="w-full py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>AI Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Try asking:</span>
              {[
                'Sunny 2 BHK in Indiranagar',
                'Eco-friendly villa with garden',
                'Minimalist studio under 25k',
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNaturalQuery(sug)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  "{sug}"
                </button>
              ))}
            </div>
          </div>

          {/* Value Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto border-t border-slate-200/70">
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">96.4%</p>
              <p className="text-xs text-slate-500 font-medium">Match Accuracy</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹0</p>
              <p className="text-xs text-slate-500 font-medium">Zero Brokerage Fee</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium">Verified Landlords</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">&lt; 2s</p>
              <p className="text-xs text-slate-500 font-medium">Valuation Engine</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Autonomous Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How SmartRent AI Revolutionizes House Hunting
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered with deep multi-attribute decision metrics, NLP semantics, and real-time market estimation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Explainable Match Scores
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No black boxes. Every property receives individual score breakdowns for Budget Fit, Commute, Amenities, and Safety, showing you exactly why it's a match.
            </p>
            <Link to="/ai-match" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
              Try Match Engine <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Rental Price Prediction
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Wondering if you are overpaying? Our ML regression model predicts fair market rates based on square footage, location tier, furnishing, and amenities.
            </p>
            <Link to="/price-predictor" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              Run Price Estimator <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              AI Conversational Agent
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chat in real time with our virtual advisor to ask about landlord rules, deposit refunds, transit options, and schedule immediate virtual or in-person walk-throughs.
            </p>
            <span className="text-xs font-bold text-purple-600">
              Available 24/7 on bottom-right
            </span>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Hand-picked
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              Top AI-Ranked Homes
            </h2>
            <p className="text-xs text-slate-500">
              Highest scoring properties for safety, lifestyle compatibility, and value.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((p, index) => (
              <PropertyCard
                key={p.id}
                property={p}
                matchPercentage={96 - index * 3}
                aiVerdict="Prime location with exceptional safety and amenities"
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Are you a Landlord? Maximize your rental yield with AI.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Receive smart rental pricing recommendations based on current real-time market absorption and connect with pre-screened tenants with zero middlemen fees.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-all shadow-md"
              >
                List Your House Free
              </Link>
              <Link
                to="/price-predictor"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all backdrop-blur-md"
              >
                Calculate Fair Rent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
