-- Initial Seed Data for GramAlert

-- 1. Insert Users
-- Passwords should be BCrypt-hashed 'password'
-- Hash for 'password': $2b$10$T2osgnVy53WxAymA1x.8E.eAti3Hg2mBxriVoYdX.j.KToeOKS4nK
INSERT INTO users (username, password, email, phone, role) VALUES
('villager', '$2b$10$T2osgnVy53WxAymA1x.8E.eAti3Hg2mBxriVoYdX.j.KToeOKS4nK', 'villager@example.com', '9876543210', 'VILLAGER'),
('admin', '$2b$10$T2osgnVy53WxAymA1x.8E.eAti3Hg2mBxriVoYdX.j.KToeOKS4nK', 'admin@example.com', '1234567890', 'ADMIN')
ON CONFLICT (username) DO NOTHING;


-- 2. Insert Grievances
INSERT INTO grievances (title, description, category, status, priority, user_id, latitude, longitude)
VALUES
('No electricity in Ward 4 for 2 days', 'The transformer blew up during the recent storm and power has not been restored.', 'electricity', 'Received', 'Critical', 1, 12.9716, 77.5946),
('Pothole on Main Road', 'Large pothole near the village school. Needs immediate repair.', 'roads', 'In Progress', 'Medium', 1, 12.9720, 77.5950),
('Water supply contaminated', 'Brown water coming from taps since yesterday.', 'water', 'Received', 'High', 1, 12.9710, 77.5940),
('PHC closed during working hours', 'Primary Health Centre was found locked at 11 AM today.', 'health', 'Resolved', 'Low', 1, 12.9730, 77.5960),
('Garbage dumped near lake', 'A lot of garbage is accumulating near the main lake and smells foul.', 'sanitation', 'Received', 'Medium', 1, 12.9740, 77.5970)
ON CONFLICT DO NOTHING;
-- Note: ON CONFLICT not typical for generic inserts without unique constraints unless needed

-- 3. Insert Alerts
INSERT INTO alerts (title, description, category, severity, created_by) VALUES
('Scheduled Power Outage', 'Power will be out from 10 AM to 5 PM on Tuesday for maintenance.', 'electricity', 'medium', 2),
('Boil Water Advisory', 'Please boil water before drinking due to recent pipeline repair.', 'water', 'high', 2),
('Upcoming Health Camp', 'Free eye checkup camp at the Panchayat hall this Sunday.', 'health', 'low', 2);

-- 4. Insert Comments
INSERT INTO comments (grievance_id, user_id, comment) VALUES
(1, 2, 'We have dispatched a team. It should be fixed by this evening.'),
(1, 1, 'Thank you! Fingers crossed.');
