import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  standalone: false,
})
export class SpinnerComponent {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: 'primary' | 'secondary' | 'white' | 'dark' = 'primary';
  @Input() centered = false;
  @Input() label = 'Loading...';
  @Input() showLabel = false;

  get spinnerSize(): string {
    const sizes = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12'
    };

    return sizes[this.size];
  }

  get spinnerColor(): string {
    const colors = {
      primary: 'text-primary-600 dark:text-primary-500',
      secondary: 'text-secondary-600 dark:text-secondary-400',
      white: 'text-white',
      dark: 'text-gray-800 dark:text-gray-200'
    };

    return colors[this.color];
  }

  get containerClasses(): string {
    const centeredClasses = this.centered ? 'flex justify-center items-center' : '';
    return centeredClasses;
  }
}
