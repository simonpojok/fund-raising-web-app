import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: false,

})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'link' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() iconLeft = '';
  @Input() iconRight = '';
  @Input() ariaLabel = '';

  @Output() buttonClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const baseClasses = 'btn inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-5 py-2.5 text-lg'
    };

    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 focus:ring-opacity-50',
      secondary: 'bg-secondary-200 text-secondary-800 hover:bg-secondary-300 dark:bg-secondary-700 dark:text-secondary-100 dark:hover:bg-secondary-600 focus:ring-secondary-500 focus:ring-opacity-50',
      success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success focus:ring-opacity-50',
      danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger focus:ring-opacity-50',
      outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900 focus:ring-primary-500 focus:ring-opacity-50',
      link: 'bg-transparent text-primary-600 dark:text-primary-400 hover:underline focus:ring-0'
    };

    const disabledClasses = this.disabled || this.loading ?
      'opacity-70 cursor-not-allowed pointer-events-none' :
      'cursor-pointer';

    const widthClasses = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${disabledClasses} ${widthClasses}`;
  }

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
