const Database = require("better-sqlite3");

const db = new Database("explore-kenya.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS bookings (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        email TEXT NOT NULL,

        phone TEXT NOT NULL,

        tour TEXT NOT NULL,

        people INTEGER NOT NULL,

        date TEXT NOT NULL,

        message TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )
`).run();

console.log("Database connected!");

module.exports = db;