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
let passed = 0, failed = 0;

function check(label, condition) {
    if (condition) { console.log(`  ✅ ${label}`); passed++; }
    else { console.log(`  ❌ ${label}`); failed++; }
}

async function test() {
    const client = await pool.connect();
    const hash = await bcrypt.hash('password123', 10);

    try {
        // Ensure test users are in correct panchayats
        await client.query(`UPDATE users SET panchayat_id = 1 WHERE email = 'villager@test.com'`);
        await client.query(`UPDATE users SET panchayat_id = 2 WHERE email = 'isolated@test.com'`);
        await client.query(`UPDATE admins SET panchayat_id = 1 WHERE email = 'admin@test.com'`);
        await client.query(`UPDATE admins SET panchayat_id = 2 WHERE email = 'isolatedadmin@test.com'`);

        // Login all users
        const login = async (u, t) => (await axios.post(`${API}/auth/login`, { username: u, password: 'password123', type: t })).data.token;
        const tVillager1 = await login('villager@test.com', 'villager');
        const tVillager2 = await login('isolated@test.com', 'villager');
        const tAdmin1 = await login('admin@test.com', 'admin');
        const tAdmin2 = await login('isolatedadmin@test.com', 'admin');
        const tSuper = await login('superadmin@test.com', 'superadmin');
        console.log('All users logged in.\n');

        // Create grievances in each panchayat
        const g1 = (await axios.post(`${API}/grievances`, { title: 'Security Test P1', description: 'test', category: 'roads' }, { headers: { Authorization: `Bearer ${tVillager1}` } })).data.grievance;
        const g2 = (await axios.post(`${API}/grievances`, { title: 'Security Test P2', description: 'test', category: 'water' }, { headers: { Authorization: `Bearer ${tVillager2}` } })).data.grievance;

        // ===== SECURITY TESTS =====
        console.log('=== SECURITY: getGrievanceById ===');
        // Admin P1 should NOT see P2 grievance by ID
        try {
            await axios.get(`${API}/grievances/${g2.id}`, { headers: { Authorization: `Bearer ${tAdmin1}` } });
            check('Admin P1 blocked from P2 grievance detail', false);
        } catch (e) {
            check('Admin P1 blocked from P2 grievance detail', e.response && e.response.status === 403);
        }

        // SuperAdmin CAN see any grievance
        try {
            const r = await axios.get(`${API}/grievances/${g2.id}`, { headers: { Authorization: `Bearer ${tSuper}` } });
            check('SuperAdmin can view any grievance', r.status === 200);
        } catch (e) {
            check('SuperAdmin can view any grievance', false);
        }

        console.log('\n=== SECURITY: updateGrievance ===');
        // Villager P1 should NOT update P2 grievance
        try {
            await axios.put(`${API}/grievances/${g2.id}`, { title: 'Hacked!', description: 'hacked', category: 'roads' }, { headers: { Authorization: `Bearer ${tVillager1}` } });
            check('Villager P1 blocked from updating P2 grievance', false);
        } catch (e) {
            check('Villager P1 blocked from updating P2 grievance', e.response && e.response.status === 403);
        }

        console.log('\n=== SECURITY: deleteGrievance ===');
        // Admin P2 should NOT delete P1 grievance
        try {
            await axios.delete(`${API}/grievances/${g1.id}`, { headers: { Authorization: `Bearer ${tAdmin2}` } });
            check('Admin P2 blocked from deleting P1 grievance', false);
        } catch (e) {
            check('Admin P2 blocked from deleting P1 grievance', e.response && e.response.status === 403);
        }

        console.log('\n=== SECURITY: getGrievances list isolation ===');
        const admin1List = (await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tAdmin1}` } })).data;
        const admin2List = (await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tAdmin2}` } })).data;
        const superList = (await axios.get(`${API}/grievances`, { headers: { Authorization: `Bearer ${tSuper}` } })).data;

        check('Admin P1 sees NO P2 grievances', !admin1List.some(g => g.panchayat_id === 2));
        check('Admin P2 sees NO P1 grievances', !admin2List.some(g => g.panchayat_id === 1));
        check('SuperAdmin sees P1 + P2 data', superList.some(g => g.panchayat_id === 1) && superList.some(g => g.panchayat_id === 2));

        // ===== API TESTS =====
        console.log('\n=== API: GET /api/panchayats ===');
        const pList = (await axios.get(`${API}/panchayats`)).data;
        check('Panchayat API returns list', pList.length >= 10);
        check('Contains Kodakara', pList.some(p => p.name === 'Kodakara'));
        check('Contains Chalakudy', pList.some(p => p.name === 'Chalakudy'));

        // ===== DATA TESTS =====
        console.log('\n=== DATA: Registration with panchayat_id ===');
        // Valid panchayat
        try {
            const regRes = await axios.post(`${API}/auth/register`, {
                username: `TestReg_${Date.now()}`, email: `reg_${Date.now()}@test.com`, password: 'password123', phone: '0000000000', panchayat_id: 3
            });
            check('Registration with valid panchayat_id succeeds', regRes.status === 201);
        } catch (e) { check('Registration with valid panchayat_id succeeds', false); }

        // Invalid panchayat
        try {
            await axios.post(`${API}/auth/register`, {
                username: `TestRegBad_${Date.now()}`, email: `bad_${Date.now()}@test.com`, password: 'password123', phone: '0000000000', panchayat_id: 9999
            });
            check('Registration with invalid panchayat_id rejected', false);
        } catch (e) {
            check('Registration with invalid panchayat_id rejected', e.response && e.response.status === 400);
        }

        console.log('\n=== DATA: Admin creation validation ===');
        // Invalid panchayat on admin create
        try {
            await axios.post(`${API}/superadmin/admins`, {
                username: `BadAdmin_${Date.now()}`, email: `badmin_${Date.now()}@test.com`, password: 'password123', phone: '1111', department: 'X', division: 'Y', panchayat_id: 9999
            }, { headers: { Authorization: `Bearer ${tSuper}` } });
            check('Admin creation with invalid panchayat_id rejected', false);
        } catch (e) {
            check('Admin creation with invalid panchayat_id rejected', e.response && e.response.status === 400);
        }

        // Missing panchayat on admin create
        try {
            await axios.post(`${API}/superadmin/admins`, {
                username: `NoPAdmin_${Date.now()}`, email: `nop_${Date.now()}@test.com`, password: 'password123', phone: '1111', department: 'X', division: 'Y'
            }, { headers: { Authorization: `Bearer ${tSuper}` } });
            check('Admin creation without panchayat_id rejected', false);
        } catch (e) {
            check('Admin creation without panchayat_id rejected', e.response && e.response.status === 400);
        }

        // ===== SUMMARY =====
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
