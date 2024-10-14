import { chromium } from "playwright";
import { formatDate } from "../util/formatDate";
const initializeBrowser = async () => {
    try {
        return await chromium.launch({ headless: true });
    }
    catch (error) {
        console.error("Error initializing browser:", error);
        throw error;
    }
};
const navigateToEventsPage = async (page) => {
    try {
        await page.goto("https://themetphilly.com/events");
        await page.waitForSelector(".event-link-container");
    }
    catch (error) {
        console.error("Error navigating to events page:", error);
        throw error;
    }
};
const scrapeEvents = async (page) => {
    try {
        await page.goto("https://themetphilly.com/events", {
            waitUntil: "networkidle",
        });
        await page.waitForSelector(".event-link-container");
        const eventContainers = await page.$$(".event-link-container");
        const events = await Promise.all(eventContainers.map(async (container) => {
            const linkElement = await container.$("a");
            const link = (await linkElement?.getAttribute("href")) || "";
            const imageElement = await container.$("img.event-list-image");
            const imageUrl = (await imageElement?.getAttribute("src")) || "";
            const dateElement = await container.$("h3");
            const date = formatDate(await dateElement?.innerText()) || "";
            const titleElement = await container.$("h1");
            const title = (await titleElement?.innerText()) || "";
            const subtitleElement = await container.$("h2");
            const subtitle = (await subtitleElement?.innerText()) || "";
            return {
                date,
                title,
                subtitle,
                imageUrl,
                link,
            };
        }));
        return events;
    }
    catch (error) {
        console.error("Error scraping events:", error);
        throw error;
    }
};
export const scrapeTheMetPhillyEvents = async () => {
    let browser;
    let events = [];
    try {
        browser = await initializeBrowser();
        const page = await browser.newPage();
        await navigateToEventsPage(page);
        events = await scrapeEvents(page);
        console.log("Scraped Events:", events);
    }
    catch (error) {
        console.error("Failed to scrape events:", error);
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
    return events;
};
