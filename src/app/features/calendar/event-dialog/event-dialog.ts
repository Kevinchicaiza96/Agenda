import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './event-dialog.html',
  styleUrl: './event-dialog.scss'
})
export class EventDialogComponent {

  dialogRef = inject(MatDialogRef<EventDialogComponent>);
  data      = inject<CalendarEvent | null>(MAT_DIALOG_DATA);
  fb        = inject(FormBuilder);

  isEditing = !!this.data;

  colors = [
    '#f59e0b', '#ef4444', '#6366f1',
    '#10b981', '#3b82f6', '#ec4899',
  ];

  form = this.fb.group({
    title:       [this.data?.title       || '', Validators.required],
    description: [this.data?.description || ''],
    date:        [this.data?.date        || new Date(), Validators.required],
    startTime:   [this.data?.startTime   || '09:00'],
    endTime:     [this.data?.endTime     || '10:00'],
    color:       [this.data?.color       || '#f59e0b'],
    allDay:      [this.data?.allDay      || false],
  });

  selectColor(color: string): void {
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