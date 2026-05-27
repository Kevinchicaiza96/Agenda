import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TaskService } from '../../core/services/task';

interface NavItem {
  label: string;
  icon:  string;
  route: string;
  badge?: 'pending';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {

  navItems: NavItem[] = [
    { label: 'Dashboard',   icon: 'grid_view',      route: '/dashboard' },
    { label: 'Tareas',      icon: 'task_alt',       route: '/tasks', badge: 'pending' },
    { label: 'Calendario',  icon: 'calendar_month', route: '/calendar' },
    { label: 'Notas',       icon: 'sticky_note_2',  route: '/notes' },
  ];

  constructor(public taskService: TaskService) {}
}