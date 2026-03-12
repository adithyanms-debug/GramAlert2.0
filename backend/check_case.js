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

async function checkCase() {
    try {
        await client.connect();
        // Try lowercase email
        const res1 = await client.query('SELECT id FROM admins WHERE LOWER(email) = LOWER($1)', ['testadmin@example.com']);
        console.log('Match with LOWER(email):', res1.rows.length > 0);

        // Try direct match with capitalized first letter
        const res2 = await client.query('SELECT id FROM admins WHERE email = $1', ['Testadmin@example.com']);
        console.log('Match with capitalized email (Direct):', res2.rows.length > 0);

        await client.end();
    } catch (err) {
        console.error('Error', err.stack);
        process.exit(1);
    }
}

checkCase();
