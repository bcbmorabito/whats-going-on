"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeTheMetPhillyEvents = void 0;
const playwright_1 = require("playwright");
const formatDate_1 = require("../util/formatDate");
const initializeBrowser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield playwright_1.chromium.launch({ headless: true });
    }
    catch (error) {
        console.error("Error initializing browser:", error);
        throw error;
    }
});
const navigateToEventsPage = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield page.goto("https://themetphilly.com/events");
        yield page.waitForSelector(".event-link-container");
    }
    catch (error) {
        console.error("Error navigating to events page:", error);
        throw error;
    }
});
const scrapeEvents = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield page.goto("https://themetphilly.com/events", {
            waitUntil: "networkidle",
        });
        yield page.waitForSelector(".event-link-container");
        const eventContainers = yield page.$$(".event-link-container");
        const events = yield Promise.all(eventContainers.map((container) => __awaiter(void 0, void 0, void 0, function* () {
            const linkElement = yield container.$("a");
            const link = (yield (linkElement === null || linkElement === void 0 ? void 0 : linkElement.getAttribute("href"))) || "";
            const imageElement = yield container.$("img.event-list-image");
            const imageUrl = (yield (imageElement === null || imageElement === void 0 ? void 0 : imageElement.getAttribute("src"))) || "";
            const dateElement = yield container.$("h3");
            const date = (0, formatDate_1.formatDate)(yield (dateElement === null || dateElement === void 0 ? void 0 : dateElement.innerText())) || "";
            const titleElement = yield container.$("h1");
            const title = (yield (titleElement === null || titleElement === void 0 ? void 0 : titleElement.innerText())) || "";
            const subtitleElement = yield container.$("h2");
            const subtitle = (yield (subtitleElement === null || subtitleElement === void 0 ? void 0 : subtitleElement.innerText())) || "";
            return {
                date,
                title,
                subtitle,
                imageUrl,
                link,
            };
        })));
        return events;
    }
    catch (error) {
        console.error("Error scraping events:", error);
        throw error;
    }
});
const scrapeTheMetPhillyEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    let browser;
    let events = [];
    try {
        browser = yield initializeBrowser();
        const page = yield browser.newPage();
        yield navigateToEventsPage(page);
        events = yield scrapeEvents(page);
        console.log("Scraped Events:", events);
    }
    catch (error) {
        console.error("Failed to scrape events:", error);
    }
    finally {
        if (browser) {
            yield browser.close();
        }
    }
    return events;
});
exports.scrapeTheMetPhillyEvents = scrapeTheMetPhillyEvents;
