import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Scale, Trophy, Check, X, Sparkles, ArrowRight, Shield, Car, Wifi } from 'lucide-react';
import { compareProperties, getProperties } from '../services/api';

const Compare = () => {
  const location = useLocation();
  const [allProperties, setAllProperties] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all available properties for dropdown selection
    getProperties().then((res) => {
      setAllProperties(res.data);

      const params = new URLSearchParams(location.search);
      const idsParam = params.get('ids');
      if (idsParam) {
        const ids = idsParam.split(',').map(Number);
        setSelectedIds(ids);
      } else if (res.data.length >= 2) {
        setSelectedIds([res.data[0].id, res.data[1].id]);
      }
    });
  }, [location.search]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      runComparison(selectedIds);
    }
  }, [selectedIds]);

  const runComparison = async (ids) => {
    setLoading(true);
    try {
      const res = await compareProperties(ids);
      setComparison(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = (id) => {
    if (!id || selectedIds.includes(Number(id))) return;
    if (selectedIds.length >= 4) {
      alert('You can compare a maximum of 4 properties at once.');
      return;
    }
    setSelectedIds([...selectedIds, Number(id)]);
  };

  const handleRemoveProperty = (id) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Analysis</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Compare Rental Properties
          </h1>
          <p className="text-xs text-slate-500">
            AI-driven feature parity, pros & cons, and value-for-money verdict.
          </p>
        </div>

        {/* Add Property Dropdown */}
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              handleAddProperty(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            className="text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>+ Add property to compare</option>
            {allProperties
              .filter((p) => !selectedIds.includes(p.id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.city} - ₹{p.price?.toLocaleString()})
                </option>
              ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Comparing property specs and value metrics...</p>
        </div>
      ) : !comparison || comparison.properties?.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <Scale className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Select properties to compare</h3>
          <p className="text-xs text-slate-500">Add at least two listings to view AI pros/cons and value comparison.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* AI Winner Banner */}
          {comparison.winnerTitle && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border border-amber-300/80 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm uppercase tracking-wider">
                <Trophy className="w-5 h-5 text-amber-600 animate-bounce" />
                <span>AI Recommended Winner: {comparison.winnerTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                {comparison.winnerReason}
              </p>
              <p className="text-xs text-slate-500 italic">
                {comparison.executiveSummary}
              </p>
            </div>
          )}

          {/* Properties Summary Cards with Pros/Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comparison.properties.map((p) => {
              const isWinner = p.id === comparison.recommendedWinnerId;
              const pros = comparison.propertyPros?.[p.id] || [];
              const cons = comparison.propertyCons?.[p.id] || [];
              const valueScore = comparison.valueForMoneyScores?.[p.id] || 85;

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-3xl p-5 border flex flex-col justify-between transition-all relative ${
                    isWinner
                      ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                      : 'border-slate-200 shadow-sm'
                  }`}
                >
                  {isWinner && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Best Value Pick
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Image & Remove */}
                    <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100">
                      <img
                        src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveProperty(p.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors text-xs font-bold"
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{p.title}</h3>
                      <p className="text-[11px] text-slate-500">{p.neighborhood}, {p.city}</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-900">₹{p.price?.toLocaleString()}</span>
                      <span className="text-xs text-slate-500">/mo</span>
                    </div>

                    {/* Value for Money score */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Value for Money</span>
                        <span className="text-blue-600">{valueScore}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${valueScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Pros */}
                    <div className="space-y-1 text-xs">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Pros</p>
                      {pros.map((pr, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-800 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{pr}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cons */}
                    {cons.length > 0 && (
                      <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Considerations</p>
                        {cons.map((cn, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-rose-700">
                            <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{cn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/properties/${p.id}`}
                    className="mt-4 block w-full text-center py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors"
                  >
                    View Listing
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700">
              Detailed Feature Specifications
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3.5 font-bold text-slate-500 bg-slate-50/50 w-44">Monthly Rent</td>
                    {comparison.properties.map((p) => (
                      <td key={p.id} className="p-3.5 font-extrabold text-slate-900">
                        ₹{p.price?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3.5 font-bold text-slate-500 bg-slate-50/50">Security Deposit</td>
                    {comparison.properties.map((p) => (
                      <td key={p.id} className="p-3.5 text-slate-700">
                        ₹{p.securityDeposit?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3.5 font-bold text-slate-500 bg-slate-50/50">Bedrooms & Baths</td>
                    {comparison.properties.map((p) => (
                      <td key={p.id} className="p-3.5 text-slate-700">
                        {p.bedrooms} Beds / {p.bathrooms} Baths
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3.5 font-bold text-slate-500 bg-slate-50/50">Area (sq.ft)</td>
                    {comparison.properties.map((p) => (
                      <td key={p.id} className="p-3.5 text-slate-700 font-semibold">
                        {p.areaSqft} sqft (₹{Math.round(p.price / p.areaSqft)}/sqft)
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3.5 font-bold text-slate-500 bg-slate-50/50">Furnished Status</td>
                    {comparison.properties.map((p) => (
                      <td key={p.id} className="p-3.5 text-slate-700">
                        {p.furnishedStatus?.replace('_', ' ')}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3.5 font-bold text-slate-500 bg-slate-50/50">Pet Friendly</td>
                    {comparison.properties.map((p) => (
                      <td key={p.id} className="p-3.5">
                        {p.petFriendly ? (
                          <span className="text-emerald-600 font-bold">Yes (Allowed)</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3.5 font-bold text-slate-500 bg-slate-50/50">Parking & Gym</td>
                    {comparison.properties.map((p) => (
                      <td key={p.id} className="p-3.5 text-slate-700">
                        {p.parkingAvailable ? '🚗 Parking' : 'No Parking'} • {p.gym ? '🏋️ Gym' : 'No Gym'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-500 bg-slate-50/50">Safety Rating</td>
                    {comparison.properties.map((p) => (
                      <td key={p.id} className="p-3.5 font-bold text-amber-600">
                        ★ {p.safetyRating || '4.5'} / 5.0
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
