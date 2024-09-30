import express, { Request, Response } from "express";
import { scrapeTheMetPhillyEvents } from "../handlers/metScraper";
import { EventData } from "../types";
import { scrapeMannCenterEvents } from "../handlers/mannScraper";
import { sortEventsByDate } from "../util/formatDate";

const router = express.Router();

router.post("/scrape", async (req: Request, res: Response) => {
  const { site } = req.body;
  let events: EventData[] = [];

  try {
    switch (site) {
      case "all":
        events = await scrapeAllVenues();
        break;
      case "met":
        events = await scrapeTheMetPhillyEvents();
        break;
      case "mann":
        events = await scrapeMannCenterEvents();
        break;
      default:
        events = [];
    }

    res.render("partials/eventTable", { events });
  } catch (error) {
    console.error("Error scraping events:", error);
    res.status(500).send("Error scraping events");
  }
});

const scrapeAllVenues = async (): Promise<EventData[]> => {
  const metEvents: EventData[] = await scrapeTheMetPhillyEvents();
  const mannEvents: EventData[] = await scrapeMannCenterEvents();
  return sortEventsByDate([...metEvents, ...mannEvents]);
};

export default router;
