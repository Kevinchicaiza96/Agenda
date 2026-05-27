import { Injectable, signal, computed, inject } from '@angular/core';
import { CalendarEvent } from '../models/event.model';
import { StorageService } from './storage';

const STORAGE_KEY = 'agendia_events';

@Injectable({ providedIn: 'root' })
export class EventService {

  private storage = inject(StorageService);

  private _events = signal<CalendarEvent[]>([]);

  readonly events      = this._events.asReadonly();
  readonly todayEvents = computed(() => {
    const today = new Date().toDateString();
    return this._events().filter(e =>
      new Date(e.date).toDateString() === today
    );
  });

  constructor() {
    this._events.set(this.loadFromStorage());
  }

  add(data: Omit<CalendarEvent, 'id' | 'createdAt'>): CalendarEvent {
    const event: CalendarEvent = {
      ...data,
      id:        crypto.randomUUID(),
      createdAt: new Date(),
    };
    this._events.update(events => [...events, event]);
    this.persist();
    return event;
  }

  update(id: string, changes: Partial<CalendarEvent>): void {
    this._events.update(events =>
      events.map(e => e.id === id ? { ...e, ...changes } : e)
    );
    this.persist();
  }

  delete(id: string): void {
    this._events.update(events => events.filter(e => e.id !== id));
    this.persist();
  }

  getByMonth(year: number, month: number): CalendarEvent[] {
    return this._events().filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._events());
  }

  private loadFromStorage(): CalendarEvent[] {
    const saved = this.storage.get<CalendarEvent[]>(STORAGE_KEY);
    return (saved || []).map(e => ({
      ...e,
      date:      new Date(e.date),
      createdAt: new Date(e.createdAt),
    }));
  }
}