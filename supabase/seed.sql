-- Seed data for testing StudentOS

-- Default User Profile
INSERT INTO profiles (id, full_name, email, semester, department, avatar_url)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Alex Johnson',
    'alex.johnson@university.edu',
    3,
    'Computer Science & Physics',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
) ON CONFLICT (id) DO NOTHING;

-- Subjects
INSERT INTO subjects (id, user_id, name, code, color, room, professor)
VALUES 
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Physics', 'PHY-301', '#5B6CFF', 'B-204', 'Dr. Sarah Mitchell'),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Mathematics', 'MAT-302', '#8A7BFF', 'A-101', 'Prof. James Chen'),
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'Computer Science', 'CS-303', '#06B6D4', 'Lab-3', 'Dr. Priya Sharma'),
    ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'English Lit', 'ENG-201', '#F59E0B', 'C-305', 'Dr. Emily Watson'),
    ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Chemistry', 'CHE-304', '#22C55E', 'Lab-1', 'Prof. Michael Lee')
ON CONFLICT (user_id, code) DO NOTHING;

-- Timetable slots
INSERT INTO timetable_slots (user_id, subject_id, day_of_week, start_time, end_time, class_type, room)
VALUES
    -- Monday
    ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Mon', '09:00:00', '10:30:00', 'Lecture', 'B-204'),
    ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Mon', '11:00:00', '12:30:00', 'Lecture', 'A-101'),
    ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'Mon', '14:00:00', '16:00:00', 'Lab', 'Lab-3'),
    -- Tuesday
    ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'Tue', '09:00:00', '10:30:00', 'Lecture', 'C-305'),
    ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'Tue', '11:00:00', '13:00:00', 'Lab', 'Lab-1'),
    ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Tue', '14:00:00', '15:30:00', 'Tutorial', 'A-101');

-- Attendance records
INSERT INTO attendance_records (user_id, subject_id, attended_count, total_count)
VALUES
    ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 23, 25),
    ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 21, 25),
    ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 22, 24),
    ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 17, 22),
    ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 20, 23)
ON CONFLICT (user_id, subject_id) DO NOTHING;

-- Notes
INSERT INTO notes (user_id, subject_id, title, content, folder_name, is_pinned, words_count, tags)
VALUES
    ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Quantum Mechanics — Wave-Particle Duality', 'The wave-particle duality principle states that every particle exhibits both wave and particle properties…', 'General', true, 847, ARRAY['quantum', 'exam']),
    ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Fourier Series & Transforms', 'A Fourier series decomposes periodic functions into the sum of simple sinusoidal components…', 'General', true, 612, ARRAY['calculus', 'transform']);

-- Assignments
INSERT INTO assignments (user_id, subject_id, title, due_date, priority, is_done, progress_percentage)
VALUES
    ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Quantum Mechanics Problem Set', NOW() + INTERVAL '1 day', 'high', false, 60),
    ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Differential Equations Ch. 7–9', NOW() + INTERVAL '3 days', 'medium', false, 30),
    ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'Binary Search Tree Implementation', NOW() + INTERVAL '6 days', 'high', false, 0);
