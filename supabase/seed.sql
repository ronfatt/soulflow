-- ==============================================================================
-- SOULFLOW PRODUCTION SEED DATA (Supabase / PostgreSQL)
-- Complete UUID Records for Categories, Mentors, Referral Codes, Music, Programs & Courses
-- ==============================================================================

-- 1. CATEGORIES
INSERT INTO public.categories (id, slug, name, description, icon_name, display_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'healing_music', 'Healing Music', '432Hz & 528Hz acoustic baths & meditative instruments', 'Music', 1),
('a0000000-0000-0000-0000-000000000002', 'guided_meditation', 'Guided Meditation', 'Mindful breathwork and somatic consciousness journeys', 'Sparkles', 2),
('a0000000-0000-0000-0000-000000000003', 'sleep', 'Deep Sleep', 'Delta wave entrainment and midnight dreamscapes', 'Moon', 3),
('a0000000-0000-0000-0000-000000000004', 'soundscape', 'Nature Drones', 'Pristine 3D binaural recordings of ancient wildlands', 'Waves', 4),
('a0000000-0000-0000-0000-000000000005', 'stress_relief', 'Stress Reset', 'Nervous system down-regulation & vagus nerve soothing', 'Wind', 5),
('a0000000-0000-0000-0000-000000000006', 'focus', 'Alpha Flow', 'Cognitive clarity acoustics for deep immersion', 'Compass', 6),
('a0000000-0000-0000-0000-000000000007', 'emotional_healing', 'Heart Space', 'Grief release, forgiveness & loving-kindness resonance', 'Heart', 7),
('a0000000-0000-0000-0000-000000000008', 'spiritual', 'Sacred Sound', 'Tibetan singing bowls, gong ceremonies & Solfeggio', 'Sun', 8),
('a0000000-0000-0000-0000-000000000009', 'programs', 'Daily Rituals', 'Multi-day structured transformational journeys', 'Calendar', 9),
('a0000000-0000-0000-0000-000000000010', 'mentor_courses', 'Masterclasses', 'Comprehensive acoustic practices by global teachers', 'GraduationCap', 10)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. MENTORS
INSERT INTO public.mentors (id, name, title, bio, avatar_url, cover_url, specialization, followers_count, students_count, rating, referral_code, commission_percentage, is_featured) VALUES
('b0000000-0000-0000-0000-000000000001', 'Alicia Sterling', 'Master Sound Alchemist & Breathwork Guide', 'Dedicated to the restorative alchemy of acoustic vibration for over 14 years. Alicia weaves rare Tibetan quartz bowls and harmonic Solfeggio intervals to return overstimulated minds to primordial stillness.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80', '432Hz Sound Baths & Sacred Frequencies', 48200, 12400, 4.98, 'ALICE888', 25.00, true),
('b0000000-0000-0000-0000-000000000002', 'Dr. Kieran Vance', 'Neuroscientist & Sleep Architect', 'Former clinical circadian neuro-researcher at Stanford. Kieran designs multi-layered acoustic entrainment algorithms that guide brainwaves directly into restorative slow-wave delta sleep.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'Delta Circadian Synchronization', 35100, 8900, 4.95, 'SLEEPWELL', 20.00, true),
('b0000000-0000-0000-0000-000000000003', 'Elena Rostova', 'Somatic Polyvagal Practitioner', 'Guiding leaders and seekers out of chronic fight-or-flight tension through nervous system down-regulation, vocal toning, and grounding environmental drones.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80', 'Vagus Nerve Reset & Emotional Somatics', 29400, 6700, 4.96, 'CALMMIND', 20.00, false),
('b0000000-0000-0000-0000-000000000004', 'Bodhi Marcus', 'Zen Abbot & Breathwork Master', 'Trained in silent monastic traditions in Kyoto. Bodhi teaches gentle pranayama and spacious open-awareness practices that effortlessly dissolve mental chatter.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80', 'Zen Pranayama & Non-Dual Presence', 21800, 5200, 4.97, 'BODHI777', 20.00, false)
ON CONFLICT (id) DO NOTHING;

-- 3. MENTOR REFERRAL CODES
INSERT INTO public.mentor_referral_codes (id, mentor_id, code, trial_days, discount_percentage, is_active, times_used) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ALICE888', 7, 15.00, true, 184),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'SLEEPWELL', 7, 15.00, true, 92),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'CALMMIND', 7, 15.00, true, 63),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'BODHI777', 7, 15.00, true, 41)
ON CONFLICT (code) DO NOTHING;

-- 4. MUSIC & AUDIO TRACKS
INSERT INTO public.music (id, title, artist_or_mentor, mentor_id, category, category_label, mood, duration_seconds, duration_formatted, cover_url, audio_url, tier, plays, likes, description, is_published) VALUES
('d0000000-0000-0000-0000-000000000001', 'Deep Sleep 432Hz Sound Bath', 'Alicia Sterling', 'b0000000-0000-0000-0000-000000000001', 'sleep', 'Deep Sleep', 'sleep', 1800, '30:00', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/563/563821_9497060-lq.mp3', 'free', 142800, 31200, '432Hz Tibetan crystal bowl harmonics with slow delta undertones to release nighttime overthinking.', true),
('d0000000-0000-0000-0000-000000000002', 'Anxiety Release & Vagus Nerve Reset', 'Elena Rostova', 'b0000000-0000-0000-0000-000000000003', 'stress_relief', 'Stress Reset', 'stress', 900, '15:00', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/612/612610_11861866-lq.mp3', 'free', 98400, 18900, 'Somatic vocal resonance and rain drones calibrated to calm sympathetic nervous arousal.', true),
('d0000000-0000-0000-0000-000000000003', 'Ocean Healing & Twilight Drift', 'Nature Lab Studios', NULL, 'soundscape', 'Nature Drones', 'relax', 2700, '45:00', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/416/416529_5121236-lq.mp3', 'premium', 215600, 48200, 'Golden hour coastal tides recorded with 3D binaural mics for deep somatic unwinding.', true),
('d0000000-0000-0000-0000-000000000004', 'Morning Energy & Prana Awakening', 'Bodhi Marcus', 'b0000000-0000-0000-0000-000000000004', 'guided_meditation', 'Guided Meditation', 'focus', 720, '12:00', 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/563/563821_9497060-lq.mp3', 'free', 76400, 14100, 'Gentle sunrise breathwork and harmonic bells to awaken clean mental clarity without caffeine.', true),
('d0000000-0000-0000-0000-000000000005', 'Sacred 528Hz Miracle Frequency', 'Alicia Sterling', 'b0000000-0000-0000-0000-000000000001', 'healing_music', 'Sacred Sound', 'spiritual', 1500, '25:00', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/612/612610_11861866-lq.mp3', 'premium', 189300, 39400, 'The ancient transformation tone tuned for cellular rejuvenation and heart-centered stillness.', true),
('d0000000-0000-0000-0000-000000000006', 'Alpha Clarity: Undistracted Flow', 'Dr. Kieran Vance', 'b0000000-0000-0000-0000-000000000002', 'focus', 'Alpha Flow', 'focus', 3600, '60:00', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/416/416529_5121236-lq.mp3', 'premium', 164200, 27900, 'Steady 10Hz alpha entrainment interwoven with misty cedar forest textures.', true),
('d0000000-0000-0000-0000-000000000007', 'Heart Chakra & Forgiveness Bath', 'Alicia Sterling', 'b0000000-0000-0000-0000-000000000001', 'emotional_healing', 'Heart Space', 'meditation', 1200, '20:00', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/563/563821_9497060-lq.mp3', 'premium', 87100, 19800, 'Gentle F-note quartz singing bowls tuned to soothe guarded hearts and unlock deep peace.', true),
('d0000000-0000-0000-0000-000000000008', 'Midnight Rain on Redwood Canopy', 'Nature Lab Studios', NULL, 'soundscape', 'Nature Drones', 'sleep', 2400, '40:00', 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/416/416529_5121236-lq.mp3', 'free', 231000, 54100, 'Pure, organic Pacific Northwest rain shower recorded from inside an ancient hollow cedar.', true),
('d0000000-0000-0000-0000-000000000009', 'Stillness Within: Non-Dual Meditation', 'Bodhi Marcus', 'b0000000-0000-0000-0000-000000000004', 'guided_meditation', 'Guided Meditation', 'spiritual', 1080, '18:00', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85', 'https://cdn.freesound.org/previews/612/612610_11861866-lq.mp3', 'premium_plus', 42900, 11200, 'Drop beneath transient thoughts into the boundless, undisturbed silence of awareness.', true)
ON CONFLICT (id) DO NOTHING;

-- 5. WELLNESS PROGRAMS
INSERT INTO public.programs (id, title, subtitle, description, mentor_id, cover_url, total_days, tier, difficulty, is_published) VALUES
('e0000000-0000-0000-0000-000000000001', '7-Day Deep Sleep Sanctuary', 'Rewire circadian pathways and dissolve nighttime hyperarousal', 'A clinically designed protocol combining neuro-acoustic delta waves, twilight wind-down meditations, and breath synchronization.', 'b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=900&q=85', 7, 'premium', 'Gentle • Evening', true),
('e0000000-0000-0000-0000-000000000002', '14-Day Stress Reset', 'Down-regulate chronic burnout and restore inner equilibrium', 'Targeted daily practices combining polyvagal toning, singing bowls, and physiological sighs to permanently lower baseline cortisol.', 'b0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85', 14, 'premium', 'Somatic Reset', true)
ON CONFLICT (id) DO NOTHING;

-- PROGRAM DAYS
INSERT INTO public.program_days (id, program_id, day_number, title, summary, duration_minutes, track_id) VALUES
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 1, 'Day 1: Unwinding Cognitive Overload', 'Release work day residue with grounding 432Hz drones.', 18, 'd0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 2, 'Day 2: Vagus Nerve Down-Shift', 'Synchronize breathing with slow wave acoustic pulses.', 20, 'd0000000-0000-0000-0000-000000000002'),
('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 3, 'Day 3: Theta Transition Sanctuary', 'Guided twilight visualization into ocean sleep.', 25, 'd0000000-0000-0000-0000-000000000003')
ON CONFLICT (program_id, day_number) DO NOTHING;

-- 6. COURSES & LESSONS
INSERT INTO public.courses (id, mentor_id, title, description, cover_url, total_lessons, duration_hours, tier, is_published) VALUES
('80000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Acoustic Alchemy: The Science of Sound Medicine', 'Master how specific acoustic frequencies, Solfeggio intervals, and singing bowls interact with the autonomic nervous system.', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=900&q=85', 8, 3.5, 'premium_plus', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, course_id, lesson_number, title, summary, duration_formatted, audio_url) VALUES
('90000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 1, 'Psychoacoustics & Cellular Resonance', 'How acoustic frequencies physically lower cortisol.', '24:10', 'https://cdn.freesound.org/previews/563/563821_9497060-lq.mp3')
ON CONFLICT (course_id, lesson_number) DO NOTHING;
