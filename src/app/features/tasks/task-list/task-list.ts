import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task';
import { TaskDialogComponent } from '../task-dialog/task-dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { ToastService } from '../../../core/services/toast';


type FilterType = 'all' | 'pending' | 'progress' | 'done';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatButtonToggleModule,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskListComponent {

  taskService = inject(TaskService);
  dialog      = inject(MatDialog);
  toast = inject(ToastService);
  activeFilter = signal<FilterType>('all');

  filteredTasks = computed(() => {
    const filter = this.activeFilter();
    const tasks  = this.taskService.tasks();
    if (filter === 'all') return tasks;
    return tasks.filter(t => t.status === filter);
  });

  openDialog(task?: Task): void {
    const ref = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task || null,
      panelClass: 'agendia-dialog'
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (task) {
        this.taskService.update(task.id, result);
        this.toast.success('Tarea actualizada')
      } else {
        this.taskService.add(result);
        this.toast.success('Tarea creada')
      }
    });
  }

  deleteTask(id: string, title: string): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title:   '¿Eliminar tarea?',
        message: `"${title}" será eliminada permanentemente.`,
        confirm: 'Eliminar',
        type:    'danger'
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.taskService.delete(id);
        this.toast.success('Tarea eliminada');
      }
    });
  }

  cycleStatus(task: Task): void {
    const next: Record<TaskStatus, TaskStatus> = {
      pending:  'progress',
      progress: 'done',
      done:     'pending',
    };
    const nextStatus = next[task.status];
    this.taskService.updateStatus(task.id, nextStatus);
    this.toast.info(`Estado: ${this.statusLabel(nextStatus)}`);
  }

  priorityLabel(p: string): string {
    return p === 'high' ? 'Alta' : p === 'medium' ? 'Media' : 'Baja';
  }

  statusLabel(s: string): string {
    return s === 'pending' ? 'Pendiente' : s === 'progress' ? 'En progreso' : 'Hecha';
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < new Date();
  }

  setFilter(f: FilterType): void {
    this.activeFilter.set(f);
  }
}