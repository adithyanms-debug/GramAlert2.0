import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function testEscalation() {
    const client = await pool.connect();
    try {
        // Step 1: Insert test grievances with past deadlines
        console.log('📝 Inserting test grievances with backdated deadlines...\n');

        // Grievance 1: 10 days old → should trigger all 3 levels
        await client.query(`
      INSERT INTO grievances (title, description, category, priority, user_id, created_at, deadline, is_overdue)
      VALUES ('Broken water pipe on Main Road', 'Water pipe has been leaking for over a week near the main junction.', 'water', 'High', 1, 
              NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days', FALSE)
    `);

        // Grievance 2: 5 days old → should trigger Level 1 + 2
        await client.query(`
      INSERT INTO grievances (title, description, category, priority, user_id, created_at, deadline, is_overdue)
      VALUES ('Street lights not working in Ward 3', 'All street lights in ward 3 have been off for 5 days.', 'electricity', 'Medium', 1,
              NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', FALSE)
    `);

        // Grievance 3: 1 day old → should trigger Level 1 only
        await client.query(`
      INSERT INTO grievances (title, description, category, priority, user_id, created_at, deadline, is_overdue)
      VALUES ('Garbage not collected in Block B', 'No garbage collection for the past 2 days.', 'sanitation', 'Low', 1,
              NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', FALSE)
    `);

        console.log('✅ 3 test grievances inserted.\n');

        // Step 2: Run escalation procedure
        console.log('🚀 Running escalation procedure...\n');
        await client.query('CALL escalate_overdue_grievances()');

        // Step 3: Show results
        const { rows: escalations } = await client.query(`
      SELECT e.id, e.grievance_id, e.escalation_level, e.escalated_to, e.reason,
             g.title as grievance_title
      FROM escalations e
      JOIN grievances g ON e.grievance_id = g.id
      ORDER BY e.grievance_id, e.escalation_level
    `);

        console.log('='.repeat(70));
        console.log('📊 ESCALATION RESULTS:');
        console.log('='.repeat(70));

        for (const esc of escalations) {
            const emoji = esc.escalation_level === 1 ? '⚠️' : esc.escalation_level === 2 ? '🔶' : '🔴';
            console.log(`\n${emoji} Level ${esc.escalation_level} | GRV-${esc.grievance_id}: "${esc.grievance_title}"`);
            console.log(`   → ${esc.escalated_to}`);
            console.log(`   ${esc.reason}`);
        }

        console.log(`\n${'='.repeat(70)}`);
        console.log(`✅ Total: ${escalations.length} escalation(s) created across 3 grievances.`);
        console.log('\n👉 Now open your app in the browser to verify:');
        console.log('   1. Login as admin → Dashboard shows toast + "Escalated" card');
        console.log('   2. Admin → Grievances → L1/L2/L3 badges on rows');
        console.log('   3. Login as villager → My Grievances → "Escalated to..." banners');
        console.log('   4. Click a grievance detail → Escalation History timeline\n');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

testEscalation();
