import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../../core/services/task';
import { NoteService } from '../../../core/services/note';
import { EventService } from '../../../core/services/event';

type ResultType = 'task' | 'note' | 'event';

interface SearchResult {
  id:       string;
  type:     ResultType;
  title:    string;
  subtitle: string;
  icon:     string;
  route:    string;
}

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './search-dialog.html',
  styleUrl: './search-dialog.scss'
})
export class SearchDialogComponent {

  dialogRef   = inject(MatDialogRef<SearchDialogComponent>);
  router      = inject(Router);
  taskService = inject(TaskService);
  noteService = inject(NoteService);
  eventService = inject(EventService);

  query        = signal('');
  activeIndex  = signal(0);

  results = computed((): SearchResult[] => {
    const q = this.query().toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const results: SearchResult[] = [];

    // Tareas
    this.taskService.tasks()
      .filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach(t => results.push({
        id:       t.id,
        type:     'task',
        title:    t.title,
        subtitle: t.status === 'done' ? 'Completada' : t.status === 'progress' ? 'En progreso' : 'Pendiente',
        icon:     'task_alt',
        route:    '/tasks',
      }));

    // Notas
    this.noteService.notes()
      .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach(n => results.push({
        id:       n.id,
        type:     'note',
        title:    n.title || 'Sin título',
        subtitle: n.content.slice(0, 60) + (n.content.length > 60 ? '...' : ''),
        icon:     'sticky_note_2',
        route:    '/notes',
      }));

    // Eventos
    this.eventService.events()
      .filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach(e => results.push({
        id:       e.id,
        type:     'event',
        title:    e.title,
        subtitle: new Date(e.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        icon:     'calendar_month',
        route:    '/calendar',
      }));

    return results;
  });

  onQueryChange(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  onKeydown(event: KeyboardEvent): void {
    const len = this.results().length;
    if (!len) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update(i => (i + 1) % len);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update(i => (i - 1 + len) % len);
    } else if (event.key === 'Enter') {
      this.selectResult(this.results()[this.activeIndex()]);
    }
  }

  selectResult(result: SearchResult): void {
    this.router.navigate([result.route]);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  typeLabel(type: ResultType): string {
    return type === 'task' ? 'Tarea' : type === 'note' ? 'Nota' : 'Evento';
  }

  typeClass(type: ResultType): string {
    return type === 'task' ? 'type-task' : type === 'note' ? 'type-note' : 'type-event';
  }
}