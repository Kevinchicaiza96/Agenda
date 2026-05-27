export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

export interface Note {
  id:        string;
  title:     string;
  content:   string;
  color:     NoteColor;
  pinned:    boolean;
  createdAt: Date;
  updatedAt: Date;
}