import { EventData } from "../types";

/**
 * Formats a date string to "DD Month" format.
 * @param dateString - The input date string to format.
 * @returns The formatted date string or an empty string if the input is invalid.
 */
export function formatDate(dateString: string | undefined | null): string {
    if (dateString === undefined || dateString === null) return ''
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');

    const date = new Date(cleanDateString);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }
    const currentYear = new Date().getFullYear();
    if (date.getFullYear() < currentYear) date.setFullYear(currentYear)

    console.log(date, dateString)

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

export function sortEventsByDate(events: EventData[]): EventData[] {
    const cleanEvents: any = events.map((e: EventData) => {
        if (!e.date) e.date = '2099-12-31'
        return e
    })
    return cleanEvents.sort(( a: any, b: any ) => {
        const dateA = new Date(a.date); 
        const dateB = new Date(b.date);

        return dateA.getTime() - dateB.getTime(); 
    });
}

