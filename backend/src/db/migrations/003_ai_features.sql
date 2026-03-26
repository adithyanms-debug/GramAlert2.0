-- 003_ai_features.sql
-- Add AI Sentiment and Embedding columns to grievances

ALTER TABLE grievances
ADD COLUMN IF NOT EXISTS sentiment_score FLOAT DEFAULT 0,
ADD COLUMN IF NOT EXISTS embedding JSONB,
ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS duplicate_of_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_duplicate_of'
    ) THEN
        ALTER TABLE grievances
        ADD CONSTRAINT fk_duplicate_of
        FOREIGN KEY (duplicate_of_id)
        REFERENCES grievances(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- Index for sentiment analysis lookups
CREATE INDEX IF NOT EXISTS idx_grievances_sentiment ON grievances(sentiment_score);
