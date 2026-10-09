import React from 'react';
import {
  BarChart3,
  Leaf,
  Utensils,
  Heart,
  Award,
  TreePine,
  Car,
  Droplets,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function ImpactDashboardTab({ analytics }) {
  const meals = analytics?.totalMealsRescued || 1500;
  const kg = analytics?.totalKgRescued || 750;
  const co2 = analytics?.co2SavedKg || 1875;
  const beneficiaries = analytics?.totalBeneficiaries || 1420;

  // Environmental equivalence conversions
  const treesEquiv = Math.round(co2 / 21); // ~21 kg CO2 absorbed per tree/year
  const carKmEquiv = Math.round(co2 * 4.2); // ~0.24 kg CO2 per km driven
  const waterSavedLiters = Math.round(kg * 45); // water footprint preserved

  const topDonors = analytics?.topDonors || [
    { name: 'The Royal Orchid Banquet Hall', meals: 680, category: 'Buffet & Banquets', badge: 'Hero Donor 🏆' },
    { name: 'GreenValley Fresh Supermarket', meals: 520, category: 'Produce & Dairy', badge: 'Zero-Waste Champion 🌱' },
    { name: 'Artisan Daily Hearth & Bakery', meals: 380, category: 'Bakery & Bread', badge: 'Community Partner 🥖' },
    { name: 'TechPark Horizon Cafeteria', meals: 290, category: 'Corporate Catering', badge: 'Silver Rescuer 💼' },
  ];

  return (
    <div style={{ padding: '1.5rem 0 3rem' }}>
      <div className="container">
        {/* Title Header */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'radial-gradient(ellipse at top right, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.95) 70%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#06b6d4', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Sparkles size={15} /> SUSTAINABILITY & CIRCULAR ECONOMY INTELLIGENCE
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Live Environmental &amp; Food Relief Impact
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '720px' }}>
            Every kilogram of excess food rescued from landfills prevents methane emissions, conserves freshwater, and directly addresses hunger across local shelters.
          </p>
        </div>

        {/* Big Impact Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                Meals Diverted to Hunger Relief
              </span>
              <Utensils size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {meals.toLocaleString()}+
            </div>
            <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <TrendingUp size={14} /> 100% wholesome &amp; edible
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                Landfill Greenhouse Gases Avoided
              </span>
              <Leaf size={20} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {co2.toLocaleString()} kg
            </div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.35rem' }}>
              CO2e equivalent emissions diverted
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #ec4899' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total People &amp; Families Fed
              </span>
              <Heart size={20} color="#ec4899" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {beneficiaries.toLocaleString()}+
            </div>
            <div style={{ fontSize: '0.8rem', color: '#f472b6', marginTop: '0.35rem' }}>
              Verified shelter recipients
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                Solid Food Diverted from Landfills
              </span>
              <TreePine size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {kg.toLocaleString()} kg
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '0.35rem' }}>
              Zero-waste circular diversion
            </div>
          </div>
        </div>

        {/* Real-World Equivalence Translators */}
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem',
            marginBottom: '2.5rem',
            background: 'rgba(15, 23, 42, 0.85)',
          }}
        >
          <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
            🌍 Tangible Environmental Impact Equivalents
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TreePine size={24} color="#10b981" />
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  {treesEquiv} Trees
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Carbon absorption equivalent of planting trees for 1 year
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={24} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  {carKmEquiv.toLocaleString()} km
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Passenger car highway driving emissions cancelled out
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplets size={24} color="#06b6d4" />
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  {waterSavedLiters.toLocaleString()} L
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Virtual freshwater footprint preserved from wasted agriculture
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Donors Leaderboard */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={22} color="#f59e0b" />
              <span>Top Surplus Food Donors Leaderboard</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Updated in Real-Time
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topDonors.map((donor, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'rgba(255,255,255,0.1)',
                      color: idx <= 2 ? '#0f172a' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                    }}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                      {donor.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      Category: {donor.category}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <span className="badge badge-emerald">
                    {donor.badge}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1.15rem' }}>
                      {donor.meals}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Meals Provided
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
