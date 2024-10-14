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
exports.scrapeMannCenterEvents = void 0;
const playwright_1 = require("playwright");
const formatDate_1 = require("../util/formatDate");
const scrapeMannCenterEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const browser = yield playwright_1.chromium.launch();
    const page = yield browser.newPage();
    const eventsUrl = "https://manncenter.org/events";
    const venue = "mann";
    try {
        yield page.goto(eventsUrl);
        yield page.waitForSelector(".link-whole-area");
        const eventLinks = yield page.$$eval(".link-whole-area", (links) => links.map((link) => link.href));
        const events = [];
        for (const link of eventLinks) {
            yield page.goto(link);
            yield page.waitForSelector(".event-teaser");
            yield page.waitForSelector(".field--name-field-display-title");
            let title = "";
            let subtitle = "";
            let dateElement = null;
            let date = "";
            // Get title
            try {
                title = yield page.$eval(".field--name-field-display-title", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
            }
            catch (e) {
                console.error("Error retrieving event data", e);
            }
            // Get subtitle
            try {
                subtitle =
                    (_a = (yield page.$eval(".field--name-field-subtitle", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; }))) !== null && _a !== void 0 ? _a : "";
            }
            catch (e) {
                console.error("Missing subtitle for", link);
            }
            // Get dateElement
            try {
                dateElement = yield page.$(".field--name-field-event-date time");
            }
            catch (e) {
                console.error("Missing dateElement for", link);
            }
            if (dateElement) {
                const dateText = dateElement
                    ? yield dateElement.textContent()
                    : "Date not found";
                const dateTimeAttr = dateElement
                    ? yield dateElement.getAttribute("datetime")
                    : "Datetime attribute not found";
                date = (_c = (_b = (0, formatDate_1.formatDate)(dateText)) !== null && _b !== void 0 ? _b : (0, formatDate_1.formatDate)(dateTimeAttr)) !== null && _c !== void 0 ? _c : "";
            }
            // Get imageUrl
            let imageUrl = "";
            try {
                imageUrl = yield page.$eval(".field--name-field-image img", (el) => el.src);
            }
            catch (e) {
                console.error("Error retrieving image for event: ", title);
            }
            events.push({
                title,
                subtitle,
                date,
                imageUrl,
                link,
                venue,
            });
        }
        yield browser.close();
        return events;
    }
    catch (error) {
        console.error("Error scraping Mann Center events:", error);
        yield browser.close();
        return [];
    }
});
exports.scrapeMannCenterEvents = scrapeMannCenterEvents;
