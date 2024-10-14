import axios, { AxiosResponse } from "axios"
import { scrapeMannCenterEvents } from "./handlers/mannScraper"
import { scrapeTheMetPhillyEvents } from "./handlers/metScraper"

export const handler = async () => {
    await load()
  }

const apiUrl: string = 'http://100.24.52.180/mutate'

const load = async (): Promise<boolean> => {
    try {
        const res: AxiosResponse<any, any> = await axios.post(apiUrl, [
            ...await scrapeTheMetPhillyEvents(),
            ...await scrapeMannCenterEvents()
        ], {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('Success: %s | %s | %v', res.status, res.statusText)
        return true
    } catch (e) {
        console.error('Failure: ', e)
        return false
    }
}

