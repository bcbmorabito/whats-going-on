"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.sortEventsByDate = sortEventsByDate;
/**
 * Formats a date string to "DD Month" format.
 * @param dateString - The input date string to format.
 * @returns The formatted date string or an empty string if the input is invalid.
 */
function formatDate(dateString) {
    if (dateString === undefined || dateString === null)
        return '';
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');
    const date = new Date(cleanDateString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }
    console.log(date, dateString);
    const options = { month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}
function sortEventsByDate(events) {
    const cleanEvents = events.map((e) => {
        if (!e.date)
            e.date = '2099-12-31';
        return e;
    });
    return cleanEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
    });
}
