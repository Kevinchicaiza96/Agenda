import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss'
})
export class TaskDialogComponent {

  dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  data      = inject<Task | null>(MAT_DIALOG_DATA);
  fb        = inject(FormBuilder);

  isEditing = !!this.data;

  form = this.fb.group({
    title:       [this.data?.title || '',       Validators.required],
    description: [this.data?.description || ''],
    priority:    [this.data?.priority || 'medium', Validators.required],
    status:      [this.data?.status || 'pending',  Validators.required],
    dueDate:     [this.data?.dueDate || null],
    tags:        [this.data?.tags?.join(', ') || ''],
  });

  save(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    const tags = val.tags
      ? val.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    this.dialogRef.close({
      title:       val.title,
      description: val.description || '',
      priority:    val.priority,
      status:      val.status,
      dueDate:     val.dueDate || null,
      tags,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}