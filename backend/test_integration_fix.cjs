const axios = require('axios');
const pg = require('pg');
require('dotenv').config({ path: 'c:\\projects\\GramAlert2.0\\backend\\.env' });

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const API = 'http://localhost:8080/api';
let passed = 0, failed = 0;

function check(label, condition) {
    if (condition) { console.log(`  ✅ ${label}`); passed++; }
    else { console.log(`  ❌ ${label}`); failed++; }
}

async function test() {
    const client = await pool.connect();
    try {
        // Login
        const login = async (u, t) => (await axios.post(`${API}/auth/login`, { username: u, password: 'password123', type: t })).data.token;
        const tAdmin = await login('admin@test.com', 'admin');
        const tSuper = await login('superadmin@test.com', 'superadmin');

        // === TEST 1: Alert creation (message → description mapping) ===
        console.log('=== TEST 1: Alert Schema ===');
        const alertRes = await axios.post(`${API}/alerts`, {
            title: 'Integration Test Alert',
            message: 'This was sent as message, should store as description',
            category: 'emergency',
            severity: 'high'
        }, { headers: { Authorization: `Bearer ${tAdmin}` } });
        check('Alert created successfully', alertRes.status === 201);

        const alertId = alertRes.data.alert.id;

        // Check DB directly
        const dbCheck = await client.query('SELECT title, description FROM alerts WHERE id = $1', [alertId]);
        check('DB stores as description', dbCheck.rows[0].description === 'This was sent as message, should store as description');

        // Check API response includes message field
        const alertsList = await axios.get(`${API}/alerts`, { headers: { Authorization: `Bearer ${tAdmin}` } });
        const createdAlert = alertsList.data.find(a => a.id === alertId);
        check('API response has message field', createdAlert && createdAlert.message === createdAlert.description);

        // Update with message field
        await axios.put(`${API}/alerts/${alertId}`, {
            title: 'Updated Alert',
            message: 'Updated via message field'
        }, { headers: { Authorization: `Bearer ${tAdmin}` } });
        const dbCheck2 = await client.query('SELECT description FROM alerts WHERE id = $1', [alertId]);
        check('Update with message field works', dbCheck2.rows[0].description === 'Updated via message field');

        // === TEST 2: Data Isolation (grievance list) ===
        console.log('\n=== TEST 2: Data Isolation ===');
        const tVillager1 = await login('villager@test.com', 'villager');
        const tVillager2 = await login('isolated@test.com', 'villager');
        const tAdmin2 = await login('isolatedadmin@test.com', 'admin');

        const v1Grievances = await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tVillager1}` } });
        const v2Grievances = await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tVillager2}` } });
        const a2Grievances = await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tAdmin2}` } });
        const superGrievances = await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tSuper}` } });

        check('Villager P1 sees only P1 data', !v1Grievances.data.some(g => g.panchayat_id === 2));
        check('Admin P2 sees only P2 data', !a2Grievances.data.some(g => g.panchayat_id === 1));
        check('SuperAdmin sees all', superGrievances.data.some(g => g.panchayat_id === 1) && superGrievances.data.some(g => g.panchayat_id === 2));

        // === TEST 3: DB consistency check ===
        console.log('\n=== TEST 3: DB Consistency ===');
        const alertsDb = await client.query('SELECT id, title, description FROM alerts ORDER BY id DESC LIMIT 5');
        const allHaveDescription = alertsDb.rows.every(r => r.description !== null && r.description !== undefined);
        check('All recent alerts have description stored', allHaveDescription);
        console.log('  Sample:', alertsDb.rows.map(r => ({ id: r.id, title: r.title, desc: r.description?.substring(0, 40) })));

        // Cleanup
        await client.query('DELETE FROM alerts WHERE id = $1', [alertId]);

        // === SUMMARY ===
        console.log(`\n${'='.repeat(50)}`);
        console.log(`RESULTS: ${passed} passed, ${failed} failed`);
        if (failed === 0) console.log('🎉 ALL TESTS PASSED');
        else console.log('⚠️  SOME TESTS FAILED');
        console.log('='.repeat(50));

    } catch (err) {
        console.error('❌ FATAL:', err.response ? err.response.data : err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

test();
