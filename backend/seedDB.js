import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDB = async () => {
    try {
        console.log('Reading schema.sql...');
        const schemaQuery = fs.readFileSync(path.join(__dirname, 'src', 'db', 'schema.sql'), 'utf-8');

        console.log('Executing schema...');
        await query(schemaQuery);

        // Run migrations
        const migrationsDir = path.join(__dirname, 'src', 'db', 'migrations');
        if (fs.existsSync(migrationsDir)) {
            const migrationFiles = fs.readdirSync(migrationsDir)
                .filter(f => f.endsWith('.sql'))
                .sort();

            for (const file of migrationFiles) {
                console.log(`Running migration: ${file}...`);
                const migrationQuery = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
                await query(migrationQuery);
            }
        }

        console.log('Reading seed.sql...');
        const seedQuery = fs.readFileSync(path.join(__dirname, 'src', 'db', 'seed.sql'), 'utf-8');

        console.log('Executing seed...');
        await query(seedQuery);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
};

setupDB();

