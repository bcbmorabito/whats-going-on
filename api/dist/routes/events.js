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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const metScraper_1 = require("../handlers/metScraper");
const mannScraper_1 = require("../handlers/mannScraper");
const formatDate_1 = require("../util/formatDate");
const router = express_1.default.Router();
router.post("/scrape", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { site } = req.body;
    let events = [];
    try {
        switch (site) {
            case "all":
                events = yield scrapeAllVenues();
                break;
            case "met":
                events = yield (0, metScraper_1.scrapeTheMetPhillyEvents)();
                break;
            case "mann":
                events = yield (0, mannScraper_1.scrapeMannCenterEvents)();
                break;
            default:
                events = [];
        }
        res.render("partials/eventTable", { events });
    }
    catch (error) {
        console.error("Error scraping events:", error);
        res.status(500).send("Error scraping events");
    }
}));
const scrapeAllVenues = () => __awaiter(void 0, void 0, void 0, function* () {
    const metEvents = yield (0, metScraper_1.scrapeTheMetPhillyEvents)();
    const mannEvents = yield (0, mannScraper_1.scrapeMannCenterEvents)();
    return (0, formatDate_1.sortEventsByDate)([...metEvents, ...mannEvents]);
});
exports.default = router;
