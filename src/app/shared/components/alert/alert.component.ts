import { Component, Input, Output, EventEmitter } from '@angular/core';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  standalone: false,
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message = '';
  @Input() title = '';
  @Input() dismissible = true;
  @Input() icon = true;
  @Input() outlined = false;

  @Output() dismissed = new EventEmitter<void>();

  get alertClasses(): string {
    const baseClasses = 'p-4 rounded-lg mb-4 flex items-start gap-3';

    const filledClasses = {
      success: 'bg-success-50 text-success-800 dark:bg-success-900/50 dark:text-success-300',
      info: 'bg-primary-50 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
      warning: 'bg-warning-50 text-warning-800 dark:bg-warning-900/50 dark:text-warning-300',
      error: 'bg-danger-50 text-danger-800 dark:bg-danger-900/50 dark:text-danger-300'
    };

    const outlinedClasses = {
      success: 'bg-white dark:bg-gray-800 border border-success-300 text-success-800 dark:border-success-700 dark:text-success-300',
      info: 'bg-white dark:bg-gray-800 border border-primary-300 text-primary-800 dark:border-primary-700 dark:text-primary-300',
      warning: 'bg-white dark:bg-gray-800 border border-warning-300 text-warning-800 dark:border-warning-700 dark:text-warning-300',
      error: 'bg-white dark:bg-gray-800 border border-danger-300 text-danger-800 dark:border-danger-700 dark:text-danger-300'
    };

    return `${baseClasses} ${this.outlined ? outlinedClasses[this.type] : filledClasses[this.type]}`;
  }

  get titleClasses(): string {
    return 'font-medium text-sm';
  }

  get messageClasses(): string {
    return 'text-sm opacity-90';
  }

  get iconClasses(): string {
    return 'h-5 w-5 mt-0.5 flex-shrink-0';
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  getIconForType(): string {
    switch (this.type) {
      case 'success':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="${this.iconClasses}" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        `;
      case 'info':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="${this.iconClasses}" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        `;
      case 'warning':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="${this.iconClasses}" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        `;
      case 'error':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="${this.iconClasses}" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        `;
      default:
        return '';
    }
  }
}
