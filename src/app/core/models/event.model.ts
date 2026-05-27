export interface CalendarEvent {
  id:          string;
  title:       string;
  description: string;
  date:        Date;
  startTime:   string;
  endTime:     string;
  color:       string;
  allDay:      boolean;
  createdAt:   Date;
}