import express, { Request, Response } from "express"
import path from "path"
import { EventData } from "./types"
import sqlite3 from "sqlite3"

const db = new sqlite3.Database("./db/events.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message)
  } else {
    console.log("Connected to the SQLite database.")
  }
})


const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.post("/mutate", (req: Request, res: Response) => {
  const eventDataArray: EventData[] = req.body ?? []
  
  if (!req.body.length) {    
    try {
      const insertStmt = db.prepare(`
        INSERT INTO t_events (date, title, subtitle, imageUrl, link, venue)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      
      db.serialize(() => {
        eventDataArray.forEach(event => {
          insertStmt.run(
            event.date,
            event.title,
            event.subtitle || null,
            event.imageUrl || null,
            event.link || null,
            event.venue
          )
        })
      })
      insertStmt.finalize()
      res.status(200).json({ message: 'EventData successfully inserted' })
    } catch (e) {
      res.status(500).json({ message: `Failed to insert event data | ${e}` })
    }
  }
    
})

app.post("/events", async (req: Request, res: Response) => {
  const { site } = req.body
  let events: EventData[] = []
  if (!site) res.status(400).send("No site provided")
  try {
      events = await getEvents(site)
      res.render("partials/eventTable", { events })
  } catch (error) {
    console.error("Error scraping events:", error)
    res.status(500).send("Error scraping events")
  }
})

enum ValidSites {
  "all" = "all",
  "met" = "met",
  "mann" = "mann"
}

const getEvents = (site: string): Promise<any[]> => {
  let queryString
  if (site !in ValidSites) throw new Error('Invalid site')
  if (site === "all") {
    queryString = 'SELECT * FROM t_events'
  } else {
    queryString = 'SELECT * FROM t_events WHERE venue = site'
  }
  return new Promise((resolve, reject) => {
    try {
      const query = db.prepare(queryString)
      query.all([site], (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
