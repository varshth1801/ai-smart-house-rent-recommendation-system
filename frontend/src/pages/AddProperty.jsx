import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, ArrowLeft, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { createProperty } from '../services/api';
import confetti from 'canvas-confetti';

const AddProperty = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [zipCode, setZipCode] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [price, setPrice] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [maintenanceFee, setMaintenanceFee] = useState('');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [areaSqft, setAreaSqft] = useState(1200);
  const [propertyType, setPropertyType] = useState('APARTMENT');
  const [furnishedStatus, setFurnishedStatus] = useState('SEMI_FURNISHED');
  const [locationTier, setLocationTier] = useState('TIER_1');
  const [vibeTags, setVibeTags] = useState('Modern,Tech-Hub,Quiet');
  const [imageUrl, setImageUrl] = useState('');

  // Amenities
  const [petFriendly, setPetFriendly] = useState(false);
  const [parkingAvailable, setParkingAvailable] = useState(true);
  const [gym, setGym] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [powerBackup, setPowerBackup] = useState(true);
  const [balcony, setBalcony] = useState(true);
  const [airConditioning, setAirConditioning] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [elevator, setElevator] = useState(true);
  const [security24x7, setSecurity24x7] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const images = imageUrl.trim()
        ? [imageUrl.trim()]
        : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

      const res = await createProperty({
        title,
        description,
        address,
        city,
        state,
        zipCode,
        neighborhood,
        price: Number(price),
        securityDeposit: securityDeposit ? Number(securityDeposit) : Number(price) * 2,
        maintenanceFee: maintenanceFee ? Number(maintenanceFee) : 0,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        areaSqft: Number(areaSqft),
        propertyType,
        furnishedStatus,
        locationTier,
        vibeTags,
        petFriendly,
        parkingAvailable,
        gym,
        swimmingPool,
        powerBackup,
        balcony,
        airConditioning,
        wifi,
        elevator,
        security24x7,
        imageUrls: images,
      });

      confetti({ particleCount: 70, spread: 60 });
      navigate(`/properties/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating property listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Back
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          List a Rental Property
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish your house or apartment to connect with AI-matched tenants.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Basic Title & Description */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Basic Overview
          </h2>
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Listing Headline / Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunny 2BHK with Balcony near IT Corridor"
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Detailed Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight home features, lighting, transit convenience, nearby amenities..."
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Location & Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="100 Feet Road, 4th Block"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Neighborhood / Area *</label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Indiranagar / Whitefield"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Location Tier (AI Pricing)</label>
              <select
                value={locationTier}
                onChange={(e) => setLocationTier(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              >
                <option value="TIER_1">Tier 1: Prime Tech Corridor / Downtown</option>
                <option value="TIER_2">Tier 2: Established Residential Suburb</option>
                <option value="TIER_3">Tier 3: Outer Developing Corridor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financials & Specifications */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Rent & Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Monthly Rent (₹) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="32000"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Security Deposit (₹)</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="64000"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Built-up Area (sq.ft) *</label>
              <input
                type="number"
                required
                value={areaSqft}
                onChange={(e) => setAreaSqft(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Bedrooms</label>
              <input
                type="number"
                min="1"
                max="6"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Bathrooms</label>
              <input
                type="number"
                min="1"
                max="6"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
              >
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="STUDIO">Studio</option>
                <option value="CONDO">Condo</option>
                <option value="PENTHOUSE">Penthouse</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amenities Selection */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Amenities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} />
              <span>Pet Friendly</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={parkingAvailable} onChange={(e) => setParkingAvailable(e.target.checked)} />
              <span>Parking</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={gym} onChange={(e) => setGym(e.target.checked)} />
              <span>Gym / Fitness</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={swimmingPool} onChange={(e) => setSwimmingPool(e.target.checked)} />
              <span>Swimming Pool</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={powerBackup} onChange={(e) => setPowerBackup(e.target.checked)} />
              <span>Power Backup</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={balcony} onChange={(e) => setBalcony(e.target.checked)} />
              <span>Balcony</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} />
              <span>Wi-Fi Ready</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={security24x7} onChange={(e) => setSecurity24x7(e.target.checked)} />
              <span>24/7 Security</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-2 pt-2">
          <label className="font-semibold text-slate-700">Photo URL (High Resolution)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
          />
          <p className="text-[11px] text-slate-400">Leave blank to use verified modern architectural demo photos automatically.</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-colors shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Publishing Listing...' : 'Publish Property Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
