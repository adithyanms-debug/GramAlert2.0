const pg = require('pg');
const axios = require('axios');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'c:\\projects\\GramAlert2.0\\backend\\.env' });

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const API = 'http://localhost:8080/api';

async function test() {
    const client = await pool.connect();
    const hash = await bcrypt.hash('password123', 10);

    try {
        // --- SETUP: Create Panchayat 2 and isolated users ---
        console.log('--- SETUP ---');
        await client.query(`INSERT INTO panchayats (id, name, district) VALUES (2, 'Lakshmi Nagar Panchayat', 'Test District') ON CONFLICT (id) DO NOTHING`);

        await client.query(`
            INSERT INTO users (username, email, password, phone, panchayat_id)
            VALUES ('IsolatedVillager', 'isolated@test.com', $1, '9999999999', 2)
            ON CONFLICT (email) DO UPDATE SET panchayat_id = 2, password = EXCLUDED.password
        `, [hash]);

        await client.query(`
            INSERT INTO admins (username, email, password, phone, role, department, division, panchayat_id)
            VALUES ('IsolatedAdmin', 'isolatedadmin@test.com', $1, '8888888888', 'ADMIN', 'TestDept', 'TestDiv', 2)
            ON CONFLICT (email) DO UPDATE SET panchayat_id = 2, password = EXCLUDED.password
        `, [hash]);

        console.log('✅ Panchayat 2 + isolated users created.');

        // --- LOGIN ---
        console.log('\n--- AUTH ---');
        const villager1Login = await axios.post(`${API}/auth/login`, { username: 'villager@test.com', password: 'password123', type: 'villager' });
        const t1 = villager1Login.data.token;
        console.log('✅ Villager (P1) logged in');

        const villager2Login = await axios.post(`${API}/auth/login`, { username: 'isolated@test.com', password: 'password123', type: 'villager' });
        const t2 = villager2Login.data.token;
        console.log('✅ Villager (P2) logged in');

        const admin1Login = await axios.post(`${API}/auth/login`, { username: 'admin@test.com', password: 'password123', type: 'admin' });
        const tAdmin1 = admin1Login.data.token;
        console.log('✅ Admin (P1) logged in');

        const admin2Login = await axios.post(`${API}/auth/login`, { username: 'isolatedadmin@test.com', password: 'password123', type: 'admin' });
        const tAdmin2 = admin2Login.data.token;
        console.log('✅ Admin (P2) logged in');

        const superLogin = await axios.post(`${API}/auth/login`, { username: 'superadmin@test.com', password: 'password123', type: 'superadmin' });
        const tSuper = superLogin.data.token;
        console.log('✅ SuperAdmin logged in');

        // --- GRIEVANCE CREATION ---
        console.log('\n--- GRIEVANCE CREATION ---');
        const g1 = await axios.post(`${API}/grievances`, {
            title: 'Panchayat 1 Grievance', description: 'Test in P1', category: 'roads'
        }, { headers: { Authorization: `Bearer ${t1}` } });
        console.log(`✅ P1 grievance created (ID: ${g1.data.grievance.id}, panchayat_id: ${g1.data.grievance.panchayat_id})`);

        const g2 = await axios.post(`${API}/grievances`, {
            title: 'Panchayat 2 Grievance', description: 'Test in P2', category: 'water'
        }, { headers: { Authorization: `Bearer ${t2}` } });
        console.log(`✅ P2 grievance created (ID: ${g2.data.grievance.id}, panchayat_id: ${g2.data.grievance.panchayat_id})`);

        // --- ISOLATION TEST ---
        console.log('\n--- ISOLATION TEST ---');

        // Admin P1 should NOT see P2 grievances
        const admin1View = await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tAdmin1}` } });
        const admin1SeesP2 = admin1View.data.some(g => g.panchayat_id === 2);
        console.log(`Admin (P1) sees ${admin1View.data.length} grievances. Sees P2 data? ${admin1SeesP2 ? '❌ FAIL' : '✅ NO (PASS)'}`);

        // Admin P2 should NOT see P1 grievances
        const admin2View = await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tAdmin2}` } });
        const admin2SeesP1 = admin2View.data.some(g => g.panchayat_id === 1);
        console.log(`Admin (P2) sees ${admin2View.data.length} grievances. Sees P1 data? ${admin2SeesP1 ? '❌ FAIL' : '✅ NO (PASS)'}`);

        // SuperAdmin should see ALL
        const superView = await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tSuper}` } });
        const superSeesP1 = superView.data.some(g => g.panchayat_id === 1);
        const superSeesP2 = superView.data.some(g => g.panchayat_id === 2);
        console.log(`SuperAdmin sees ${superView.data.length} grievances. P1: ${superSeesP1 ? '✅' : '❌'}, P2: ${superSeesP2 ? '✅' : '❌'}`);

        // --- FINAL ---
        if (!admin1SeesP2 && !admin2SeesP1 && superSeesP1 && superSeesP2) {
            console.log('\n🎉 ALL PANCHAYAT ISOLATION TESTS PASSED\n');
        } else {
            console.log('\n❌ SOME TESTS FAILED\n');
        }

    } catch (err) {
        console.error('❌ ERROR:', err.response ? err.response.data : err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

test();
