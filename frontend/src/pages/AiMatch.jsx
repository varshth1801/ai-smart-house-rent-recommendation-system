import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { getAiRecommendations, getCities } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import ExplainableScoreMeter from '../components/ExplainableScoreMeter';
import { useAuth } from '../context/AuthContext';

const AiMatch = () => {
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // Form State initialized with user profile preferences if logged in
  const [city, setCity] = useState(user?.preferredCity || 'Bengaluru');
  const [maxBudget, setMaxBudget] = useState(user?.maxBudget || 40000);
  const [bedrooms, setBedrooms] = useState(user?.preferredBedrooms || 2);
  const [lifestyle, setLifestyle] = useState(user?.preferredLifestyle || 'tech_worker');
  const [prioritize, setPrioritize] = useState('balanced');
  const [petFriendly, setPetFriendly] = useState(user?.petFriendlyNeeded || true);
  const [parking, setParking] = useState(user?.parkingNeeded || true);
  const [gym, setGym] = useState(user?.gymNeeded || true);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [balcony, setBalcony] = useState(true);

  useEffect(() => {
    getCities().then((res) => setCities(res.data)).catch(console.error);
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await getAiRecommendations({
        city,
        maxBudget: Number(maxBudget),
        bedrooms: Number(bedrooms),
        lifestyle,
        prioritize,
        petFriendly,
        parking,
        gym,
        swimmingPool,
        balcony,
      });
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  const lifestyles = [
    { id: 'tech_worker', label: 'Tech Professional', desc: 'High transit, fiber wifi, modern', icon: '💻' },
    { id: 'quiet', label: 'Quiet & Serene', desc: 'Green belts, low noise, peaceful', icon: '🌿' },
    { id: 'family', label: 'Family Oriented', desc: 'Gated security, parks, 2+ beds', icon: '👨‍👩‍👧' },
    { id: 'pet_lover', label: 'Pet Lover', desc: '100% pet-friendly with open grounds', icon: '🐾' },
    { id: 'student', label: 'Student / Young Pro', desc: 'Affordable, metro connectivity', icon: '🎒' },
    { id: 'luxury', label: 'Luxury Living', desc: 'Penthouse, pool, premium clubhouse', icon: '✨' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Explainable Recommendation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          AI Smart House Matcher
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Configure your budget, lifestyle, and living essentials. Our multi-factor algorithm scores listings and provides a complete explainability breakdown.
        </p>
      </div>

      {/* Main Container: Form + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Preferences Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Your Living Preferences
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Preferred City */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Target City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Max Budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Monthly Budget Cap</span>
                <span className="text-blue-600 font-bold">₹{Number(maxBudget).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="15000"
                max="100000"
                step="2500"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Bedrooms */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Bedrooms</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBedrooms(b)}
                    className={`py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                      bedrooms === b
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b} BHK
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle Persona */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Lifestyle Persona</label>
              <div className="grid grid-cols-2 gap-2">
                {lifestyles.map((ls) => (
                  <button
                    key={ls.id}
                    type="button"
                    onClick={() => setLifestyle(ls.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      lifestyle === ls.id
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/10'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{ls.icon}</span>
                    <p className="font-bold text-slate-900 mt-1">{ls.label}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{ls.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Prioritization */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Optimization Goal</label>
              <select
                value={prioritize}
                onChange={(e) => setPrioritize(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              >
                <option value="balanced">Balanced (Holistic Evaluation)</option>
                <option value="budget">Budget First (Max Savings per Sqft)</option>
                <option value="luxury">Luxury First (Amenities & Quality)</option>
                <option value="commute">Commute First (Transit & Connectivity)</option>
              </select>
            </div>

            {/* Must-have Amenities */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-700 block mb-1">Must-Have Amenities</label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petFriendly}
                    onChange={(e) => setPetFriendly(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>🐾 Pet Friendly</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parking}
                    onChange={(e) => setParking(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>🚗 Reserved Parking</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gym}
                    onChange={(e) => setGym(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>🏋️ Fitness Gym</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={swimmingPool}
                    onChange={(e) => setSwimmingPool(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>🏊 Swimming Pool</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold transition-all shadow-md hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Computing AI Match...' : 'Recompute Recommendations'}</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: AI Recommendations with Explainability Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
            <span className="font-bold text-slate-900">
              Ranked Matches ({recommendations.length} Properties)
            </span>
            <span className="text-slate-500">Sorted by highest algorithmic compatibility</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <p className="font-bold text-slate-800">No matching homes found</p>
              <p className="text-xs text-slate-500">Try loosening budget or selecting another city.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.property?.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all p-6 space-y-5"
                >
                  {/* Top Match Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="px-3.5 py-1.5 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{rec.matchPercentage}% Compatibility</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                        {rec.aiVerdict}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{rec.property?.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500"> / month</span>
                    </div>
                  </div>

                  {/* Property Info and Snapshot */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        {rec.property?.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        📍 {rec.property?.address}, {rec.property?.city}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        "{rec.primaryMatchReason}"
                      </p>

                      {/* Highlights */}
                      {rec.highlightPoints && rec.highlightPoints.length > 0 && (
                        <div className="space-y-1">
                          {rec.highlightPoints.map((pt, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Explainability Breakdown Meters */}
                    <div>
                      <ExplainableScoreMeter scores={rec} />
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {rec.property?.bedrooms} Beds • {rec.property?.bathrooms} Baths • {rec.property?.areaSqft} sqft
                    </span>
                    <a
                      href={`/properties/${rec.property?.id}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-blue-600 transition-colors shadow-xs"
                    >
                      <span>Inspect Property</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiMatch;
