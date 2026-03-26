import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlFiles = [
    './schema.sql',
    './migrations/001_priority_fix.sql',
    './migrations/002_panchayat_system.sql',
    './migrations/003_ai_features.sql',
    './01_add_upvote_table.sql',
    './02_update_alerts_and_priority.sql'
];

export async function runMigrations() {
    console.log('[Migration] Starting automated database repair...');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const fileRelativePath of sqlFiles) {
            const absolutePath = path.resolve(__dirname, fileRelativePath);
            console.log(`[Migration] Executing: ${path.basename(absolutePath)}`);
            const sql = fs.readFileSync(absolutePath, 'utf8');
            await client.query(sql);
        }
        await client.query('COMMIT');
        console.log('[Migration] All migrations completed successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('[Migration] Critical failure during migration:', err.message);
        // We don't exit the process here to allow the server to potentially start
        // but the DB state might be inconsistent. In production, we might want to exit.
    } finally {
        client.release();
    }
}
