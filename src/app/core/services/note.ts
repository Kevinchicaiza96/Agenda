import { Injectable, signal, computed, inject } from '@angular/core';
import { Note } from '../models/note.model';
import { StorageService } from './storage';

const STORAGE_KEY = 'agendia_notes';

@Injectable({ providedIn: 'root' })
export class NoteService {

  private storage = inject(StorageService);

  private _notes = signal<Note[]>([]);

  readonly notes      = this._notes.asReadonly();
  readonly pinned     = computed(() => this._notes().filter(n => n.pinned));
  readonly unpinned   = computed(() => this._notes().filter(n => !n.pinned));
  readonly totalCount = computed(() => this._notes().length);

  constructor() {
    this._notes.set(this.loadFromStorage());
  }

  add(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const note: Note = {
      ...data,
      id:        crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._notes.update(notes => [note, ...notes]);
    this.persist();
    return note;
  }

  update(id: string, changes: Partial<Note>): void {
    this._notes.update(notes =>
      notes.map(n => n.id === id ? { ...n, ...changes, updatedAt: new Date() } : n)
    );
    this.persist();
  }

  delete(id: string): void {
    this._notes.update(notes => notes.filter(n => n.id !== id));
    this.persist();
  }

  togglePin(id: string): void {
    const note = this._notes().find(n => n.id === id);
    if (note) this.update(id, { pinned: !note.pinned });
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._notes());
  }

  private loadFromStorage(): Note[] {
    const saved = this.storage.get<Note[]>(STORAGE_KEY);
    return (saved || []).map(n => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
    }));
  }
}