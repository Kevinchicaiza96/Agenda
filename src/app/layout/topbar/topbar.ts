import { Component, inject, computed, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../core/services/task';
import { SearchDialogComponent } from '../../shared/search/search-dialog/search-dialog';

interface NavItem {
  label: string;
  icon:  string;
  route: string;
  badge?: 'pending';
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatBadgeModule, MatMenuModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class TopbarComponent {

  dialog      = inject(MatDialog);
  taskService = inject(TaskService);
  today       = new Date();

  navItems: NavItem[] = [
    { label: 'Dashboard',  icon: 'grid_view',      route: '/dashboard' },
    { label: 'Tareas',     icon: 'task_alt',       route: '/tasks', badge: 'pending' },
    { label: 'Calendario', icon: 'calendar_month', route: '/calendar' },
    { label: 'Notas',      icon: 'sticky_note_2',  route: '/notes' },
  ];

  openSearch(): void {
    this.dialog.open(SearchDialogComponent, {
      panelClass: 'search-dialog-panel',
      backdropClass: 'search-backdrop',
    });
  }

  notifications = computed(() => {
    const now   = new Date();
    const today = now.toDateString();
    const items: { title: string; type: 'overdue' | 'today'; taskId: string }[] = [];
    for (const task of this.taskService.tasks()) {
      if (task.status === 'done' || !task.dueDate) continue;
      const due = new Date(task.dueDate);
      if (due < now && due.toDateString() !== today) {
        items.push({ title: task.title, type: 'overdue', taskId: task.id });
      } else if (due.toDateString() === today) {
        items.push({ title: task.title, type: 'today', taskId: task.id });
      }
    }
    return items;
  });

  notifCount = computed(() => this.notifications().length);
}