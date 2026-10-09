import React from 'react';
import {
  Utensils,
  MapPin,
  Heart,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  RotateCcw,
  Bell,
  Sparkles,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  urgentCount,
  onOpenPostModal,
  onResetData,
  isResetting,
}) {
  const tabs = [
    { id: 'marketplace', label: 'Food Marketplace', icon: Utensils },
    { id: 'map', label: 'Rescue Radar (Map)', icon: MapPin },
    { id: 'missions', label: 'My Claims & Missions', icon: Heart },
    { id: 'analytics', label: 'Impact & CO2 Saved', icon: BarChart3 },
    { id: 'safety', label: 'Food Safety & Rules', icon: ShieldCheck },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(11, 15, 25, 0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-card)' }}>
      {/* Urgent Top Alert Bar if items are expiring soon */}
      {urgentCount > 0 && (
        <div
          style={{
            background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
            color: '#ffffff',
            padding: '0.4rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            animation: 'pulseSlow 3s infinite',
          }}
        >
          <Bell size={14} />
          <span>
            <strong>SOS Surplus Alert:</strong> {urgentCount} prepared food listing{urgentCount > 1 ? 's are' : ' is'} expiring in under 3 hours! Immediate NGO pickup required.
          </span>
          <button
            onClick={() => setActiveTab('marketplace')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.15rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginLeft: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Rescue Now →
          </button>
        </div>
      )}

      {/* Main Navbar Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Brand */}
        <div
          onClick={() => setActiveTab('marketplace')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
            }}
          >
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', color: '#ffffff' }}>
                Nourish<span style={{ color: 'var(--color-primary)' }}>Net</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                MERN LIVE
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
              Excess Food Marketplace for Verified NGOs
            </div>
          </div>
        </div>

        {/* Center Tab Navigation */}
        <nav className="nav-tabs" style={{ display: 'flex' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Post Surplus Button (Available for Donors and Admins) */}
          <button
            id="post-excess-food-btn"
            onClick={onOpenPostModal}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}
          >
            <PlusCircle size={17} />
            <span>Post Excess Food</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            id="reset-demo-btn"
            onClick={onResetData}
            disabled={isResetting}
            className="btn btn-secondary btn-sm"
            title="Reset database to fresh realistic mock listings"
            style={{ padding: '0.55rem 0.75rem' }}
          >
            <RotateCcw size={15} className={isResetting ? 'spin' : ''} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
