import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Maximize, Shield, Wifi, Car, Calendar, Check,
  Send, Star, Sparkles, Building, User, Clock, ArrowLeft, Heart, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getPropertyById, getPropertyReviews, addPropertyReview, createBooking, toggleFavorite, predictRentalPrice } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AiChatbot from '../components/AiChatbot';

const PropertyDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [valuation, setValuation] = useState(null);

  // Application / Tour Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('TOUR'); // 'TOUR' or 'APPLICATION'
  const [tourDate, setTourDate] = useState('');
  const [tourType, setTourType] = useState('IN_PERSON');
  const [message, setMessage] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [occupants, setOccupants] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getPropertyById(id);
        setProperty(res.data);

        // Fetch reviews
        const revRes = await getPropertyReviews(id);
        setReviews(revRes.data);

        // Fetch AI Price valuation estimate for this property
        const p = res.data;
        const valRes = await predictRentalPrice({
          city: p.city,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          areaSqft: p.areaSqft,
          propertyType: p.propertyType,
          furnishedStatus: p.furnishedStatus,
          locationTier: p.locationTier,
          parkingAvailable: p.parkingAvailable,
          gym: p.gym,
          swimmingPool: p.swimmingPool,
          powerBackup: p.powerBackup,
          balcony: p.balcony,
        });
        setValuation(valRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to schedule a tour or apply!');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        propertyId: property.id,
        tourDateTime: modalType === 'TOUR' && tourDate ? `${tourDate}T10:00:00` : null,
        tourType,
        message,
        monthlyIncome: monthlyIncome ? Number(monthlyIncome) : null,
        numberOfOccupants: occupants,
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSuccessNotice(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessNotice(false);
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to submit a review!');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await addPropertyReview(property.id, {
        rating: newRating,
        comment: newComment,
      });
      setReviews([res.data, ...reviews]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500">Loading property specifications & AI analysis...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Property not found</h2>
        <Link to="/explore" className="text-blue-600 hover:underline text-xs">
          Back to Listings
        </Link>
      </div>
    );
  }

  const images = property.imageUrls && property.imageUrls.length > 0
    ? property.imageUrls
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const amenitiesList = [
    { label: 'Pet Friendly', available: property.petFriendly, icon: '🐾' },
    { label: 'Reserved Parking', available: property.parkingAvailable, icon: '🚗' },
    { label: 'Fitness Center / Gym', available: property.gym, icon: '🏋️' },
    { label: 'Swimming Pool', available: property.swimmingPool, icon: '🏊' },
    { label: 'Full Power Backup', available: property.powerBackup, icon: '⚡' },
    { label: 'Private Balcony', available: property.balcony, icon: '🌇' },
    { label: 'High-speed Wi-Fi Ready', available: property.wifi, icon: '📶' },
    { label: 'Air Conditioning', available: property.airConditioning, icon: '❄️' },
    { label: 'High-Speed Elevators', available: property.elevator, icon: '🛗' },
    { label: '24/7 Gated Security', available: property.security24x7, icon: '🛡️' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <Link
        to="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </Link>

      {/* Hero Gallery */}
      <div className="space-y-4">
        <div className="h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden bg-slate-900 relative shadow-lg">
          <img
            src={images[selectedImg]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
              {property.propertyType?.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
              {property.furnishedStatus?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Thumbnail Row */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  selectedImg === i ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content & Sticky Booking Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Details, Amenities, AI Valuation */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header Title & Pricing */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{property.address}, {property.neighborhood}, {property.city}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-baseline gap-4 pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  ₹{property.price?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>
              {property.securityDeposit && (
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                  Deposit: ₹{property.securityDeposit?.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Quick Specs Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
              <Bed className="w-5 h-5 text-blue-600 mx-auto" />
              <p className="text-sm font-bold text-slate-900">{property.bedrooms} BHK</p>
              <p className="text-[11px] text-slate-500">Bedrooms</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
              <Bath className="w-5 h-5 text-indigo-600 mx-auto" />
              <p className="text-sm font-bold text-slate-900">{property.bathrooms} Baths</p>
              <p className="text-[11px] text-slate-500">Bathrooms</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
              <Maximize className="w-5 h-5 text-purple-600 mx-auto" />
              <p className="text-sm font-bold text-slate-900">{property.areaSqft} sqft</p>
              <p className="text-[11px] text-slate-500">Super Built-up</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
              <Shield className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-slate-900">{property.safetyRating || '4.5'}/5.0</p>
              <p className="text-[11px] text-slate-500">Safety Index</p>
            </div>
          </div>

          {/* AI Valuation Analysis Callout */}
          {valuation && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 border border-indigo-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  AI Market Valuation Analysis
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                  Estimated Fair Rent: ₹{valuation.estimatedRent?.toLocaleString()}/mo
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {valuation.valuationSummary}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 border-t border-indigo-200/50">
                <div>Confidence: ₹{valuation.confidenceLow?.toLocaleString()} - ₹{valuation.confidenceHigh?.toLocaleString()}</div>
                <div>Rate: ₹{valuation.pricePerSqft}/sq.ft</div>
                <div>Market State: {valuation.marketTrend?.replace('_', ' ')}</div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">About this Home</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
            {property.vibeTags && (
              <div className="flex flex-wrap gap-2 pt-2">
                {property.vibeTags.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Amenities Checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Features & Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenitiesList.map((amenity, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium ${
                    amenity.available
                      ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                      : 'bg-slate-50/50 border-slate-100 text-slate-400 line-through'
                  }`}
                >
                  <span className="text-base">{amenity.icon}</span>
                  <span>{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews & Tenant Feedback */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Tenant Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{property.safetyRating || '4.5'}</span>
              </div>
            </div>

            {/* Submit Review Form */}
            {isAuthenticated && (
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Your Rating:</span>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= newRating ? 'fill-current' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share feedback on living here, neighborhood quietness, maintenance..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={submittingReview || !newComment.trim()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet for this listing.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{r.user?.fullName}</span>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">Verified Tenant</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Landlord card & Booking Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Rent</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  ₹{property.price?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
            </div>

            {/* Landlord Info Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Property Managed By
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={property.landlord?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                  alt={property.landlord?.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{property.landlord?.fullName}</p>
                  <p className="text-[11px] text-slate-500">Verified Owner</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p>Phone: {property.landlord?.phone || '+91 98765 11112'}</p>
                <p>Email: {property.landlord?.email}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setModalType('TOUR');
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule a Tour</span>
              </button>

              <button
                onClick={() => {
                  setModalType('APPLICATION');
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply for Tenancy</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-normal">
              🔒 Free to apply. No broker commission. Your information is encrypted.
            </p>
          </div>
        </div>
      </div>

      {/* Booking / Tour Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95">
            {successNotice ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {modalType === 'TOUR' ? 'Tour Requested Successfully!' : 'Application Submitted!'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  The landlord has been notified immediately via real-time WebSocket. You can track progress in your dashboard.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">
                    {modalType === 'TOUR' ? 'Schedule a Property Tour' : 'Rental Application'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                  {modalType === 'TOUR' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Tour Format</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTourType('IN_PERSON')}
                            className={`py-2 rounded-xl font-bold border transition-colors ${
                              tourType === 'IN_PERSON'
                                ? 'bg-blue-50 border-blue-600 text-blue-700'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            In-Person Visit
                          </button>
                          <button
                            type="button"
                            onClick={() => setTourType('VIRTUAL_VIDEO')}
                            className={`py-2 rounded-xl font-bold border transition-colors ${
                              tourType === 'VIRTUAL_VIDEO'
                                ? 'bg-blue-50 border-blue-600 text-blue-700'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Virtual Video Tour
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Preferred Date</label>
                        <input
                          type="date"
                          required
                          value={tourDate}
                          onChange={(e) => setTourDate(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Monthly Net Income (₹)</label>
                        <input
                          type="number"
                          required
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(e.target.value)}
                          placeholder="e.g. 85000"
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Total Occupants</label>
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={occupants}
                          onChange={(e) => setOccupants(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Message to Landlord</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Introduce yourself, your expected move-in timeline, or any questions..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting to Landlord...' : 'Confirm & Send Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating AI Chatbot contextualized to this property */}
      <AiChatbot propertyContextId={property.id} />
    </div>
  );
};

export default PropertyDetails;
