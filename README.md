# SoulFlow — Premium Mobile Wellness & Sanctuary Platform

SoulFlow is an Apple-grade, mobile-first wellness platform designed for mind, body, and spiritual wellbeing. Combining psychoacoustic 432Hz/528Hz healing music, guided meditations, soundscapes, structured multi-day journeys, mentor masterclasses, and an integrated referral & commission engine.

---

## 🌟 Key Features

### 1. Emotion-Based Personalization
- **Mood Selector**: Instant adaptivity for **Sleep**, **Stress**, **Meditation**, **Relax**, **Focus**, and **Spiritual**.
- **Contextual Greetings**: Dynamic time-of-day greetings ("Good Evening, Alicia") with real-time tailored acoustic recommendations.
- **3-Tap Rule**: Direct access to playable audio content within maximum 3 taps.

### 2. High-Fidelity Audio Experience
- **Audio Streaming & Web Audio Engine**: Dual-engine architecture with real streaming audio + real-time Web Audio API synthesized Solfeggio sound baths (432Hz, 528Hz, binaural delta/alpha beats, and pink noise ocean wash fallback) ensuring 100% gapless and offline-resilient playback.
- **Persistent Mini-Player**: Floats gracefully above bottom tabs during navigation with instant resume, scrubbing, and expansion.
- **Full-Screen Cinematic Player**: Large photography artwork, waveform visualizer, scrubber, shuffle, loop, favorite heart, offline download toggle, share link, and a **Sleep Timer** (5m, 15m, 30m, 45m, 60m, cancel).

### 3. Structured Wellness Journeys
- **Multi-Day Programs**:
  - *7-Day Deep Sleep Transformation*
  - *14-Day Stress Reset*
  - *21-Day Inner Peace*
  - *Morning Energy Ritual*
  - *30-Day Emotional Healing*
- **Progress UI**: Day 1, Day 2, Day 3 checkmarks, completion percentage, and daily practice reminders.

### 4. Mentor & Creator System
- **Profiles**: Master Sound Healers (Alicia Sterling, Dr. Kieran Vance, Elena Rostova, Bodhi Marcus) with biography, ratings, follower counts, student numbers, and curriculum tabs (*About, Music, Meditations, Programs, Courses*).
- **Unique Referral Codes**: e.g., `ALICE888`, `SLEEPWELL`, `CALMMIND`, `BODHI777`.

### 5. Referral & Commission Engine
- **Referral Loop**: Mentor → Referral Code → Registration/Paywall → Coupon & 7-Day Premium Trial → Subscription → Automatic Mentor Commission calculation (e.g. 20%–25%).
- **Instant Validation**: Real-time code recognition with celebratory confetti bursts and unlocked trial periods.

### 6. 3-Tier Membership UI
- **FREE**: Basic access with gentle ads.
- **PREMIUM**: Unlimited music, meditations, soundscapes, zero ads, offline downloads, and wellness programs ($9.99/mo or $79.99/yr).
- **PREMIUM+**: All Premium features + Mentor Courses & Masterclasses ($14.99/mo or $119.99/yr).
- **Annual Toggle**: Highlights 35% savings and 7-day free trial.

### 7. Backend Admin Console
- Accessible directly via the top navigation or profile.
- **Dashboard Overview**: Summary KPI cards (Total Users, Premium Users, Monthly Revenue, Active Mentors, Total Plays, Referral Conversions) and monthly growth charts.
- **Music Management**: Add track, edit, delete, assign mood/category, upload streaming URL and cover, set free/premium tier, publish/unpublish.
- **Mentor Management**: Add mentor, set commission %, issue referral codes.
- **Commission Tracker**: Live table of referral transactions with "Mark as Paid" workflow.

---

## 🗄️ Database Architecture (Supabase / PostgreSQL)

Located at `supabase/migrations/20260924_initial_schema.sql` and seeded with `supabase/seed.sql`:

1. `users` & `profiles`
2. `categories`
3. `artists` & `mentors`
4. `mentor_referral_codes`
5. `music`, `meditations`, `soundscapes`
6. `programs` & `program_days`
7. `courses` & `course_lessons`
8. `playlists` & `playlist_items`
9. `favorites` & `downloads` & `listening_history`
10. `referrals`, `subscriptions`, `payments`, `commissions`
11. `notifications` & `coupons`

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run development server (running on port 3000)
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
