"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
/**
 * Formats a date string to "DD Month" format.
 * @param dateString - The input date string to format.
 * @returns The formatted date string or an empty string if the input is invalid.
 */
function formatDate(dateString) {
    if (dateString === undefined || dateString === null)
        return '';
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return '';
    }
    const options = { day: '2-digit', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}
