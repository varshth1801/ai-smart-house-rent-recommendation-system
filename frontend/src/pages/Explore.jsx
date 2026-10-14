import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, RotateCcw, SlidersHorizontal, Scale, ArrowRight, Sparkles } from 'lucide-react';
import { getProperties, getCities, searchNaturalLanguage } from '../services/api';
import PropertyCard from '../components/PropertyCard';

const Explore = () => {
  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCity, setSelectedCity] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [bedrooms, setBedrooms] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [petFriendly, setPetFriendly] = useState(false);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [gym, setGym] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Comparison drawer state
  const [comparedIds, setComparedIds] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Load URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
      handleNaturalSearch(q);
    } else {
      fetchProperties();
    }

    // Fetch distinct cities
    getCities()
      .then((res) => setCities(res.data))
      .catch((e) => console.error(e));
  }, [location.search]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCity) params.city = selectedCity;
      if (maxPrice) params.maxPrice = maxPrice;
      if (bedrooms) params.bedrooms = bedrooms;
      if (propertyType) params.propertyType = propertyType;
      if (petFriendly) params.petFriendly = true;
      if (parkingAvailable) params.parkingAvailable = true;
      if (gym) params.gym = true;

      const res = await getProperties(params);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNaturalSearch = async (text) => {
    setLoading(true);
    try {
      const res = await searchNaturalLanguage(text);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
      fetchProperties();
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleNaturalSearch(searchQuery.trim());
    } else {
      fetchProperties();
    }
  };

  const handleReset = () => {
    setSelectedCity('');
    setMaxPrice(100000);
    setBedrooms('');
    setPropertyType('');
    setPetFriendly(false);
    setParkingAvailable(false);
    setGym(false);
    setSearchQuery('');
    navigate('/explore');
  };

  const toggleCompare = (id) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length >= 4) {
        alert('You can compare at most 4 properties at a time.');
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Rental Homes
          </h1>
          <p className="text-xs text-slate-500">
            Browse verified listings or filter using natural-language AI semantics.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleFilterSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or ask: 2bhk near IT park under 30k..."
            className="w-full text-xs py-3 pl-10 pr-24 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Filters + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              Filter Properties
            </span>
            <button
              onClick={handleReset}
              className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-5 text-xs">
            {/* City */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">City / Location</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Monthly Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Max Rent</span>
                <span className="text-blue-600">₹{maxPrice.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="120000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Bedrooms */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Bedrooms</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['', '1', '2', '3'].map((b) => (
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
                    {b === '' ? 'Any' : `${b} BHK`}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="STUDIO">Studio</option>
                <option value="CONDO">Condo</option>
                <option value="PENTHOUSE">Penthouse</option>
              </select>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-700 block mb-1">Amenities</label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={petFriendly}
                  onChange={(e) => setPetFriendly(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300"
                />
                <span className="text-slate-600">Pet Friendly</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={parkingAvailable}
                  onChange={(e) => setParkingAvailable(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300"
                />
                <span className="text-slate-600">Reserved Parking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={gym}
                  onChange={(e) => setGym(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300"
                />
                <span className="text-slate-600">Fitness Center / Gym</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer shadow-sm"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span>
              Showing <strong className="text-slate-900">{properties.length}</strong> available homes
            </span>
            <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> AI Ranking Enabled
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
              <p className="text-base font-bold text-slate-800">No properties matched your criteria</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, choosing another city, or clicking Reset Filters.
              </p>
              <button
                onClick={handleReset}
                className="mt-3 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onCompareToggle={toggleCompare}
                  isCompared={comparedIds.includes(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Comparison Drawer */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>{comparedIds.length} properties selected for comparison</span>
          </div>
          <button
            onClick={() => navigate(`/compare?ids=${comparedIds.join(',')}`)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full transition-colors cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setComparedIds([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
