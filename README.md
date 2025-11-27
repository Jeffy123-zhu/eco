# EcoTrack

An AI-powered carbon footprint tracker that helps individuals understand and reduce their environmental impact through receipt scanning, gamified challenges, and data-driven insights.

## Problem Statement

Climate change is the defining challenge of our generation. Yet for most people, their personal carbon footprint remains completely invisible. The average person generates approximately 4 tons of CO2 annually through consumption alone - but without visibility into this impact, meaningful behavior change is nearly impossible.

Existing carbon calculators are either too complex (requiring manual data entry) or too generic (providing only rough estimates). There's a gap in the market for a tool that makes carbon tracking effortless and actionable.

## Our Solution

EcoTrack bridges this gap by making carbon footprint tracking as simple as taking a photo. Our approach:

1. **Instant Receipt Analysis** - Snap a photo of any receipt. Our AI extracts items and calculates their carbon footprint in seconds using research-backed emission factors.

2. **Personalized Dashboard** - Track your weekly, monthly, and yearly emissions with beautiful visualizations. See how you compare to global averages and identify your highest-impact categories.

3. **AI-Powered Insights** - Receive personalized recommendations based on your actual consumption patterns, not generic advice.

4. **Gamified Challenges** - Join community challenges like "Meatless Week" or "Public Transport Hero" to make reducing emissions engaging and social.

5. **Social Leaderboard** - Compete with friends and the community. See your ranking and get motivated by others' progress.

## Key Features

### Receipt Scanner
- Drag-and-drop or click to upload
- Supports grocery receipts, restaurant bills, utility statements
- AI-powered item extraction using GPT-4 Vision
- Instant carbon calculation with category breakdown
- Actionable suggestions for each scan

### Interactive Dashboard
- Real-time carbon tracking with Chart.js visualizations
- Weekly trend analysis with highest-emission day identification
- Category breakdown (Food, Transport, Shopping, Utilities)
- 6-month progress tracking
- Comparison against global averages
- Streak tracking for consistent logging

### Challenge System
- Curated eco-challenges with varying difficulty levels
- Progress tracking with visual indicators
- Carbon savings calculator per challenge
- Community participation stats
- Achievement badges and sharing

### Leaderboard
- Weekly, monthly, and all-time rankings
- Top 3 podium display
- Personal ranking with improvement tips
- Streak and badge tracking

## Technical Architecture

```
Frontend (Next.js 14 App Router)
    |
    +-- React Components (TailwindCSS)
    |       |-- Dashboard (Chart.js)
    |       |-- ReceiptScanner
    |       |-- Challenges
    |       +-- Leaderboard
    |
    +-- API Routes
            |-- /api/analyze (OpenAI Vision)
            +-- /api/user (Supabase)

Backend Services
    |
    +-- OpenAI GPT-4 Vision (Receipt OCR + Analysis)
    +-- Supabase (PostgreSQL + Auth)
    +-- Vercel (Hosting + Edge Functions)
```

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 | App Router, API routes, optimal performance |
| Styling | TailwindCSS | Rapid UI development, consistent design |
| Charts | Chart.js | Lightweight, responsive visualizations |
| AI | OpenAI GPT-4 Vision | Best-in-class receipt OCR and analysis |
| Database | Supabase | PostgreSQL with real-time, easy auth |
| Deployment | Vercel | Zero-config, edge functions, fast CDN |

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm

### Quick Start

```bash
git clone https://github.com/yourusername/ecotrack.git
cd ecotrack
npm install
npm run dev
```

Visit `http://localhost:3000` - the app works in demo mode without any API keys.

### Environment Variables (Optional)

For full functionality, create a `.env.local` file:

```env
# OpenAI - for receipt analysis
OPENAI_API_KEY=sk-...

# Supabase - for data persistence
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Carbon Calculation Methodology

Our emission factors are sourced from peer-reviewed research and official databases:

| Source | Data Used |
|--------|-----------|
| EPA | Greenhouse Gas Equivalencies Calculator |
| Carbon Trust | Product Carbon Footprint Database |
| Our World in Data | Food production emissions research |
| DEFRA | UK Government emission factors |

### Sample Emission Factors (kg CO2e per kg)

| Category | Item | Factor |
|----------|------|--------|
| Meat | Beef | 27.0 |
| Meat | Chicken | 6.9 |
| Dairy | Cheese | 13.5 |
| Dairy | Milk | 1.9 |
| Produce | Vegetables (avg) | 0.4 |
| Grains | Rice | 2.7 |
| Transport | Car (per km) | 0.21 |

## Impact Potential

Based on behavioral research, users who track their carbon footprint reduce emissions by 10-15% on average.

**If EcoTrack reaches 10,000 active users:**
- 400+ tons CO2 saved annually
- Equivalent to planting 19,000 trees
- Or removing 87 cars from the road for a year

## Roadmap

### Phase 1 (Current)
- [x] Receipt scanning with AI
- [x] Dashboard with visualizations
- [x] Challenge system
- [x] Leaderboard

### Phase 2 (Q1 2025)
- [ ] Mobile app (React Native)
- [ ] Bank transaction integration (Plaid)
- [ ] Team/organization challenges
- [ ] Carbon offset marketplace

### Phase 3 (Q2 2025)
- [ ] Smart home integration
- [ ] Travel carbon calculator
- [ ] Corporate sustainability dashboards
- [ ] API for third-party integrations

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Team

Built with care for our planet.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**EcoTrack** - Making sustainability visible, actionable, and achievable.
