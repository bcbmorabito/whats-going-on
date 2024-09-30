import { chromium } from "playwright";
import { EventData } from "../types";
import { formatDate } from "../util/formatDate";

export const scrapeMannCenterEvents = async (): Promise<EventData[]> => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const eventsUrl = "https://manncenter.org/events";

  try {
    await page.goto(eventsUrl);
    await page.waitForSelector(".link-whole-area");

    const eventLinks = await page.$$eval(
      ".link-whole-area",
      (links: HTMLAnchorElement[]) =>
        links.map((link: HTMLAnchorElement) => link.href)
    );

    const events: EventData[] = [];

    for (const link of eventLinks) {
      await page.goto(link);
      await page.waitForSelector(".event-teaser");
      await page.waitForSelector(".field--name-field-display-title");

      let title: string = "";
      let subtitle: string = "";
      let date: string = "";
      try {
        title = await page.$eval(
          ".field--name-field-display-title",
          (el) => el.textContent?.trim() || ""
        );
        try {
            subtitle = await page.$eval(
              ".field--name-field-subtitle",
              (el) => el.textContent?.trim() || ""
            ) ?? "";
        } catch (e) {
            console.error("Missing subtitle for", link);
        }
        const dateElement = await page.$(".field--name-field-event-date time");
        const dateText = dateElement
          ? await dateElement.textContent()
          : "Date not found";

        const dateTimeAttr = dateElement
          ? await dateElement.getAttribute("datetime")
          : "Datetime attribute not found";

        date = formatDate(dateText) ?? formatDate(dateTimeAttr) ?? "";
      } catch (e) {
        console.error("Error retrieving event data", e);
      }

      let imageUrl = "";
      try {
        imageUrl = await page.$eval(
          ".field--name-field-image img",
          (el) => (el as HTMLImageElement).src
        );
      } catch (e) {
        console.error("Error retrieving image for event: ", title);
      }

      events.push({
        title,
        subtitle,
        date,
        imageUrl,
        link,
      });
    }

    await browser.close();
    return events;
  } catch (error) {
    console.error("Error scraping Mann Center events:", error);
    await browser.close();
    return [];
  }
};
