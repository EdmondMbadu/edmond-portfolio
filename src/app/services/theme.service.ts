import { Injectable, computed, effect, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'portfolio-theme';
  private readonly _theme = signal<Theme>(this.getInitialTheme());

  readonly theme = computed(() => this._theme());

  constructor() {
    effect(() => {
      const value = this._theme();

      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.classList.toggle('dark', value === 'dark');
        root.classList.toggle('light', value === 'light');
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, value);
      }
    });
  }

  toggle(): void {
    this._theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  set(theme: Theme): void {
    this._theme.set(theme);
  }

  private getInitialTheme(): Theme {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey) as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'dark';
  }
}
