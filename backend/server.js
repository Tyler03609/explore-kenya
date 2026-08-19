require("dotenv").config();

const session = require("express-session");
const bcrypt = require("bcryptjs");

const express = require("express");
const path = require("path");

const pool = require("./db");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET || "explore-kenya-secret",
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        }
    })
);

const ADMIN_USERNAME =
    process.env.ADMIN_USERNAME;

const ADMIN_PASSWORD_HASH =
    process.env.ADMIN_PASSWORD_HASH;
app.post("/api/admin/login", async (req, res) => {

    const {
        username,
        password
    } = req.body;


    if (username !== ADMIN_USERNAME) {

        return res.status(401).json({
            success: false,
            message: "Invalid username or password."
        });

    }


    const passwordCorrect =
        await bcrypt.compare(
            password,
            ADMIN_PASSWORD_HASH
        );


    if (!passwordCorrect) {

        return res.status(401).json({
            success: false,
            message: "Invalid username or password."
        });

    }


    req.session.isAdmin = true;


    res.json({
        success: true,
        message: "Login successful."
    });

});

function requireAdmin(req, res, next) {

    if (!req.session.isAdmin) {

        return res.redirect("/admin-login.html");

    }

    next();

}


app.get("/admin.html", requireAdmin, (req, res) => {

    res.sendFile(
        path.join(__dirname, "..", "admin.html")
    );

});

// Serve the website
app.use(express.static(path.join(__dirname, "..")));


app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );

});


app.get("/api/tours", (req, res) => {

    const tours = [

        {
            id: 1,
            name: "3-Day Maasai Mara Safari",
            location: "Maasai Mara",
            price: 35000
        },

        {
            id: 2,
            name: "4-Day Diani Beach Escape",
            location: "Diani Beach",
            price: 40000
        },

        {
            id: 3,
            name: "5-Day Mount Kenya Adventure",
            location: "Mount Kenya",
            price: 55000
        },

        {
            id: 4,
            name: "Nairobi Wildlife Experience",
            location: "Nairobi",
            price: 12000
        }

    ];

    res.json(tours);

});


app.post("/api/bookings", async (req, res) => {

    const {
        name,
        email,
        phone,
        tour,
        people,
        date,
        message
    } = req.body;


    if (
        !name ||
        !email ||
        !phone ||
        !tour ||
        !people ||
        !date
    ) {

        return res.status(400).json({
            success: false,
            message: "Please complete all required fields."
        });

    }


   const result = await pool.query(
    `
    INSERT INTO bookings
    (name, email, phone, tour, people, date, message)

    VALUES
    ($1, $2, $3, $4, $5, $6, $7)

    RETURNING id
    `,
    [
        name,
        email,
        phone,
        tour,
        Number(people),
        date,
        message || ""
    ]
);


    console.log("New booking saved:", result.rows[0].id);


    res.json({

        success: true,

        message: "Booking saved successfully!",

        bookingId: result.rows[0].id

    });

});

app.get("/api/bookings", async (req, res) => {
    if (!req.session.isAdmin) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

    }


    const result = await pool.query(`
    SELECT *
    FROM bookings
    ORDER BY id DESC
`);

const bookings = result.rows;

res.json(bookings);

});

app.delete("/api/bookings/:id", async (req, res) => {
    if (!req.session.isAdmin) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized."
        });

    }


    const id =
        Number(req.params.id);


    const result = await pool.query(
    `
    DELETE FROM bookings
    WHERE id = $1
    `,
    [Number(req.params.id)]
);


    if (result.changes === 0) {

        return res.status(404).json({
            success: false,
            message: "Booking not found."
        });

    }


    res.json({

        success: true,

        message: "Booking deleted successfully."

    });

});

app.post("/api/admin/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            return res.status(500).json({
                success: false,
                message: "Logout failed."
            });

        }


        res.json({
            success: true,
            message: "Logged out successfully."
        });

    });

});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(
        path.join(__dirname, "..", "404.html")
    );
});


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});