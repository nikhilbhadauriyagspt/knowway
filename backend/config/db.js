import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "knowway_db";
const DB_PORT = Number(process.env.DB_PORT) || 3306;

// Create connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to automatically create DB & tables if they don't exist
export const initDB = async () => {
  try {
    // 1. Connect to MySQL Server (without selecting database first)
    const serverConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    // 2. Auto-create database if not exists
    await serverConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await serverConnection.end();

    // 3. Connect via pool and auto-create tables
    const connection = await pool.getConnection();
    console.log(`✅ MySQL Connected Successfully: Database '${DB_NAME}' is ready!`);

    // Users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        address TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        referral_code VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createUsersTableQuery);
    console.log("✅ MySQL 'users' table is ready.");

    // Admins table for Super Admin
    const createAdminsTableQuery = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'superadmin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createAdminsTableQuery);
    console.log("✅ MySQL 'admins' table is ready.");

    // Seed default Super Admin account if not present
    const [existingAdmins] = await connection.query("SELECT id FROM admins WHERE email = ? LIMIT 1", [
      "admin@knowway.com",
    ]);

    if (!existingAdmins || existingAdmins.length === 0) {
      const defaultPasswordHash = await bcrypt.hash("Admin@123", 10);
      await connection.query(
        "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Super Admin", "admin@knowway.com", defaultPasswordHash, "superadmin"]
      );
      console.log("👑 Default Super Admin seeded: admin@knowway.com / Admin@123");
    }

    connection.release();
  } catch (err) {
    console.warn("⚠️ MySQL Warning:", err.message);
    console.warn("💡 Note: Please ensure MySQL is started in XAMPP on port", DB_PORT);
  }
};

export default pool;
