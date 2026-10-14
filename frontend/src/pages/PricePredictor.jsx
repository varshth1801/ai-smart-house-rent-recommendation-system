import React, { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, Building, Check, Layers, AlertCircle } from 'lucide-react';
import { predictRentalPrice } from '../services/api';

const PricePredictor = () => {
  const [city, setCity] = useState('Bengaluru');
  const [locationTier, setLocationTier] = useState('TIER_1');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [areaSqft, setAreaSqft] = useState(1150);
  const [furnishedStatus, setFurnishedStatus] = useState('SEMI_FURNISHED');
  const [parkingAvailable, setParkingAvailable] = useState(true);
  const [gym, setGym] = useState(true);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [powerBackup, setPowerBackup] = useState(true);
  const [airConditioning, setAirConditioning] = useState(true);
  const [balcony, setBalcony] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictRentalPrice({
        city,
        locationTier,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        areaSqft: Number(areaSqft),
        furnishedStatus,
        parkingAvailable,
        gym,
        swimmingPool,
        powerBackup,
        airConditioning,
        balcony,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>ML Regression Valuation Model</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          AI Rental Price Predictor
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Estimate fair-market residential rent with statistical confidence intervals based on square footage, location tier, furnishing, and amenity suite.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Property Specifications
          </h2>

          <form onSubmit={handlePredict} className="space-y-5 text-xs">
            {/* City & Location Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Metro City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Gurgaon">Gurgaon / Delhi NCR</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Location Tier</label>
                <select
                  value={locationTier}
                  onChange={(e) => setLocationTier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="TIER_1">Tier 1: Prime / Tech Hub</option>
                  <option value="TIER_2">Tier 2: Established Suburb</option>
                  <option value="TIER_3">Tier 3: Emerging Periphery</option>
                </select>
              </div>
            </div>

            {/* Beds, Baths & Area */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Beds</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Baths</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Area (sqft)</label>
                <input
                  type="number"
                  step="50"
                  min="200"
                  max="8000"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>
            </div>

            {/* Furnished Status */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Furnishing Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'FULLY_FURNISHED', label: 'Full Furnished' },
                  { id: 'SEMI_FURNISHED', label: 'Semi Furnished' },
                  { id: 'UNFURNISHED', label: 'Unfurnished' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFurnishedStatus(f.id)}
                    className={`py-2 rounded-xl font-bold transition-colors cursor-pointer text-center ${
                      furnishedStatus === f.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-700 block mb-1">Included Amenities</label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parkingAvailable}
                    onChange={(e) => setParkingAvailable(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>🚗 Dedicated Parking</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gym}
                    onChange={(e) => setGym(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>🏋️ Clubhouse / Gym</span>
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
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={powerBackup}
                    onChange={(e) => setPowerBackup(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>⚡ 100% Power Backup</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={airConditioning}
                    onChange={(e) => setAirConditioning(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>❄️ Air Conditioning</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={balcony}
                    onChange={(e) => setBalcony(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>🌇 Private Balcony</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{loading ? 'Estimating Valuation...' : 'Calculate Market Rent'}</span>
            </button>
          </form>
        </div>

        {/* Prediction Results Display */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Fair Market Rent Estimate
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {result.marketTrend?.replace('_', ' ')}
                </span>
              </div>

              {/* Big Price Metric */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 text-center space-y-2">
                <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                  Estimated Monthly Rent
                </p>
                <div className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
                  ₹{result.estimatedRent?.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500">
                  Expected Range: ₹{result.confidenceLow?.toLocaleString()} - ₹{result.confidenceHigh?.toLocaleString()}
                </p>
              </div>

              {/* Key Indicators */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <p className="text-xs text-slate-500 font-medium">Rental Rate</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">₹{result.pricePerSqft} / sqft</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <p className="text-xs text-slate-500 font-medium">Est. Gross Yield</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{result.rentalYieldEstimate}% p.a.</p>
                </div>
              </div>

              {/* Factors */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Valuation Breakdown Factors
                </h3>
                <div className="space-y-1.5">
                  {result.contributingFactors?.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/60 text-xs text-blue-900 leading-relaxed font-medium">
                💡 {result.valuationSummary}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/70 p-10 rounded-3xl border-2 border-dashed border-slate-300 text-center space-y-4">
              <Calculator className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">No calculation run yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Adjust the property specifications on the left and click "Calculate Market Rent" to view instantaneous AI pricing analytics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePredictor;
