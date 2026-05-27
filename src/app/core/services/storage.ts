import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser  = isPlatformBrowser(this.platformId);

  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
  }
}