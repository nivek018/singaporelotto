import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local or .env
// const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');
//dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath }); // Will not overwrite existing keys from .env.local

async function initDb() {
  console.log('Initializing database...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Database: ${process.env.DB_NAME}`);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.query(`USE \`${process.env.DB_NAME}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('4D', 'Toto', 'Sweep') NOT NULL,
        draw_date DATE NOT NULL,
        draw_number VARCHAR(50) NOT NULL,
        data JSON NOT NULL,
        source ENUM('scrape', 'manual') DEFAULT 'scrape',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_draw (type, draw_number)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        game_type ENUM('4D', 'Toto', 'Sweep') NOT NULL UNIQUE,
        draw_days VARCHAR(255) NOT NULL,
        draw_time VARCHAR(50) NOT NULL,
        description TEXT,
        sales_close_time VARCHAR(50),
        special_rule VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add special_rule column if it doesn't exist (for existing databases)
    try {
      await connection.query(`ALTER TABLE schedules ADD COLUMN special_rule VARCHAR(100) AFTER sales_close_time`);
      console.log('Added special_rule column to schedules table');
    } catch (err) {
      // Column may already exist, ignore error
      if (err.code !== 'ER_DUP_FIELDNAME') {
        console.log('special_rule column already exists or other error:', err.code);
      }
    }

    // Insert default schedule data
    await connection.query(`
      INSERT INTO schedules (game_type, draw_days, draw_time, description, sales_close_time, special_rule) VALUES
      ('4D', 'Wednesday, Saturday, Sunday', '6:30 PM SGT', 'Singapore 4D is a lottery game where players select a 4-digit number from 0000 to 9999. Win prizes by matching your number with the winning numbers drawn.', '6:00 PM SGT', NULL),
      ('Toto', 'Monday, Thursday', '9:30 PM SGT', 'TOTO is a legalized lottery game in Singapore. Pick 6 numbers from 1 to 49 and win by matching as many numbers as possible with the winning numbers drawn.', '9:00 PM SGT', NULL),
      ('Sweep', 'Wednesday', '6:30 PM SGT', 'Singapore Sweep is a lottery game where 7-digit tickets are drawn for cash prizes. Unlike other games, tickets are pre-printed with numbers.', '6:00 PM SGT', 'first_wednesday_of_month')
      ON DUPLICATE KEY UPDATE 
        draw_days = VALUES(draw_days),
        draw_time = VALUES(draw_time),
        description = VALUES(description),
        sales_close_time = VALUES(sales_close_time),
        special_rule = VALUES(special_rule)
    `);

    console.log('✅ Database and tables initialized successfully.');
    await connection.end();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDb();
