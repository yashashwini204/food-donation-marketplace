import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import RoleSwitcher from './components/RoleSwitcher';
import HeroStats from './components/HeroStats';
import ListingCard from './components/ListingCard';
import ListingDetailsModal from './components/ListingDetailsModal';
import ClaimModal from './components/ClaimModal';
import OtpVerificationModal from './components/OtpVerificationModal';
import CompleteDeliveryModal from './components/CompleteDeliveryModal';
import PostListingModal from './components/PostListingModal';
import InteractiveMap from './components/InteractiveMap';
import MyMissionsTab from './components/MyMissionsTab';
import ImpactDashboardTab from './components/ImpactDashboardTab';
import SafetyGuidelinesTab from './components/SafetyGuidelinesTab';
import {
  Search,
  Filter,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Utensils,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('marketplace');
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nourish_token') || '');
  const [isRoleLoading, setIsRoleLoading] = useState(false);

  // Data State
  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [claims, setClaims] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Modal States
  const [detailsModalListing, setDetailsModalListing] = useState(null);
  const [claimModalListing, setClaimModalListing] = useState(null);
  const [claimResult, setClaimResult] = useState(null);
  const [isClaimSubmitting, setIsClaimSubmitting] = useState(false);

  const [verifyOtpListing, setVerifyOtpListing] = useState(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  const [completeModalListing, setCompleteModalListing] = useState(null);
  const [isCompletingDelivery, setIsCompletingDelivery] = useState(false);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPostSubmitting, setIsPostSubmitting] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Auth Headers helper
  const getAuthHeaders = () => {
    const currentTkn = token || localStorage.getItem('nourish_token');
    return {
      'Content-Type': 'application/json',
      ...(currentTkn ? { Authorization: `Bearer ${currentTkn}` } : {}),
    };
  };

  // 1. Initial Load: Authenticate as default NGO role if no user
  useEffect(() => {
    initAuthAndData();
  }, []);

  const initAuthAndData = async () => {
    try {
      const savedUser = localStorage.getItem('nourish_user');
      const savedToken = localStorage.getItem('nourish_token');

      if (savedUser && savedToken) {
        setCurrentUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        // Default login as NGO for immediate interactive experience
        await switchRole('ngo', true);
      }
    } catch (e) {
      console.error('Auth initialization error:', e);
      await switchRole('ngo', true);
    }

    fetchListings();
    fetchAnalytics();
  };

  // Switch demo role (NGO, Donor, Volunteer, Admin)
  const switchRole = async (roleName, silent = false) => {
    setIsRoleLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleName }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        setToken(data.token);
        localStorage.setItem('nourish_user', JSON.stringify(data.user));
        localStorage.setItem('nourish_token', data.token);

        if (!silent) {
          addToast(`Active role switched to: ${data.user.name} (${data.user.role.toUpperCase()})`, 'info');
        }
      } else {
        if (!silent) addToast(data.message || 'Failed to switch demo role', 'error');
      }
    } catch (err) {
      console.error('Error switching role:', err);
      if (!silent) addToast('Error communicating with backend auth server', 'error');
    } finally {
      setIsRoleLoading(false);
    }
  };

  // Fetch listings with query
  const fetchListings = async () => {
    setIsLoadingListings(true);
    try {
      const res = await fetch('/api/listings');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setListings(data.data);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setIsLoadingListings(false);
    }
  };

  // Fetch live impact analytics
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/impact');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  // Fetch user claims
  const fetchClaims = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/claims', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setClaims(data.data);
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClaims();
    }
  }, [token, activeTab]);

  // Handle NGO Claiming Food Listing
  const handleClaimListing = async (listingId, claimPayload) => {
    setIsClaimSubmitting(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/claim`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(claimPayload),
      });
      const data = await res.json();

      if (data.success) {
        setClaimResult(data.data);
        addToast('Food batch reserved successfully! Pickup OTP generated.', 'success');
        fetchListings();
        fetchAnalytics();
        fetchClaims();
      } else {
        addToast(data.message || 'Error claiming food', 'error');
      }
    } catch (err) {
      console.error('Claim error:', err);
      addToast('Network error claiming listing', 'error');
    } finally {
      setIsClaimSubmitting(false);
    }
  };

  // Handle OTP Verification by Donor or Volunteer
  const handleVerifyOtp = async (listingId, otpCode) => {
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await fetch(`/api/listings/${listingId}/verify-pickup`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ otp: otpCode }),
      });
      const data = await res.json();

      if (data.success) {
        addToast('OTP Verified! Food handover confirmed. Transport in progress.', 'success');
        setVerifyOtpListing(null);
        fetchListings();
        fetchAnalytics();
        fetchClaims();
      } else {
        setOtpError(data.message || 'Invalid OTP code');
      }
    } catch (err) {
      setOtpError('Failed to verify OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Delivery Completion
  const handleCompleteDelivery = async (listingId, payload) => {
    setIsCompletingDelivery(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        addToast(data.message || 'Rescue mission completed and logged!', 'success');
        setCompleteModalListing(null);
        fetchListings();
        fetchAnalytics();
        fetchClaims();
      } else {
        addToast(data.message || 'Error completing delivery', 'error');
      }
    } catch (err) {
      addToast('Failed to complete delivery', 'error');
    } finally {
      setIsCompletingDelivery(false);
    }
  };

  // Handle Posting New Food Listing
  const handlePostListing = async (newListingData) => {
    setIsPostSubmitting(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newListingData),
      });
      const data = await res.json();

      if (data.success) {
        addToast('Excess food batch published to the NGO network!', 'success');
        setIsPostModalOpen(false);
        fetchListings();
        fetchAnalytics();
      } else {
        addToast(data.message || 'Error publishing listing', 'error');
      }
    } catch (err) {
      addToast('Failed to publish listing', 'error');
    } finally {
      setIsPostSubmitting(false);
    }
  };

  // Reset Demo Database to Fresh Seed State
  const handleResetDemoData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/analytics/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        addToast('Demo database successfully reset with fresh surplus listings!', 'success');
        fetchListings();
        fetchAnalytics();
        fetchClaims();
      }
    } catch (err) {
      addToast('Failed to reset demo data', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Computed urgent items (< 3 hours)
  const urgentCount = useMemo(() => {
    const now = Date.now();
    return listings.filter((l) => {
      if (l.status !== 'available') return false;
      const diff = new Date(l.expiresAt).getTime() - now;
      return diff > 0 && diff <= 3 * 3600 * 1000;
    }).length;
  }, [listings]);

  // Filtered listings for the marketplace view
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Search text filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = l.title?.toLowerCase().includes(query);
        const matchesDonor = l.donorName?.toLowerCase().includes(query);
        const matchesDesc = l.description?.toLowerCase().includes(query);
        const matchesStreet = l.pickupAddress?.street?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDonor && !matchesDesc && !matchesStreet) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && l.category !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (selectedDietary !== 'All' && l.dietaryType !== selectedDietary) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && l.status !== selectedStatus) {
        return false;
      }

      // Urgent filter
      if (urgentOnly && (!l.isUrgent || l.status !== 'available')) {
        return false;
      }

      return true;
    });
  }, [listings, searchQuery, selectedCategory, selectedDietary, selectedStatus, urgentOnly]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Global Role Switcher Bar */}
      <RoleSwitcher
        currentUser={currentUser}
        onSwitchRole={(role) => switchRole(role)}
        isLoading={isRoleLoading}
      />

      {/* 2. Top Header & Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        urgentCount={urgentCount}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onResetData={handleResetDemoData}
        isResetting={isResetting}
      />

      {/* 3. Main Body Content Based on Active Tab */}
      <main style={{ flexGrow: 1 }}>
        {activeTab === 'marketplace' && (
          <>
            {/* Hero Banner with Live Sustainability Stats */}
            <HeroStats
              analytics={analytics}
              availableCount={listings.filter((l) => l.status === 'available').length}
              onExploreClick={() => {
                const el = document.getElementById('marketplace-search-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Filter & Search Section */}
            <section id="marketplace-search-section" style={{ padding: '0 0 1.5rem' }}>
              <div className="container">
                <div
                  className="glass-panel"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {/* Top Row: Search Input & Category Pills */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1, minWidth: '280px', position: 'relative' }}>
                      <Search
                        size={18}
                        color="var(--text-dim)"
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                      />
                      <input
                        id="search-input"
                        type="text"
                        className="form-input"
                        placeholder="Search excess meals, banquet surplus, bakeries, or donor location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>

                    <button
                      id="toggle-urgent-filter-btn"
                      onClick={() => setUrgentOnly(!urgentOnly)}
                      className={`btn btn-sm ${urgentOnly ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ padding: '0.65rem 1rem' }}
                    >
                      <AlertTriangle size={15} />
                      <span>{urgentOnly ? 'Urgent Filter Active (<3h)' : 'SOS Urgent Only'}</span>
                    </button>
                  </div>

                  {/* Filter Dropdowns Row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.85rem',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      fontSize: '0.84rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                      <Filter size={15} />
                      <span>Category:</span>
                      <select
                        id="filter-category"
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ width: '175px', padding: '0.4rem 1.8rem 0.4rem 0.65rem', fontSize: '0.82rem' }}
                      >
                        <option value="All">All Categories</option>
                        <option value="Cooked Meals">Cooked Meals</option>
                        <option value="Bakery & Bread">Bakery &amp; Bread</option>
                        <option value="Fresh Produce">Fresh Produce</option>
                        <option value="Packaged & Dry Goods">Packaged &amp; Dry Goods</option>
                        <option value="Dairy & Desserts">Dairy &amp; Desserts</option>
                        <option value="Mixed Buffet Surplus">Mixed Buffet Surplus</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                      <span>Dietary:</span>
                      <select
                        id="filter-dietary"
                        className="form-select"
                        value={selectedDietary}
                        onChange={(e) => setSelectedDietary(e.target.value)}
                        style={{ width: '155px', padding: '0.4rem 1.8rem 0.4rem 0.65rem', fontSize: '0.82rem' }}
                      >
                        <option value="All">All Dietary Types</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Eggitarian">Eggitarian</option>
                        <option value="Jain Friendly">Jain Friendly</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                      <span>Status:</span>
                      <select
                        id="filter-status"
                        className="form-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ width: '150px', padding: '0.4rem 1.8rem 0.4rem 0.65rem', fontSize: '0.82rem' }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="reserved">Reserved / Claimed</option>
                        <option value="picked_up">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    {(selectedCategory !== 'All' || selectedDietary !== 'All' || selectedStatus !== 'All' || searchQuery || urgentOnly) && (
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setSelectedDietary('All');
                          setSelectedStatus('All');
                          setSearchQuery('');
                          setUrgentOnly(false);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ marginLeft: 'auto', fontSize: '0.78rem' }}
                      >
                        <RotateCcw size={12} />
                        <span>Clear Filters</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Excess Food Marketplace Listings Grid */}
            <section style={{ padding: '0 0 3.5rem' }}>
              <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                    Available Excess Food Batches ({filteredListings.length})
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Auto-refreshed with real-time expiry countdowns
                  </span>
                </div>

                {isLoadingListings ? (
                  <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading real-time food surplus feed...
                  </div>
                ) : filteredListings.length === 0 ? (
                  <div
                    className="glass-panel"
                    style={{ padding: '3.5rem 2rem', textAlign: 'center' }}
                  >
                    <Utensils size={44} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                      No matching excess food listings found
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                      Try adjusting your filters or click "Reset Demo" in the top navbar to reload fresh realistic surplus donations.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedDietary('All');
                        setSelectedStatus('All');
                        setSearchQuery('');
                        setUrgentOnly(false);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    {filteredListings.map((item) => (
                      <ListingCard
                        key={item._id}
                        listing={item}
                        currentUser={currentUser}
                        onViewDetails={(l) => setDetailsModalListing(l)}
                        onClaim={(l) => {
                          setClaimResult(null);
                          setClaimModalListing(l);
                        }}
                        onVerifyOtp={(l) => {
                          setOtpError('');
                          setVerifyOtpListing(l);
                        }}
                        onCompleteDelivery={(l) => setCompleteModalListing(l)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* 4. Radar Map View */}
        {activeTab === 'map' && (
          <InteractiveMap
            listings={listings}
            currentUser={currentUser}
            onSelectListing={(l) => setDetailsModalListing(l)}
            onClaimListing={(l) => {
              setClaimResult(null);
              setClaimModalListing(l);
            }}
          />
        )}

        {/* 5. My Missions & Pickup Management Tab */}
        {activeTab === 'missions' && (
          <MyMissionsTab
            currentUser={currentUser}
            listings={listings}
            claims={claims}
            onVerifyOtp={(l) => {
              setOtpError('');
              setVerifyOtpListing(l);
            }}
            onCompleteDelivery={(l) => setCompleteModalListing(l)}
            onViewDetails={(l) => setDetailsModalListing(l)}
          />
        )}

        {/* 6. Live Impact & Carbon Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <ImpactDashboardTab analytics={analytics} />
        )}

        {/* 7. Food Safety & Legal Guidelines Tab */}
        {activeTab === 'safety' && (
          <SafetyGuidelinesTab />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(11, 15, 25, 0.95)',
          padding: '2rem 0',
          marginTop: 'auto',
          fontSize: '0.85rem',
          color: 'var(--text-dim)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontWeight: 800, color: '#ffffff' }}>NourishNet</span> — Full Stack MERN Food Donation Marketplace
            <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
              Bridging excess food donors with NGOs, soup kitchens, and orphanages.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span style={{ color: '#10b981' }}>● MongoDB Live</span>
            <span style={{ color: '#38bdf8' }}>● Express REST API</span>
            <span style={{ color: '#ec4899' }}>● React + Vite SPA</span>
            <span style={{ color: '#fbbf24' }}>● Node.js v24</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Listing Details Modal */}
      {detailsModalListing && (
        <ListingDetailsModal
          listing={detailsModalListing}
          currentUser={currentUser}
          onClose={() => setDetailsModalListing(null)}
          onClaim={(l) => {
            setClaimResult(null);
            setClaimModalListing(l);
          }}
          onVerifyOtp={(l) => {
            setOtpError('');
            setVerifyOtpListing(l);
          }}
          onCompleteDelivery={(l) => setCompleteModalListing(l)}
        />
      )}

      {/* 2. Claim Surplus Modal */}
      {claimModalListing && (
        <ClaimModal
          listing={claimModalListing}
          currentUser={currentUser}
          onClose={() => setClaimModalListing(null)}
          onSubmitClaim={handleClaimListing}
          claimResult={claimResult}
          isSubmitting={isClaimSubmitting}
        />
      )}

      {/* 3. OTP Verification Modal */}
      {verifyOtpListing && (
        <OtpVerificationModal
          listing={verifyOtpListing}
          onClose={() => setVerifyOtpListing(null)}
          onVerify={handleVerifyOtp}
          isVerifying={isVerifyingOtp}
          errorMessage={otpError}
        />
      )}

      {/* 4. Complete Delivery Modal */}
      {completeModalListing && (
        <CompleteDeliveryModal
          listing={completeModalListing}
          onClose={() => setCompleteModalListing(null)}
          onComplete={handleCompleteDelivery}
          isCompleting={isCompletingDelivery}
        />
      )}

      {/* 5. Post Excess Food Modal */}
      {isPostModalOpen && (
        <PostListingModal
          currentUser={currentUser}
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handlePostListing}
          isSubmitting={isPostSubmitting}
        />
      )}

      {/* Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' && <CheckCircle size={18} color="#10b981" />}
            {t.type === 'error' && <XCircle size={18} color="#ef4444" />}
            {t.type === 'info' && <Info size={18} color="#3b82f6" />}
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
