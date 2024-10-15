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
exports.handler = void 0;
const axios_1 = __importDefault(require("axios"));
const mannScraper_1 = require("./handlers/mannScraper");
const metScraper_1 = require("./handlers/metScraper");
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    yield load();
});
exports.handler = handler;
const apiUrl = 'http://100.24.52.180/update';
const load = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.post(apiUrl, [
            ...yield (0, metScraper_1.scrapeTheMetPhillyEvents)(),
            ...yield (0, mannScraper_1.scrapeMannCenterEvents)()
        ], {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Success: %s | %s | %v', res.status, res.statusText);
        return true;
    }
    catch (e) {
        console.error('Failure: ', e);
        return false;
    }
});
