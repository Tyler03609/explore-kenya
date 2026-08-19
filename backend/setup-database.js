require("dotenv").config();

const pool = require("./db");

async function setupDatabase() {

    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (

                id SERIAL PRIMARY KEY,

                name TEXT NOT NULL,

                email TEXT NOT NULL,

                phone TEXT NOT NULL,

                tour TEXT NOT NULL,

                people INTEGER NOT NULL,

                date TEXT NOT NULL,

                message TEXT,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            )
        `);

        console.log("Bookings table created successfully!");

    } catch (error) {

        console.error(
            "Database setup failed:",
            error
        );

    } finally {

        await pool.end();

    }
}

setupDatabase();