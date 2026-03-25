-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS escalations CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS grievances CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS super_admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (Now only for Villagers)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Super Admins table (Standalone)
CREATE TABLE IF NOT EXISTS super_admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL DEFAULT 'SUPERADMIN',
    permissions JSONB DEFAULT '{"all": true}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table (Standalone)
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
    department VARCHAR(100),
    division VARCHAR(100),
    created_by_admin_id BIGINT,          -- The Admin who created this admin
    created_by_superadmin_id BIGINT,     -- The Super Admin who created this admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_superadmin_id) REFERENCES super_admins(id) ON DELETE SET NULL,
    CONSTRAINT chk_admin_creator CHECK (
        (created_by_admin_id IS NOT NULL AND created_by_superadmin_id IS NULL) OR 
        (created_by_admin_id IS NULL AND created_by_superadmin_id IS NOT NULL) OR
        (created_by_admin_id IS NULL AND created_by_superadmin_id IS NULL)
    )
);

-- Grievances table
CREATE TABLE IF NOT EXISTS grievances (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,       -- electricity, water, roads, sanitation, health, other
    status VARCHAR(20) DEFAULT 'Received', -- Received, In Progress, Resolved
    priority VARCHAR(20) DEFAULT 'Medium', -- DEPRECATED: do not use priority, replaced by severity + priority_score
    severity TEXT,
    priority_score INTEGER,
    user_id BIGINT NOT NULL,             -- References users (villagers)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    file_url VARCHAR(500),
    deadline TIMESTAMP,
    is_overdue BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    created_by_admin_id BIGINT,          -- References admins(id)
    created_by_superadmin_id BIGINT,     -- References super_admins(id)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_superadmin_id) REFERENCES super_admins(id) ON DELETE CASCADE,
    CONSTRAINT chk_alert_creator CHECK (
        (created_by_admin_id IS NOT NULL AND created_by_superadmin_id IS NULL) OR 
        (created_by_admin_id IS NULL AND created_by_superadmin_id IS NOT NULL)
    )
);

-- Escalations table
CREATE TABLE IF NOT EXISTS escalations (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL,
    escalated_to VARCHAR(100),
    escalation_level INT DEFAULT 1,
    reason TEXT,
    escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL,
    user_id BIGINT,                      -- Refers to users(id) if villager
    admin_id BIGINT,                     -- Refers to admins(id) if admin
    super_admin_id BIGINT,               -- Refers to super_admins(id) if super admin
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (super_admin_id) REFERENCES super_admins(id) ON DELETE CASCADE,
    CONSTRAINT chk_comment_author CHECK (
        (user_id IS NOT NULL AND admin_id IS NULL AND super_admin_id IS NULL) OR 
        (user_id IS NULL AND admin_id IS NOT NULL AND super_admin_id IS NULL) OR
        (user_id IS NULL AND admin_id IS NULL AND super_admin_id IS NOT NULL)
    )
);

-- Grievance upvotes table
CREATE TABLE IF NOT EXISTS grievance_upvotes (
    id SERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_upvote UNIQUE(grievance_id, user_id),
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_priority ON grievances(priority);
CREATE INDEX IF NOT EXISTS idx_grievances_user_id ON grievances(user_id);
CREATE INDEX IF NOT EXISTS idx_grievances_created_at ON grievances(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_escalations_grievance_id ON escalations(grievance_id);
CREATE INDEX IF NOT EXISTS idx_escalations_level ON escalations(escalation_level);
CREATE INDEX IF NOT EXISTS idx_grievance_upvotes_grievance_id ON grievance_upvotes(grievance_id);

-- Trigger: auto-update updated_at on grievances
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_grievances_updated_at ON grievances;
CREATE TRIGGER trigger_grievances_updated_at
BEFORE UPDATE ON grievances
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: auto-calculate deadline on grievance insert
CREATE OR REPLACE FUNCTION set_grievance_deadline()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deadline := CASE NEW.category
        WHEN 'electricity' THEN NEW.created_at + INTERVAL '3 days'
        WHEN 'water'       THEN NEW.created_at + INTERVAL '2 days'
        WHEN 'health'      THEN NEW.created_at + INTERVAL '1 day'
        WHEN 'roads'       THEN NEW.created_at + INTERVAL '7 days'
        WHEN 'sanitation'  THEN NEW.created_at + INTERVAL '5 days'
        ELSE                    NEW.created_at + INTERVAL '7 days'
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_deadline ON grievances;
CREATE TRIGGER trigger_set_deadline
BEFORE INSERT ON grievances
FOR EACH ROW EXECUTE FUNCTION set_grievance_deadline();

-- Stored procedure: multi-level escalation for overdue grievances
-- Level 1: Deadline passed → Panchayat Admin
-- Level 2: 3+ days overdue → Block Development Officer
-- Level 3: 7+ days overdue → District Collector
CREATE OR REPLACE PROCEDURE escalate_overdue_grievances()
LANGUAGE plpgsql AS $$
DECLARE
    g RECORD;
    days_overdue INT;
    current_max_level INT;
BEGIN
    FOR g IN
        SELECT id, deadline, title, category, COALESCE(priority_score, 0) as priority_score FROM grievances
        WHERE (deadline < NOW() OR COALESCE(priority_score, 0) >= 50)
          AND status NOT IN ('Resolved', 'Rejected')
    LOOP
        -- Calculate how many days overdue
        days_overdue := EXTRACT(DAY FROM (NOW() - g.deadline));

        -- Mark as overdue if not already and deadline passed
        IF days_overdue >= 0 THEN
            UPDATE grievances SET is_overdue = TRUE WHERE id = g.id AND is_overdue = FALSE;
        END IF;

        -- Get current max escalation level for this grievance
        SELECT COALESCE(MAX(escalation_level), 0) INTO current_max_level
        FROM escalations WHERE grievance_id = g.id;

        -- Level 3: 7+ days overdue OR priority >= 80
        IF (days_overdue >= 7 OR g.priority_score >= 80) AND current_max_level < 3 THEN
            INSERT INTO escalations (grievance_id, escalated_to, escalation_level, reason)
            VALUES (g.id, 'District Collector', 3,
                CASE WHEN g.priority_score >= 80 
                     THEN 'URGENT: Grievance "' || g.title || '" has reached critical community priority (' || g.priority_score || '). Auto-escalated to highest authority.'
                     ELSE 'URGENT: Grievance "' || g.title || '" remains unresolved for ' || days_overdue || ' days past deadline. Escalated to highest authority.'
                END);
            CONTINUE;
        END IF;

        -- Level 2: 3+ days overdue OR priority >= 50
        IF (days_overdue >= 3 OR g.priority_score >= 50) AND current_max_level < 2 THEN
            INSERT INTO escalations (grievance_id, escalated_to, escalation_level, reason)
            VALUES (g.id, 'Block Development Officer', 2,
                CASE WHEN g.priority_score >= 50 
                     THEN 'Grievance "' || g.title || '" has reached high community priority (' || g.priority_score || '). Escalated to Block level.'
                     ELSE 'Grievance "' || g.title || '" remains unresolved for ' || days_overdue || ' days past deadline. Escalated from Panchayat level.'
                END);
            CONTINUE;
        END IF;

        -- Level 1: Deadline just passed (no existing escalation)
        IF days_overdue >= 0 AND current_max_level < 1 THEN
            INSERT INTO escalations (grievance_id, escalated_to, escalation_level, reason)
            VALUES (g.id, 'Panchayat Admin', 1,
                'Grievance "' || g.title || '" (' || g.category || ') has exceeded its resolution deadline.');
        END IF;
    END LOOP;
END;
$$;
