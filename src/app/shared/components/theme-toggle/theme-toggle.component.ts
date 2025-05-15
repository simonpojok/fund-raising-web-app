import { Component, OnInit } from '@angular/core';
import { ThemeMode, ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  standalone: false,
  styles: [`
    .theme-toggle {
      @apply relative inline-flex items-center;
    }

    .theme-toggle__input {
      @apply sr-only;
    }

    .theme-toggle__button {
      @apply flex items-center justify-center w-10 h-10 rounded-full bg-secondary-200 dark:bg-secondary-700
              text-secondary-700 dark:text-secondary-200 transition-colors duration-200 cursor-pointer;
    }

    .theme-toggle__button:hover {
      @apply bg-secondary-300 dark:bg-secondary-600;
    }

    .theme-toggle__icon {
      @apply w-5 h-5;
    }

    .theme-select {
      @apply absolute top-full right-0 mt-2 p-2 bg-white dark:bg-secondary-800 rounded-lg shadow-lg z-10
              border border-secondary-200 dark:border-secondary-700;
    }

    .theme-select__option {
      @apply px-4 py-2 rounded-md text-secondary-800 dark:text-secondary-200 flex items-center gap-2
              transition-colors duration-200 cursor-pointer;
    }

    .theme-select__option:hover {
      @apply bg-secondary-100 dark:bg-secondary-700;
    }

    .theme-select__option--active {
      @apply bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium;
    }

    .theme-select__option--active:hover {
      @apply bg-primary-100 dark:bg-primary-800;
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  isOpen = false;
  currentTheme!: ThemeMode;
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.themeMode$.subscribe(mode => {
      this.currentTheme = mode;
    });

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  setTheme(theme: ThemeMode): void {
    this.themeService.setTheme(theme);
    this.closeDropdown();
  }
}
