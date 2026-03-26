import pkg from "pg";
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not defined.');
    console.error('Please ensure you have set it in your .env file or terminal.');
    process.exit(1);
}

const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
