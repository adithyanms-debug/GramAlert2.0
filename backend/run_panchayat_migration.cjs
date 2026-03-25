const pg = require('pg');
const fs = require('fs');
require('dotenv').config({ path: 'c:\\projects\\GramAlert2.0\\backend\\.env' });

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function runMigration() {
    const client = await pool.connect();
    try {
        const sql = fs.readFileSync('c:\\projects\\GramAlert2.0\\backend\\src\\db\\migrations\\002_panchayat_system.sql', 'utf8');
        console.log('Running Panchayat migration...');
        await client.query(sql);
        console.log('✅ Migration complete.');

        // Verify
        const pRes = await client.query('SELECT * FROM panchayats');
        console.log(`Panchayats: ${pRes.rows.length} row(s)`, pRes.rows);

        const uRes = await client.query('SELECT id, username, panchayat_id FROM users LIMIT 5');
        console.log('Users sample:', uRes.rows);

        const aRes = await client.query('SELECT id, username, panchayat_id FROM admins LIMIT 5');
        console.log('Admins sample:', aRes.rows);

        const gRes = await client.query('SELECT id, title, panchayat_id FROM grievances LIMIT 5');
        console.log('Grievances sample:', gRes.rows);

    } catch(err) {
        console.error('❌ Migration error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
