# 🍲 NourishNet - MERN Excess Food Donation Marketplace for NGOs

> **A real-time circular economy marketplace connecting excess food donors (hotels, banquet halls, restaurants, caterers, supermarkets) with verified NGOs, soup kitchens, and charities.** Built on the **MERN** stack (MongoDB, Express, React, Node.js) with real-time countdown timers, interactive geolocation rescue radar, and secure 4-digit OTP handover verification.

---

## 🌟 Key Highlights & Features

### 1. 🍽️ Excess Food Listings & Urgent SOS Feed
- **Detailed Specifications:** Category, quantity, estimated servings fed, dietary classifications (Vegetarian, Vegan, Non-Veg, Jain Friendly), storage temperatures, and allergen disclosures.
- **Live Expiry Countdown:** Ticking countdown timers displaying urgency badges:
  - 🚨 **Urgent SOS (< 3 hours):** Red pulsing alert for immediate rescue.
  - 🟡 **Moderate Window (3–6 hours):** Amber badge.
  - 🟢 **Fresh Window (> 6 hours):** Emerald badge.
- **Food Safety Assurance:** Donor declaration confirming preparation under sanitary conditions outside the Danger Zone.

### 2. 🤝 NGO Reservation & Secure 4-Digit OTP Handover
- **Instant Reservation:** NGOs specify arrival ETA (15m, 30m, 45m, 60m), vehicle type (Cargo Van, Refrigerated Truck, Car, Bike), and notes.
- **Physical Custody Verification:** Generates a secure **4-digit OTP** upon claim. When the NGO representative arrives at the donor's loading dock, the donor verifies this code on their terminal to unlock physical handover and prevent unauthorized pickups.
- **Beneficiary Logging:** Upon arrival at the shelter, the NGO logs the number of residents fed, triggering real-time carbon and meal impact updates.

### 3. 🗺️ Food Rescue Radar (Interactive Map)
- Visual geolocation map featuring Metro City district hubs (Central Food District, West Commercial Strip, North Tech Campus, East Mission Shelters).
- Color-coded pins matching urgency states with click-to-preview cards.

### 4. 👥 1-Click Multi-Role Switcher (For Effortless Testing)
- Switch instantly between:
  - 🍲 **Food Donor:** *Chef Marco Rossi (GreenLeaf Bistro)* — Post food surplus, manage active listings, verify handover OTPs.
  - 🤝 **NGO / Charity:** *Rev. Thomas Miller (City Hope Shelter)* — Claim available food, view secret pickup OTP, complete shelter deliveries.
  - 🚚 **Volunteer Courier:** *Alex Rivera (Community Wheels)* — Assist with rapid transport.
  - 🛡️ **Platform Admin:** Full platform visibility, compliance monitoring, and seed data reset.

### 5. 📊 Real-Time Impact & Carbon Analytics
- Live counters for **Meals Rescued**, **CO2e Emissions Prevented**, and **Beneficiaries Fed**.
- Real-world environmental equivalents: Equivalent trees planted 🌲, passenger car highway km offset 🚗, and virtual agricultural water footprint preserved 💧.
- **Top Zero-Waste Donors Leaderboard** with awards and badges.

### 6. 📜 Food Safety Standards & Good Samaritan Protections
- Temperature Danger Zone rules (4°C – 60°C).
- Bill Emerson Good Samaritan Food Donation Act liability shield explanation.
- Standard Operating Procedures (SOP) for safe transport and reheating.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19 + Vite | Blazing fast Single Page Application with dynamic role state and instant HMR |
| **Styling** | Vanilla CSS Design Tokens | Curated dark theme, glassmorphic surfaces, responsive cards, micro-animations |
| **Backend** | Express.js + Node.js v24 | Modular RESTful API with route protection and data validation |
| **Database** | MongoDB + Mongoose | Dual-mode data persistence (Mongoose with automatic seed initialization) |
| **Authentication** | JWT + bcrypt.js | Secure stateless authentication with role-based access control |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended, tested on Node.js v24)
- **MongoDB** (Local daemon on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Installation
Run from the root directory:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration
The backend is pre-configured with `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/food_donation_marketplace
JWT_SECRET=nourish_net_jwt_super_secret_key_2026_xyz
CLIENT_URL=http://localhost:5173
```

### 3. Starting the Platform

#### Terminal 1 — Backend Server
```bash
cd server
npm start
# Server listens on http://localhost:5000
```

#### Terminal 2 — Frontend Client
```bash
cd client
npm run dev
# Frontend ready on http://localhost:5173
```

---

## 📡 REST API Reference

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/demo-login` | `POST` | Public | 1-Click instant sign-in as `ngo`, `donor`, `volunteer`, or `admin` |
| `/api/auth/register` | `POST` | Public | Register new donor organization or charity |
| `/api/auth/login` | `POST` | Public | Standard email/password login |
| `/api/listings` | `GET` | Public | Fetch food surplus feed with category, dietary, urgency filters |
| `/api/listings/:id` | `GET` | Public | Fetch single food batch specifications and donor contact |
| `/api/listings` | `POST` | Donor / Admin | Publish new excess food batch with safety checklist |
| `/api/listings/:id/claim` | `POST` | NGO / Admin | Reserve surplus batch, select ETA, generates 4-digit OTP |
| `/api/listings/:id/verify-pickup`| `POST` | Donor / Volunteer | Validate the 4-digit pickup OTP at physical handover |
| `/api/listings/:id/complete` | `POST` | NGO / Volunteer | Record delivery completion and beneficiaries served |
| `/api/claims` | `GET` | Authenticated | Retrieve active claims for current organization |
| `/api/analytics/impact` | `GET` | Public | Live sustainability statistics and leaderboard |
| `/api/analytics/reset` | `POST` | Public | Reset database to fresh realistic demonstration data |

---

## 🧪 Testing the User Journey in 2 Minutes

1. Open **`http://localhost:5173/`** in your browser.
2. In the top bar, ensure the role is set to **`NGO / Charity`**.
3. Locate an available food batch (e.g. *Warm Herb-Roasted Free Range Chicken* or *Banquet Buffet Surplus*).
4. Click **`Claim Food`** ➔ Select ETA (e.g. 30 mins) ➔ Click **`Confirm & Generate OTP`**.
5. Note the generated **4-digit Pickup OTP** (e.g. `6740`).
6. Click **`Food Donor`** in the top role bar to switch perspectives to the kitchen staff.
7. Click **`Verify OTP`** on the claimed card ➔ Enter the 4-digit code to confirm physical handoff.
8. Switch back to **`NGO / Charity`** ➔ Click **`Mark Delivered`** ➔ Enter beneficiaries fed (e.g. 60 people).
9. Navigate to the **`Impact & CO2 Saved`** tab to see your live carbon savings and updated meals count!
