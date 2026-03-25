CREATE TABLE IF NOT EXISTS grievance_upvotes (
    id SERIAL PRIMARY KEY,
    grievance_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_upvote UNIQUE(grievance_id, user_id),
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
