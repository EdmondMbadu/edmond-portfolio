import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'portfolio-theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly hasExplicitPreference = signal(false);
  private readonly _theme = signal<Theme>('dark');

  readonly theme = computed(() => this._theme());

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    const applyStoredPreference = () => {
      const stored = localStorage.getItem(this.storageKey) as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        this.hasExplicitPreference.set(true);
        this._theme.set(stored);
        return true;
      }
      return false;
    };

    const applySystemPreference = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._theme.set(prefersDark ? 'dark' : 'light');
    };

    // Initialize theme
    const hasStoredPreference = applyStoredPreference();
    if (!hasStoredPreference) {
      applySystemPreference();
    }

    // Watch for OS changes but respect explicit user choice
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (this.hasExplicitPreference()) {
        return;
      }
      this._theme.set(event.matches ? 'dark' : 'light');
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleMediaChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(handleMediaChange);
    }

    effect(() => {
      const value = this._theme();
      const root = document.documentElement;
      root.classList.toggle('dark', value === 'dark');
      root.classList.toggle('light', value === 'light');
      localStorage.setItem(this.storageKey, value);
    }, { allowSignalWrites: true });
  }

  toggle(): void {
    if (!this.isBrowser) {
      return;
    }

    this.hasExplicitPreference.set(true);
    this._theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  set(theme: Theme): void {
    if (!this.isBrowser) {
      return;
    }

    this.hasExplicitPreference.set(true);
    this._theme.set(theme);
  }
}
