import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart, Sparkles, Shield, Wifi, Car } from 'lucide-react';
import { toggleFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PropertyCard = ({
  property,
  matchPercentage,
  aiVerdict,
  onCompareToggle,
  isCompared = false,
  isSavedInitial = false,
}) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  if (!property) return null;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to save favorites!');
      return;
    }
    try {
      setSaving(true);
      await toggleFavorite(property.id);
      setIsSaved(!isSaved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const mainImage =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls[0]
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Property Image & Overlays */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={property.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

        {/* AI Match Badge */}
        {matchPercentage !== undefined && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/95 text-white shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{matchPercentage}% AI Match</span>
          </div>
        )}

        {/* Demo Data Tag */}
        <div className="absolute top-3 left-3 sm:left-auto sm:right-14 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/70 text-slate-200 backdrop-blur-xs">
          Demo Listing
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={saving}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-200 shadow-md backdrop-blur-md ${
            isSaved
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold tracking-tight">
              ₹{property.price?.toLocaleString()}
            </span>
            <span className="text-xs text-slate-200 font-medium">/ month</span>
          </div>
          {property.securityDeposit && (
            <span className="text-[11px] text-slate-300">
              Deposit: ₹{property.securityDeposit?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-black/50 text-white backdrop-blur-sm">
          {property.propertyType?.replace('_', ' ')}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">
              {property.neighborhood ? `${property.neighborhood}, ` : ''}
              {property.city}
            </span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          {/* AI Verdict summary tag */}
          {aiVerdict && (
            <div className="mb-3 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-800 font-medium line-clamp-1">
              ✨ {aiVerdict}
            </div>
          )}

          {/* Specs: Bed, Bath, Sqft */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-3">
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{property.bedrooms}</span> Bed
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-slate-100">
              <Bath className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{property.bathrooms}</span> Bath
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{property.areaSqft}</span> sqft
            </div>
          </div>

          {/* Quick Amenities Icons */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {property.petFriendly && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                🐾 Pets Ok
              </span>
            )}
            {property.parkingAvailable && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                <Car className="w-3 h-3 text-slate-500" /> Parking
              </span>
            )}
            {property.safetyRating && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                <Shield className="w-3 h-3 text-amber-500" /> {property.safetyRating}
              </span>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {onCompareToggle && (
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCompared}
                onChange={() => onCompareToggle(property.id)}
                className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span>Compare</span>
            </label>
          )}

          <Link
            to={`/properties/${property.id}`}
            className="ml-auto inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
