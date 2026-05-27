import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Note, NoteColor } from '../../../core/models/note.model';

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './note-dialog.html',
  styleUrl: './note-dialog.scss'
})
export class NoteDialogComponent {

  dialogRef = inject(MatDialogRef<NoteDialogComponent>);
  data      = inject<Note | null>(MAT_DIALOG_DATA);
  fb        = inject(FormBuilder);

  isEditing = !!this.data;

  colors: { value: NoteColor; label: string }[] = [
    { value: 'yellow', label: '🟡' },
    { value: 'blue',   label: '🔵' },
    { value: 'green',  label: '🟢' },
    { value: 'pink',   label: '🩷' },
    { value: 'purple', label: '🟣' },
  ];

  form = this.fb.group({
    title:   [this.data?.title   || ''],
    content: [this.data?.content || '', Validators.required],
    color:   [this.data?.color   || 'yellow' as NoteColor],
    pinned:  [this.data?.pinned  || false],
  });

  selectColor(color: NoteColor): void {
    this.form.patchValue({ color });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}