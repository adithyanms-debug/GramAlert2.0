import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: 'c:/Users/GramAlert2.0/backend/.env' });

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkAdmins() {
    try {
        await client.connect();
        const res = await client.query('SELECT id, username, email, password, role FROM admins;');
        console.log('Admins Table Contents:');
        console.log(JSON.stringify(res.rows, null, 2));

        // Also check super_admins just in case
        const res2 = await client.query('SELECT id, username, email FROM super_admins;');
        console.log('\nSuper Admins Table Contents:');
        console.log(JSON.stringify(res2.rows, null, 2));

        await client.end();
    } catch (err) {
        console.error('Error executing query', err.stack);
        process.exit(1);
    }
}

checkAdmins();
