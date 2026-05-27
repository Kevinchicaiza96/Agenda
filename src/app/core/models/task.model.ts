export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus   = 'pending' | 'progress' | 'done';

export interface Task {
  id:          string;
  title:       string;
  description: string;
  priority:    TaskPriority;
  status:      TaskStatus;
  dueDate:     Date | null;
  tags:        string[];
  createdAt:   Date;
  updatedAt:   Date;
}