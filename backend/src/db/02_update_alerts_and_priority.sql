-- 1. Updates to alerts table
ALTER TABLE alerts
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE alerts
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Replace existing message data into description if description is newly added
-- Wait, the user prompt says to 'ADD COLUMN IF NOT EXISTS description TEXT;' and replace message -> description in controller. The DB already has message TEXT NOT NULL. I should copy message to description and maybe make it NOT NULL later. For now just copy.
UPDATE alerts SET description = message WHERE description IS NULL;

-- 2. Data backfill for priority score
UPDATE grievances g
SET priority_score =
  CASE
    WHEN severity = 'Critical' THEN 20
    WHEN severity = 'Medium' THEN 5
    ELSE 1
  END * (
    (SELECT COUNT(*) FROM grievance_upvotes u WHERE u.grievance_id = g.id) + 1
  );

-- 3. Auto-healing system (DB Trigger)
-- Step A: Create Function update_priority_score
CREATE OR REPLACE FUNCTION update_priority_score()
RETURNS TRIGGER AS $$
DECLARE
  vote_count INTEGER;
  severity_weight INTEGER;
BEGIN
  -- We handle AFTER INSERT or DELETE on grievance_upvotes
  -- so NEW or OLD depends on TG_OP
  IF TG_OP = 'DELETE' THEN
      SELECT COUNT(*) INTO vote_count
      FROM grievance_upvotes
      WHERE grievance_id = OLD.grievance_id;

      SELECT CASE
        WHEN severity = 'Critical' THEN 20
        WHEN severity = 'Medium' THEN 5
        ELSE 1
      END INTO severity_weight
      FROM grievances
      WHERE id = OLD.grievance_id;

      UPDATE grievances
      SET priority_score = severity_weight * (vote_count + 1)
      WHERE id = OLD.grievance_id;

      RETURN OLD;
  ELSE
      SELECT COUNT(*) INTO vote_count
      FROM grievance_upvotes
      WHERE grievance_id = NEW.grievance_id;

      SELECT CASE
        WHEN severity = 'Critical' THEN 20
        WHEN severity = 'Medium' THEN 5
        ELSE 1
      END INTO severity_weight
      FROM grievances
      WHERE id = NEW.grievance_id;

      UPDATE grievances
      SET priority_score = severity_weight * (vote_count + 1)
      WHERE id = NEW.grievance_id;

      RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Step B: Trigger on Upvotes
DROP TRIGGER IF EXISTS trigger_update_priority ON grievance_upvotes;

CREATE TRIGGER trigger_update_priority
AFTER INSERT OR DELETE
ON grievance_upvotes
FOR EACH ROW
EXECUTE FUNCTION update_priority_score();

-- Step C: Trigger on Severity Change
CREATE OR REPLACE FUNCTION update_priority_on_severity()
RETURNS TRIGGER AS $$
DECLARE
  vote_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO vote_count
  FROM grievance_upvotes
  WHERE grievance_id = NEW.id;

  NEW.priority_score =
    CASE
      WHEN NEW.severity = 'Critical' THEN 20
      WHEN NEW.severity = 'Medium' THEN 5
      ELSE 1
    END * (vote_count + 1);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_severity_update ON grievances;

CREATE TRIGGER trigger_severity_update
BEFORE UPDATE OF severity
ON grievances
FOR EACH ROW
EXECUTE FUNCTION update_priority_on_severity();
