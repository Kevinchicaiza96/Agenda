import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../core/services/task';
import { NoteService } from '../../core/services/note';
import { EventService } from '../../core/services/event';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  taskService  = inject(TaskService);
  noteService  = inject(NoteService);
  eventService = inject(EventService);

  today = new Date();

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  progressPercent = computed(() => {
    const total = this.taskService.tasks().length;
    if (total === 0) return 0;
    return Math.round((this.taskService.doneCount() / total) * 100);
  });
}