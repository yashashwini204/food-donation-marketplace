import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Utensils,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';

export default function PostListingModal({
  currentUser,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cooked Meals',
    description: '',
    quantity: 35,
    quantityUnit: 'meals',
    estimatedServings: 50,
    dietaryType: 'Vegetarian',
    allergens: 'None reported',
    storageCondition: 'Hot (Keep > 60°C)',
    expiryHours: 3,
    streetAddress: currentUser?.address || '142 Grand Avenue, Central Square',
    contactPerson: currentUser?.name || 'Duty Chef',
    contactPhone: currentUser?.phone || '+1 (555) 432-8921',
    handlingNotes: 'Insulated transport carrier recommended.',
    foodSafetyVerified: true,
  });

  const presets = [
    {
      label: '🍲 Banquet Buffet Surplus',
      title: 'Grand Banquet Dinner: Veg Dum Biryani, Paneer Curry & Breads',
      category: 'Cooked Meals',
      description: 'Prepared for evening hotel banquet in stainless steel chafing units. Untouched, hygienically sealed at conclusion of banquet.',
      quantity: 40,
      quantityUnit: 'kg',
      estimatedServings: 80,
      dietaryType: 'Vegetarian',
      storageCondition: 'Hot (Keep > 60°C)',
      expiryHours: 2.5,
      allergens: 'Dairy, Gluten',
    },
    {
      label: '🥖 Bakery End-of-Day Bread',
      title: 'Artisan Hearth Sourdough Loaves, Croissants & Baguettes',
      category: 'Bakery & Bread',
      description: 'Surplus baked this morning. Boxed in clean kraft bakery containers ready for shelter distribution.',
      quantity: 50,
      quantityUnit: 'boxes',
      estimatedServings: 60,
      dietaryType: 'Vegetarian',
      storageCondition: 'Room Temperature / Ambient',
      expiryHours: 8,
      allergens: 'Gluten',
    },
    {
      label: '🍱 Corporate Bento Lunches',
      title: 'Executive Conference Lunch Boxes: Herb Rice & Steamed Veg',
      category: 'Cooked Meals',
      description: 'Individual sealed bento meal boxes from afternoon boardroom meetings. Pristine and packaged with disposable cutlery.',
      quantity: 35,
      quantityUnit: 'meals',
      estimatedServings: 35,
      dietaryType: 'Vegan',
      storageCondition: 'Room Temperature / Ambient',
      expiryHours: 3,
      allergens: 'None reported',
    },
    {
      label: '🍎 Supermarket Fresh Produce',
      title: 'Organic Apples, Citrus, Spinach & Squash Crates',
      category: 'Fresh Produce',
      description: 'Surplus retail grade inventory. Fresh, nutrient dense produce for shelter soup kitchens.',
      quantity: 45,
      quantityUnit: 'kg',
      estimatedServings: 90,
      dietaryType: 'Vegan',
      storageCondition: 'Cold / Refrigerated (< 4°C)',
      expiryHours: 14,
      allergens: 'None reported',
    },
  ];

  const applyPreset = (p) => {
    setFormData((prev) => ({
      ...prev,
      title: p.title,
      category: p.category,
      description: p.description,
      quantity: p.quantity,
      quantityUnit: p.quantityUnit,
      estimatedServings: p.estimatedServings,
      dietaryType: p.dietaryType,
      storageCondition: p.storageCondition,
      expiryHours: p.expiryHours,
      allergens: p.allergens,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.quantity || !formData.estimatedServings) return;

    const now = Date.now();
    const expiresAt = new Date(now + Number(formData.expiryHours) * 3600000).toISOString();
    const pickupWindowStart = new Date(now).toISOString();
    const pickupWindowEnd = expiresAt;

    const allergenArray = formData.allergens
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      quantity: Number(formData.quantity),
      quantityUnit: formData.quantityUnit,
      estimatedServings: Number(formData.estimatedServings),
      dietaryType: formData.dietaryType,
      allergens: allergenArray.length > 0 ? allergenArray : ['None reported'],
      storageCondition: formData.storageCondition,
      cookedOrPackedAt: new Date().toISOString(),
      expiresAt,
      pickupWindowStart,
      pickupWindowEnd,
      pickupAddress: {
        street: formData.streetAddress,
        city: 'Metro City',
        landmark: 'Loading Dock Area',
        lat: 37.7749 + (Math.random() - 0.5) * 0.04,
        lng: -122.4194 + (Math.random() - 0.5) * 0.04,
      },
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      handlingNotes: formData.handlingNotes,
      foodSafetyVerified: formData.foodSafetyVerified,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Post Surplus Excess Food</h2>
          </div>
          <button onClick={onClose} className="btn-close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Quick Presets Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={13} color="#f59e0b" /> Fast 1-Click Templates:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="listing-title">
                Surplus Food Title *
              </label>
              <input
                id="listing-title"
                type="text"
                className="form-input"
                placeholder="e.g. Hot Vegetable Dum Biryani, Raita & Naan"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Category and Dietary Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="listing-category">
                  Food Category
                </label>
                <select
                  id="listing-category"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Bakery & Bread">Bakery &amp; Bread</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Packaged & Dry Goods">Packaged &amp; Dry Goods</option>
                  <option value="Dairy & Desserts">Dairy &amp; Desserts</option>
                  <option value="Mixed Buffet Surplus">Mixed Buffet Surplus</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="listing-dietary">
                  Dietary Classification
                </label>
                <select
                  id="listing-dietary"
                  className="form-select"
                  value={formData.dietaryType}
                  onChange={(e) => setFormData({ ...formData, dietaryType: e.target.value })}
                >
                  <option value="Vegetarian">🌱 Vegetarian</option>
                  <option value="Vegan">🌿 Vegan</option>
                  <option value="Non-Vegetarian">🍗 Non-Vegetarian</option>
                  <option value="Eggitarian">🥚 Eggitarian</option>
                  <option value="Jain Friendly">🕊️ Jain Friendly</option>
                </select>
              </div>
            </div>

            {/* Quantities & Servings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="listing-quantity">
                  Quantity *
                </label>
                <input
                  id="listing-quantity"
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="listing-unit">
                  Unit
                </label>
                <select
                  id="listing-unit"
                  className="form-select"
                  value={formData.quantityUnit}
                  onChange={(e) => setFormData({ ...formData, quantityUnit: e.target.value })}
                >
                  <option value="meals">meals / portions</option>
                  <option value="kg">kg</option>
                  <option value="boxes">boxes</option>
                  <option value="trays">trays</option>
                  <option value="liters">liters</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="listing-servings">
                  Estimated Servings Fed *
                </label>
                <input
                  id="listing-servings"
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.estimatedServings}
                  onChange={(e) => setFormData({ ...formData, estimatedServings: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Storage Condition & Expiry Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="listing-storage">
                  Required Storage Temperature
                </label>
                <select
                  id="listing-storage"
                  className="form-select"
                  value={formData.storageCondition}
                  onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value })}
                >
                  <option value="Hot (Keep > 60°C)">🔥 Hot (Keep &gt; 60°C)</option>
                  <option value="Cold / Refrigerated (< 4°C)">❄️ Cold / Chilled (&lt; 4°C)</option>
                  <option value="Frozen (< -18°C)">🧊 Frozen (&lt; -18°C)</option>
                  <option value="Room Temperature / Ambient">📦 Room Temp / Ambient</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="listing-expiry-hours">
                  <span>Safe Pickup Window</span>
                  <span style={{ color: Number(formData.expiryHours) <= 3 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                    {formData.expiryHours} hours
                  </span>
                </label>
                <select
                  id="listing-expiry-hours"
                  className="form-select"
                  value={formData.expiryHours}
                  onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
                >
                  <option value="1.5">1.5 hours (Urgent SOS)</option>
                  <option value="2.5">2.5 hours (Urgent)</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours (Ambient/Produce)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="listing-desc">
                Description &amp; Food Quality Notes
              </label>
              <textarea
                id="listing-desc"
                className="form-textarea"
                rows="2"
                placeholder="Details regarding cooking time, hygiene seal, or container packing..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Address and Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="listing-address">
                  Pickup Street &amp; Dock
                </label>
                <input
                  id="listing-address"
                  type="text"
                  className="form-input"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="listing-contact">
                  Contact Phone
                </label>
                <input
                  id="listing-contact"
                  type="text"
                  className="form-input"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Food Safety Declaration */}
            <div
              style={{
                marginTop: '1rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px',
                padding: '0.85rem',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="safety-declaration-check"
                  checked={formData.foodSafetyVerified}
                  onChange={(e) => setFormData({ ...formData, foodSafetyVerified: e.target.checked })}
                  style={{ marginTop: '0.2rem', accentColor: '#10b981' }}
                  required
                />
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  <strong>Food Safety Certification:</strong> As a verified donor, I declare that this food was prepared today in our licensed kitchen, packaged in clean food-safe containers, and kept outside the Danger Zone.
                </span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              id="submit-new-listing-btn"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              <PlusCircle size={17} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish to NGO Network'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
