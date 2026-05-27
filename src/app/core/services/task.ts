import { Injectable, signal, computed, inject } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';
import { StorageService } from './storage';

const STORAGE_KEY = 'agendia_tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private storage = inject(StorageService);

  private _tasks = signal<Task[]>([]);

  readonly tasks         = this._tasks.asReadonly();
  readonly pendingCount  = computed(() => this._tasks().filter(t => t.status === 'pending').length);
  readonly progressCount = computed(() => this._tasks().filter(t => t.status === 'progress').length);
  readonly doneCount     = computed(() => this._tasks().filter(t => t.status === 'done').length);
  readonly todayTasks    = computed(() => {
    const today = new Date().toDateString();
    return this._tasks().filter(t =>
      t.dueDate && new Date(t.dueDate).toDateString() === today
    );
  });

  constructor() {
    this._tasks.set(this.loadFromStorage());
  }

  add(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const task: Task = {
      ...data,
      id:        crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._tasks.update(tasks => [...tasks, task]);
    this.persist();
    return task;
  }

  update(id: string, changes: Partial<Task>): void {
    this._tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, ...changes, updatedAt: new Date() } : t)
    );
    this.persist();
  }

  delete(id: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
    this.persist();
  }

  updateStatus(id: string, status: TaskStatus): void {
    this.update(id, { status });
  }

  getByPriority(priority: TaskPriority): Task[] {
    return this._tasks().filter(t => t.priority === priority);
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._tasks());
  }

  private loadFromStorage(): Task[] {
    const saved = this.storage.get<Task[]>(STORAGE_KEY);
    return (saved || []).map(t => ({
      ...t,
      dueDate:   t.dueDate ? new Date(t.dueDate) : null,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));
  }
}