package main

import (
    "database/sql"
    "log"
    "os"
    "path/filepath"

    _ "github.com/mattn/go-sqlite3" 
)

func main() {
    dir, err := os.Getwd()
    if err != nil {
        log.Fatalf("Error getting working directory: %v", err)
    }

    dbPath := filepath.Join(dir, "internal", "db", "events.db")

    db, err := sql.Open("sqlite3", dbPath)
    if err != nil {
        log.Fatalf("Error opening database: %v", err)
    }
    defer db.Close()

    query := `
    CREATE TABLE IF NOT EXISTS t_events (
        date TEXT,
        title TEXT,
        subtitle TEXT,
        imageUrl TEXT,
        link TEXT,
        venue TEXT,
        PRIMARY KEY (date, title, venue)
    );
    `
    _, err = db.Exec(query)
    if err != nil {
        log.Fatalf("Error running migration: %v", err)
    }

    log.Println("Migration complete: CREATE TABLE IF NOT EXISTS t_events")
}
