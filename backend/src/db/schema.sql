-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL,           -- ADMIN or VILLAGER
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grievances table
CREATE TABLE IF NOT EXISTS grievances (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,       -- electricity, water, roads, sanitation, health, other
    status VARCHAR(20) DEFAULT 'Received', -- Received, In Progress, Resolved
    priority VARCHAR(20) DEFAULT 'Medium', -- High, Medium, Low
    user_id BIGINT NOT NULL,
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
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,       -- electricity, water, health, emergency, other
    severity VARCHAR(20) DEFAULT 'medium', -- high, medium, low
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Escalations table
CREATE TABLE IF NOT EXISTS escalations (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL,
    escalated_to VARCHAR(100),
    escalation_level INT DEFAULT 1,
    escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_priority ON grievances(priority);
CREATE INDEX IF NOT EXISTS idx_grievances_user_id ON grievances(user_id);
CREATE INDEX IF NOT EXISTS idx_grievances_created_at ON grievances(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

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

-- Stored procedure: escalate all overdue grievances
CREATE OR REPLACE PROCEDURE escalate_overdue_grievances()
LANGUAGE plpgsql AS $$
DECLARE
    g RECORD;
BEGIN
    FOR g IN
        SELECT id FROM grievances
        WHERE deadline < NOW()
          AND status != 'Resolved'
          AND is_overdue = FALSE
    LOOP
        UPDATE grievances SET is_overdue = TRUE WHERE id = g.id;
        INSERT INTO escalations (grievance_id, escalated_to, escalation_level)
        VALUES (g.id, 'block-officer@district.gov.in', 1);
    END LOOP;
END;
$$;
