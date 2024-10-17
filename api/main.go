package main

import (
	"database/sql"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/bcbmorabito/whats-going-on/api/internal/models"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/events", eventsHandler)
	http.HandleFunc("/update", insertEvents)

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	dir, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error getting working dir: %v", err)
	}

	indexPath := filepath.Join(dir, "templates", "index.html")
	http.ServeFile(w, r, indexPath)
}

func eventsHandler(w http.ResponseWriter, r *http.Request) {
    venue := r.FormValue("venue")
	log.Println(venue)
	dir, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error getting working dir: %v", err)
	}
	dbPath := filepath.Join(dir, "internal", "db", "events.db")
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer db.Close()

	query := `
	 SELECT date, title, subtitle, imageUrl, link, venue 
	 FROM t_events
	 WHERE venue = ?`

	rows, err := db.Query(query, venue)
	if err != nil {
		log.Fatalf("Error querying events: %v", err)
	}
	defer rows.Close()

	var events []models.EventData
	for rows.Next() {
		var event models.EventData
		err := rows.Scan(&event.Date, &event.Title, &event.Subtitle, &event.ImageUrl, &event.Link, &event.Venue)
		if err != nil {
			log.Fatalf("Error scanning row: %v", err)
		}
		events = append(events, event)
	}

	tmplDir := filepath.Join(dir, "templates")
	tmpl, err := template.ParseFiles(
		filepath.Join(tmplDir, "partials", "eventTable.html"),
	)
	if err != nil {
		log.Fatalf("Error parsing template: %v", err)
	}

	err = tmpl.ExecuteTemplate(w, tmpl.Name(), events)
	if err != nil {
		log.Fatalf("Error executing template: %v", err)
	}
}

func insertEvents(w http.ResponseWriter, r *http.Request) {
	var events []models.EventData
	log.Println(events)
	if err := json.NewDecoder(r.Body).Decode(&events); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

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

	for _, event := range events {
		_, err := db.Exec(`
            INSERT INTO t_events (date, title, subtitle, imageUrl, link, venue)
            VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(date, title, venue) DO NOTHING
        `, event.Date, event.Title, event.Subtitle, event.ImageUrl, event.Link, event.Venue)

		if err != nil {
			log.Printf("Error inserting event: %v", err)
			http.Error(w, "Error inserting event", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Events inserted successfully"))
}
