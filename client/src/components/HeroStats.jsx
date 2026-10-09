import React from 'react';
import { Utensils, Leaf, Heart, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function HeroStats({ analytics, availableCount, onExploreClick }) {
  const stats = [
    {
      id: 'meals',
      label: 'Meals Rescued',
      value: (analytics?.totalMealsRescued || 1500).toLocaleString() + '+',
      desc: 'Delivered directly to local soup kitchens',
      icon: Utensils,
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    {
      id: 'co2',
      label: 'CO2e Diverted',
      value: (analytics?.co2SavedKg || 1875).toLocaleString() + ' kg',
      desc: 'Landfill greenhouse gas emissions averted',
      icon: Leaf,
      color: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.25)',
    },
    {
      id: 'available',
      label: 'Surplus Batches Available',
      value: availableCount,
      desc: 'Ready for immediate NGO pickup right now',
      icon: Clock,
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
    {
      id: 'beneficiaries',
      label: 'Shelter Residents Fed',
      value: (analytics?.totalBeneficiaries || 1420).toLocaleString() + '+',
      desc: 'Children, families & elderly individuals',
      icon: Heart,
      color: '#ec4899',
      glow: 'rgba(236, 72, 153, 0.25)',
    },
  ];

  return (
    <section style={{ padding: '2.5rem 0 1.5rem', position: 'relative' }}>
      <div className="container">
        {/* Hero Header Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem 2rem',
            marginBottom: '2rem',
            background: 'radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.95) 70%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(16, 185, 129, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.35)', marginBottom: '1rem' }}>
              <ShieldCheck size={16} color="#34d399" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.02em' }}>
                FSSAI & GOOD SAMARITAN FOOD SAFETY VERIFIED
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.85rem)', marginBottom: '0.85rem', lineHeight: 1.18 }}>
              Turn Food Surplus into <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lifelines</span> for NGOs.
            </h1>

            <p style={{ fontSize: '1.08rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '720px' }}>
              Connect hotels, banquet halls, restaurants, and supermarkets with verified food rescue charities and shelters. Instant reservation, real-time expiry alerts, and secure 4-digit OTP handover.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={onExploreClick}
                className="btn btn-primary btn-lg"
              >
                <span>Browse Excess Food Feed</span>
                <ArrowUpRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                <span>Live dispatch active across Metro City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="glass-panel"
                style={{
                  padding: '1.4rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.1rem',
                  background: 'rgba(17, 24, 39, 0.75)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `${stat.color}22`,
                    border: `1px solid ${stat.color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff', lineHeight: 1.1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                    {stat.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
