-- Initial Seed Data for GramAlert
-- Clear all data for a clean slate
TRUNCATE grievances, alerts, comments, escalations, admins, super_admins, users RESTART IDENTITY CASCADE;

-- 1. Insert Initial Villagers
INSERT INTO users (username, password, email, phone, panchayat_id) VALUES
('villager', '$2b$10$T2osgnVy53WxAymA1x.8E.eAti3Hg2mBxriVoYdX.j.KToeOKS4nK', 'villager@example.com', '1234567890', 1);

-- 2. Insert Initial Super Admin
-- superadmin: GramAlert@2026 ('$2b$10$hut6G3ZhsotmwBfDIDv5BOMwWDSiDa6.CxFztC5mep8s.CF3oHrtC')
INSERT INTO super_admins (username, password, email, phone, role) VALUES
('superadmin', '$2b$10$hut6G3ZhsotmwBfDIDv5BOMwWDSiDa6.CxFztC5mep8s.CF3oHrtC', 'superadmin@gramalert.com', '9876543210', 'SUPERADMIN');

-- 3. Insert Initial Admin
-- admin: password ('$2b$10$T2osgnVy53WxAymA1x.8E.eAti3Hg2mBxriVoYdX.j.KToeOKS4nK')
INSERT INTO admins (username, password, email, phone, role, department, division, created_by_superadmin_id, panchayat_id) VALUES
('admin', '$2b$10$T2osgnVy53WxAymA1x.8E.eAti3Hg2mBxriVoYdX.j.KToeOKS4nK', 'admin@example.com', '1234567890', 'ADMIN', 'Public Works', 'Maintenance', 1, 1);



