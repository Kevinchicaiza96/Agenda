import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../../core/services/event';
import { EventDialogComponent } from '../event-dialog/event-dialog';
import { CalendarEvent } from '../../../core/models/event.model';

interface CalendarDay {
  date:           Date;
  isToday:        boolean;
  isCurrentMonth: boolean;
  events:         CalendarEvent[];
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, MatIconModule, MatButtonModule],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.scss'
})
export class CalendarViewComponent {

  eventService = inject(EventService);
  dialog       = inject(MatDialog);

  currentDate  = signal(new Date());
  selectedDay  = signal<Date | null>(null);

  currentYear  = computed(() => this.currentDate().getFullYear());
  currentMonth = computed(() => this.currentDate().getMonth());

  monthName = computed(() =>
    this.currentDate().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  );

  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  calendarDays = computed((): CalendarDay[] => {
    const year  = this.currentYear();
    const month = this.currentMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);

    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const days: CalendarDay[] = [];

    for (let i = startDow - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isToday: false, isCurrentMonth: false, events: this.getEventsForDate(date) });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push({
        date,
        isToday: date.toDateString() === today.toDateString(),
        isCurrentMonth: true,
        events: this.getEventsForDate(date),
      });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push({ date, isToday: false, isCurrentMonth: false, events: this.getEventsForDate(date) });
    }

    return days;
  });

  selectedDayEvents = computed(() => {
    const day = this.selectedDay();
    if (!day) return [];
    return this.getEventsForDate(day);
  });

  prevMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  goToday(): void {
    this.currentDate.set(new Date());
    this.selectedDay.set(new Date());
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay.set(day.date);
  }

  openDialog(event?: CalendarEvent): void {
    const selected = this.selectedDay();
    const ref = this.dialog.open(EventDialogComponent, {
      width: '480px',
      data: event || null,
      panelClass: 'agendia-dialog'
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (!result.date && selected) result.date = selected;
      if (event) {
        this.eventService.update(event.id, result);
      } else {
        this.eventService.add(result);
      }
    });
  }

  deleteEvent(id: string): void {
    this.eventService.delete(id);
  }

  private getEventsForDate(date: Date): CalendarEvent[] {
    return this.eventService.events().filter(e =>
      new Date(e.date).toDateString() === date.toDateString()
    );
  }
}