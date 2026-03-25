-- TASK 1: Remove legacy priority usage (DB Schema side)
-- We document the deprecation and ensure new columns exist.

-- TASK 6: Fix Schema Drift
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE grievances ADD COLUMN IF NOT EXISTS severity TEXT;
ALTER TABLE grievances ADD COLUMN IF NOT EXISTS priority_score INTEGER;

-- TASK 2: Add Index for Performance
CREATE INDEX IF NOT EXISTS idx_grievance_upvotes_gid
ON grievance_upvotes(grievance_id);

-- TASK 3, 4, 5: Optimize Trigger Function, Prevent Side Effects, Add Safety Logging
CREATE OR REPLACE FUNCTION update_priority_score()
RETURNS TRIGGER AS $$
DECLARE
  target_id BIGINT;
BEGIN
  IF TG_OP = 'DELETE' THEN
      target_id = OLD.grievance_id;
  ELSE
      target_id = NEW.grievance_id;
  END IF;

  -- Single UPDATE query avoids multiple SELECTs, uses the new index, and safely targets only the affected row.
  UPDATE grievances
  SET priority_score = CASE
        WHEN severity = 'Critical' THEN 20
        WHEN severity = 'Medium' THEN 5
        ELSE 1
      END * (
        (SELECT COUNT(*) FROM grievance_upvotes WHERE grievance_id = target_id) + 1
      )
  WHERE id = target_id;

  -- Safety logging (Task 5)
  RAISE NOTICE 'Priority updated for grievance %', target_id;

  IF TG_OP = 'DELETE' THEN
      RETURN OLD;
  ELSE
      RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_priority ON grievance_upvotes;

CREATE TRIGGER trigger_update_priority
AFTER INSERT OR DELETE
ON grievance_upvotes
FOR EACH ROW
EXECUTE FUNCTION update_priority_score();

-- Ensure severity trigger is also safe and optimized
CREATE OR REPLACE FUNCTION update_priority_on_severity()
RETURNS TRIGGER AS $$
DECLARE
  vote_count INTEGER;
BEGIN
  IF NEW.severity IS DISTINCT FROM OLD.severity THEN
      SELECT COUNT(*) INTO vote_count
      FROM grievance_upvotes
      WHERE grievance_id = NEW.id;

      NEW.priority_score =
        CASE
          WHEN NEW.severity = 'Critical' THEN 20
          WHEN NEW.severity = 'Medium' THEN 5
          ELSE 1
        END * (vote_count + 1);
        
      RAISE NOTICE 'Priority updated for grievance %', NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_severity_update ON grievances;

CREATE TRIGGER trigger_severity_update
BEFORE UPDATE OF severity
ON grievances
FOR EACH ROW
EXECUTE FUNCTION update_priority_on_severity();
