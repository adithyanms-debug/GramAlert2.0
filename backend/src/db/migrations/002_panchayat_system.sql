-- ============================================================
-- 002_panchayat_system.sql
-- Multi-tenant Panchayat System Migration (v2 — with real data)
-- Safe: uses IF NOT EXISTS / IF EXISTS for idempotent execution
-- ============================================================

-- 1. Create Panchayats Table
CREATE TABLE IF NOT EXISTS panchayats (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  district TEXT DEFAULT 'Thrissur',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add panchayat_id to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS panchayat_id INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_users_panchayat'
  ) THEN
    ALTER TABLE users
    ADD CONSTRAINT fk_users_panchayat
    FOREIGN KEY (panchayat_id)
    REFERENCES panchayats(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Add panchayat_id to admins
ALTER TABLE admins
ADD COLUMN IF NOT EXISTS panchayat_id INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_admins_panchayat'
  ) THEN
    ALTER TABLE admins
    ADD CONSTRAINT fk_admins_panchayat
    FOREIGN KEY (panchayat_id)
    REFERENCES panchayats(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- 4. Add panchayat_id to grievances
ALTER TABLE grievances
ADD COLUMN IF NOT EXISTS panchayat_id INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_grievances_panchayat'
  ) THEN
    ALTER TABLE grievances
    ADD CONSTRAINT fk_grievances_panchayat
    FOREIGN KEY (panchayat_id)
    REFERENCES panchayats(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Seed real Panchayat data (idempotent — checks by name)
INSERT INTO panchayats (name, district)
VALUES
('Kodakara','Thrissur'),
('Chalakudy','Thrissur'),
('Irinjalakuda','Thrissur'),
('Ollur','Thrissur'),
('Guruvayur','Thrissur'),
('Kunnamkulam','Thrissur'),
('Wadakkanchery','Thrissur'),
('Mala','Thrissur'),
('Anthikad','Thrissur'),
('Cherpu','Thrissur')
ON CONFLICT (id) DO NOTHING;

-- Also handle cases where ID isn't known but name exists
INSERT INTO panchayats (name, district)
SELECT name, district FROM (VALUES
  ('Kodakara','Thrissur'),
  ('Chalakudy','Thrissur'),
  ('Irinjalakuda','Thrissur'),
  ('Ollur','Thrissur'),
  ('Guruvayur','Thrissur'),
  ('Kunnamkulam','Thrissur'),
  ('Wadakkanchery','Thrissur'),
  ('Mala','Thrissur'),
  ('Anthikad','Thrissur'),
  ('Cherpu','Thrissur')
) AS v(name, district)
WHERE NOT EXISTS (
  SELECT 1 FROM panchayats p WHERE p.name = v.name
);

-- 6. Backfill: Assign existing data to random panchayats
UPDATE users
SET panchayat_id = (SELECT id FROM panchayats ORDER BY RANDOM() LIMIT 1)
WHERE panchayat_id IS NULL;

UPDATE admins
SET panchayat_id = (SELECT id FROM panchayats ORDER BY RANDOM() LIMIT 1)
WHERE panchayat_id IS NULL;

UPDATE grievances
SET panchayat_id = (SELECT id FROM panchayats ORDER BY RANDOM() LIMIT 1)
WHERE panchayat_id IS NULL;

-- 7. Indexes for panchayat lookups
CREATE INDEX IF NOT EXISTS idx_users_panchayat_id ON users(panchayat_id);
CREATE INDEX IF NOT EXISTS idx_admins_panchayat_id ON admins(panchayat_id);
CREATE INDEX IF NOT EXISTS idx_grievances_panchayat_id ON grievances(panchayat_id);
