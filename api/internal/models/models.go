package models

type EventData struct {
    Date     string `json:"date"`
    Title    string `json:"title"`
    Subtitle string `json:"subtitle,omitempty"`
    ImageUrl string `json:"imageUrl,omitempty"`
    Link     string `json:"link,omitempty"`
    Venue    string `json:"venue"`
}
