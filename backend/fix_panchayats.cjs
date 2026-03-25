const pg = require('pg');
require('dotenv').config({ path: 'c:\\projects\\GramAlert2.0\\backend\\.env' });

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function fix() {
    const client = await pool.connect();
    try {
        // Insert Kodakara and Chalakudy which were skipped due to serial ID conflict
        await client.query(`
            INSERT INTO panchayats (name, district) VALUES
                ('Kodakara', 'Thrissur'),
                ('Chalakudy', 'Thrissur')
        `);
        const res = await client.query('SELECT id, name, district FROM panchayats ORDER BY id');
        console.log('All panchayats:', res.rows);
    } catch(err) {
        console.error('Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}
fix();
