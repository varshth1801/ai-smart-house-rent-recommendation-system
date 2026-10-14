import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Heart, Send, Building, Plus, CheckCircle, XCircle,
  Clock, Shield, Users, Sparkles, Settings, ArrowRight, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getTenantBookings, getLandlordBookings, updateBookingStatus,
  getFavorites, getLandlordProperties, deleteProperty,
  getAdminStats, updateProfile, getMyProfile
} from '../services/api';
import PropertyCard from '../components/PropertyCard';

const Dashboard = () => {
  const { user, isTenant, isLandlord, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(isLandlord ? 'properties' : isAdmin ? 'admin' : 'applications');

  // Tenant data
  const [applications, setApplications] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Landlord data
  const [myProperties, setMyProperties] = useState([]);
  const [landlordInquiries, setLandlordInquiries] = useState([]);

  // Admin data
  const [adminStats, setAdminStats] = useState(null);

  // Preference Profile Form
  const [prefCity, setPrefCity] = useState(user?.preferredCity || 'Bengaluru');
  const [prefBudget, setPrefBudget] = useState(user?.maxBudget || 40000);
  const [prefBeds, setPrefBeds] = useState(user?.preferredBedrooms || 2);
  const [prefLifestyle, setPrefLifestyle] = useState(user?.preferredLifestyle || 'tech_worker');
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefSavedNotice, setPrefSavedNotice] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isTenant) {
        const [appRes, favRes] = await Promise.all([
          getTenantBookings(),
          getFavorites(),
        ]);
        setApplications(appRes.data);
        setFavorites(favRes.data);
      } else if (isLandlord) {
        const [propRes, inqRes] = await Promise.all([
          getLandlordProperties(user.id),
          getLandlordBookings(),
        ]);
        setMyProperties(propRes.data);
        setLandlordInquiries(inqRes.data);
      } else if (isAdmin) {
        const statsRes = await getAdminStats();
        setAdminStats(statsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await updateBookingStatus(appId, { status: newStatus });
      loadDashboardData();
    } catch (err) {
      alert('Failed to update application status.');
    }
  };

  const handleDeleteListing = async (propId) => {
    if (!window.confirm('Are you sure you want to remove this property listing?')) return;
    try {
      await deleteProperty(propId);
      setMyProperties(myProperties.filter((p) => p.id !== propId));
    } catch (err) {
      alert('Failed to delete property.');
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    try {
      await updateProfile({
        preferredCity: prefCity,
        maxBudget: Number(prefBudget),
        preferredBedrooms: Number(prefBeds),
        preferredLifestyle: prefLifestyle,
      });
      setPrefSavedNotice(true);
      setTimeout(() => setPrefSavedNotice(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {user?.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                {user?.role?.replace('ROLE_', '')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
        </div>

        {isLandlord && (
          <Link
            to="/add-property"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Listing</span>
          </Link>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
        {isTenant && (
          <>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'applications'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              My Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Saved Favorites ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'preferences'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              AI Living Preferences
            </button>
          </>
        )}

        {isLandlord && (
          <>
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              My Listings ({myProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Incoming Inquiries ({landlordInquiries.length})
            </button>
          </>
        )}

        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            System Analytics & Metrics
          </button>
        )}
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading your portal records...</p>
        </div>
      ) : (
        <div>
          {/* TAB: Tenant Applications */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="p-14 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <Send className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">No active rental applications</p>
                  <p className="text-xs text-slate-500">
                    Find a home you like on Explore and click "Schedule a Tour" or "Apply for Tenancy".
                  </p>
                  <Link
                    to="/explore"
                    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Browse Homes
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                          {app.property?.title}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <p>📍 {app.property?.address}, {app.property?.city}</p>
                        <p>💰 Monthly Rent: ₹{app.property?.price?.toLocaleString()}</p>
                        {app.tourDateTime && (
                          <p className="font-semibold text-blue-600">
                            🗓️ Tour: {new Date(app.tourDateTime).toLocaleString()} ({app.tourType})
                          </p>
                        )}
                        {app.landlordNotes && (
                          <p className="p-2.5 rounded-xl bg-slate-50 text-slate-700 italic border border-slate-100">
                            Landlord Note: "{app.landlordNotes}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Favorites */}
          {activeTab === 'favorites' && (
            <div>
              {favorites.length === 0 ? (
                <div className="p-14 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <Heart className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">No saved favorites yet</p>
                  <p className="text-xs text-slate-500">
                    Click the heart icon on any listing card to save it for quick comparison.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((fav) => (
                    <PropertyCard key={fav.id} property={fav} isSavedInitial={true} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Tenant Preferences */}
          {activeTab === 'preferences' && (
            <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Configure Recommendation Persona
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  These settings continuously train your personalized recommendations feed.
                </p>
              </div>

              {prefSavedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Preferences updated successfully!
                </div>
              )}

              <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Preferred Metro City</label>
                  <input
                    type="text"
                    value={prefCity}
                    onChange={(e) => setPrefCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Target Monthly Budget</span>
                    <span className="text-blue-600 font-bold">₹{Number(prefBudget).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="100000"
                    step="2500"
                    value={prefBudget}
                    onChange={(e) => setPrefBudget(e.target.value)}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Preferred Bedrooms</label>
                  <select
                    value={prefBeds}
                    onChange={(e) => setPrefBeds(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value={1}>1 BHK Studio / Single</option>
                    <option value={2}>2 BHK Standard</option>
                    <option value={3}>3 BHK Family</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={savingPrefs}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  {savingPrefs ? 'Saving...' : 'Save AI Preferences'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: Landlord Properties */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              {myProperties.length === 0 ? (
                <div className="p-14 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <Building className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">You haven't listed any properties yet</p>
                  <p className="text-xs text-slate-500">
                    Publish your house or apartment listing to receive applications from verified tenants.
                  </p>
                  <Link
                    to="/add-property"
                    className="inline-block mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Post First Property
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProperties.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className="h-44 bg-slate-100 relative">
                        <img
                          src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => handleDeleteListing(p.id)}
                            className="p-2 bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl shadow-sm transition-colors"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{p.title}</h4>
                          <p className="text-xs text-slate-500">{p.address}, {p.city}</p>
                          <p className="text-base font-extrabold text-slate-900 mt-2">
                            ₹{p.price?.toLocaleString()}/mo
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                            ● Active
                          </span>
                          <Link
                            to={`/properties/${p.id}`}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            View Public Page →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Landlord Inquiries */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              {landlordInquiries.length === 0 ? (
                <div className="p-14 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                  <p className="text-sm font-bold text-slate-800">No applications received yet</p>
                  <p className="text-xs text-slate-500">Inquiries will appear here with live notifications.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {landlordInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-slate-900">{inq.tenant?.fullName}</p>
                          <p className="text-[11px] text-slate-500">{inq.tenant?.email} • {inq.tenant?.phone}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            inq.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inq.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="font-semibold text-slate-900">Property: {inq.property?.title}</p>
                        {inq.monthlyIncome && <p>Monthly Net Income: ₹{inq.monthlyIncome?.toLocaleString()}</p>}
                        {inq.tourDateTime && <p>Scheduled Tour: {new Date(inq.tourDateTime).toLocaleString()}</p>}
                        {inq.message && <p className="italic">"{inq.message}"</p>}
                      </div>

                      {inq.status === 'PENDING' && (
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleStatusUpdate(inq.id, 'APPROVED')}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Approve Tenancy
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(inq.id, 'REJECTED')}
                            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Admin System Stats */}
          {activeTab === 'admin' && adminStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
                  <p className="text-2xl font-black text-slate-900">{adminStats.totalUsers}</p>
                  <p className="text-xs text-slate-500 font-medium">Registered Users</p>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
                  <p className="text-2xl font-black text-blue-600">{adminStats.totalProperties}</p>
                  <p className="text-xs text-slate-500 font-medium">Total Listings</p>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
                  <p className="text-2xl font-black text-emerald-600">{adminStats.aiRecommendationEfficiency}</p>
                  <p className="text-xs text-slate-500 font-medium">AI Match Efficiency</p>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
                  <p className="text-2xl font-black text-purple-600">{adminStats.averagePricePredictionConfidence}</p>
                  <p className="text-xs text-slate-500 font-medium">Price Model Confidence</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <h3 className="text-sm font-bold text-slate-900">System Architecture Health</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  WebSocket STOMP Broker: <strong>Active</strong> • Spring Security Stateless Filter: <strong>Enforced</strong> • AI Fallback Heuristics: <strong>Operational</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
