-- Initial Seed Data for GramAlert

-- 1. Insert Initial Admin User
-- Password is BCrypt-hashed 'password'
INSERT INTO users (username, password, email, phone, role) VALUES
('admin', '$2b$10$T2osgnVy53WxAymA1x.8E.eAti3Hg2mBxriVoYdX.j.KToeOKS4nK', 'admin@example.com', '1234567890', 'ADMIN')
ON CONFLICT (username) DO NOTHING;



