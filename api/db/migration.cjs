const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database('./events.db', sqlite3.OPEN_READWRITE, (err) => {
    return console.error
})

const createTable = `CREATE TABLE IF NOT EXISTS t_events (
    date TEXT,
    title TEXT,
    subtitle TEXT,
    imageUrl TEXT,
    link TEXT,
    venue TEXT,
    PRIMARY KEY (date, title, venue)
  )`;

  db.run(createTable, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table created or already exists.");
    }
  });
  
  db.close();