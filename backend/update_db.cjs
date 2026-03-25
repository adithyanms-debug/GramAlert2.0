const pg = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'c:\\projects\\GramAlert2.0\\backend\\.env' });

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function applyDBFixes() {
    const client = await pool.connect();
    try {
        console.log('Applying DB fixes...');
        // Alter table to add reason if it doesn't exist
        await client.query('ALTER TABLE escalations ADD COLUMN IF NOT EXISTS reason TEXT');
        console.log('Checked reason column.');
        
        // Execute the updated schema.sql
        const schemaPath = 'c:\\projects\\GramAlert2.0\\backend\\src\\db\\schema.sql';
        
        await client.query('CREATE INDEX IF NOT EXISTS idx_grievance_upvotes_grievance_id ON grievance_upvotes(grievance_id);');
        console.log('Index created.');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Note: we don't want to run the FULL schema.sql because it DROPs tables.
        // We only want to execute the PROCEDURE part, or just use regex to extract it.
        // Alternatively we already replaced it in schema.sql, so we'll just parse the procedure.
        const procStart = schemaSql.indexOf('CREATE OR REPLACE PROCEDURE escalate_overdue_grievances()');
        const procEnd = schemaSql.indexOf('$$;', procStart) + 3;
        const procedureCode = schemaSql.substring(procStart, procEnd);
        
        await client.query(procedureCode);
        console.log('Updated stored procedure in the DB.');
    } catch(err) {
        console.error('Error applying DB fixes:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

applyDBFixes();
