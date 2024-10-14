"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database("./db/events.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    }
    else {
        console.log("Connected to the SQLite database.");
    }
});
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "index.html"));
});
app.post("/mutate", (req, res) => {
    const eventDataArray = req.body ?? [];
    if (!req.body.length) {
        try {
            const insertStmt = db.prepare(`
        INSERT INTO t_events (date, title, subtitle, imageUrl, link, venue)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
            db.serialize(() => {
                eventDataArray.forEach(event => {
                    insertStmt.run(event.date, event.title, event.subtitle || null, event.imageUrl || null, event.link || null, event.venue);
                });
            });
            insertStmt.finalize();
            res.status(200).json({ message: 'EventData successfully inserted' });
        }
        catch (e) {
            res.status(500).json({ message: `Failed to insert event data | ${e}` });
        }
    }
});
app.post("/events", async (req, res) => {
    const { site } = req.body;
    let events = [];
    if (!site)
        res.status(400).send("No site provided");
    try {
        events = await getEvents(site);
        res.render("partials/eventTable", { events });
    }
    catch (error) {
        console.error("Error scraping events:", error);
        res.status(500).send("Error scraping events");
    }
});
var ValidSites;
(function (ValidSites) {
    ValidSites["all"] = "all";
    ValidSites["met"] = "met";
    ValidSites["mann"] = "mann";
})(ValidSites || (ValidSites = {}));
const getEvents = (site) => {
    let queryString;
    if (site in ValidSites)
        throw new Error('Invalid site');
    if (site === "all") {
        queryString = 'SELECT * FROM t_events';
    }
    else {
        queryString = 'SELECT * FROM t_events WHERE venue = site';
    }
    return new Promise((resolve, reject) => {
        try {
            const query = db.prepare(queryString);
            query.all([site], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
