-- Initial Seed Data for GramAlert

-- 1. Insert Initial Admin User
-- Password is BCrypt-hashed 'password'
INSERT INTO users (username, password, email, phone, role) VALUES
('admin', '$2b$10$T2osgnVy53WxAymA1x.8E.eAti3Hg2mBxriVoYdX.j.KToeOKS4nK', 'admin@example.com', '1234567890', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 2. Insert Initial Community Alerts (System wide)
-- We assume admin ID is 1 for the first insert if DB is fresh
INSERT INTO alerts (title, description, category, severity, created_by) VALUES
('Scheduled Power Outage', 'Power will be out from 10 AM to 5 PM on Tuesday for maintenance.', 'electricity', 'medium', (SELECT id FROM users WHERE username = 'admin' LIMIT 1)),
('Boil Water Advisory', 'Please boil water before drinking due to recent pipeline repair.', 'water', 'high', (SELECT id FROM users WHERE username = 'admin' LIMIT 1)),
('Upcoming Health Camp', 'Free eye checkup camp at the Panchayat hall this Sunday.', 'health', 'low', (SELECT id FROM users WHERE username = 'admin' LIMIT 1));

