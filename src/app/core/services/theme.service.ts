import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly THEME_KEY = 'theme_mode';

  private themeModeSubject = new BehaviorSubject<ThemeMode>(this.getStoredTheme() || 'system');
  public themeMode$ = this.themeModeSubject.asObservable();

  private darkModeSubject = new BehaviorSubject<boolean>(this.isDarkMode());
  public darkMode$ = this.darkModeSubject.asObservable();

  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeTheme();

    // Listen for system preference changes
    this.mediaQuery.addEventListener('change', () => {
      if (this.themeModeSubject.value === 'system') {
        this.updateThemeBasedOnPreference();
      }
    });
  }

  private initializeTheme(): void {
    const themeMode = this.themeModeSubject.value;

    if (themeMode === 'system') {
      this.updateThemeBasedOnPreference();
    } else {
      this.setTheme(themeMode);
    }
  }

  private updateThemeBasedOnPreference(): void {
    const isDark = this.mediaQuery.matches;
    this.darkModeSubject.next(isDark);
    this.applyTheme(isDark);
  }

  setTheme(mode: ThemeMode): void {
    this.themeModeSubject.next(mode);
    localStorage.setItem(this.THEME_KEY, mode);

    if (mode === 'system') {
      this.updateThemeBasedOnPreference();
    } else {
      const isDark = mode === 'dark';
      this.darkModeSubject.next(isDark);
      this.applyTheme(isDark);
    }
  }

  private getStoredTheme(): ThemeMode | null {
    const theme = localStorage.getItem(this.THEME_KEY);
    return (theme as ThemeMode) || null;
  }

  private isDarkMode(): boolean {
    const theme = this.getStoredTheme();
    if (theme === 'dark') return true;
    if (theme === 'light') return false;

    // Use system preference if theme is 'system' or not set
    return this.mediaQuery.matches;
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }
}
