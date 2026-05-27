import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NoteService } from '../../../core/services/note';
import { Note, NoteColor } from '../../../core/models/note.model';
import { NoteDialogComponent } from '../note-dialog/note-dialog';
import { ToastService } from '../../../core/services/toast';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [DatePipe, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './notes-list.html',
  styleUrl: './notes-list.scss'
})
export class NotesListComponent {

  toast       = inject(ToastService);
  noteService = inject(NoteService);
  dialog      = inject(MatDialog);

  openDialog(note?: Note): void {
    const ref = this.dialog.open(NoteDialogComponent, {
      width: '480px',
      data: note || null,
      panelClass: 'agendia-dialog'
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (note) {
        this.noteService.update(note.id, result);
        this.toast.success('Nota actualizada');
      } else {
        this.noteService.add(result);
        this.toast.success('Nota creada');
      }
    });
  }

  deleteNote(id: string, title: string): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title:   '¿Eliminar nota?',
        message: `"${title || 'Esta nota'}" será eliminada permanentemente.`,
        confirm: 'Eliminar',
        type:    'danger'
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.noteService.delete(id);
        this.toast.success('Nota eliminada');
      }
    });
  }

  togglePin(id: string, pinned: boolean): void {
    this.noteService.togglePin(id);
    this.toast.info(pinned ? 'Nota desfijada' : 'Nota fijada');
  }

  colorLabel(color: NoteColor): string {
    const map: Record<NoteColor, string> = {
      yellow: 'Amarillo',
      blue:   'Azul',
      green:  'Verde',
      pink:   'Rosa',
      purple: 'Morado',
    };
    return map[color];
  }
}