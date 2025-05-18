import { Component, Input, Optional, Self, OnChanges, SimpleChanges } from '@angular/core';
import {ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  standalone: false,
})
export class InputComponent implements ControlValueAccessor, OnChanges {
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hideLabel = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() autocomplete: string | null = null;
  @Input() helperText: string | null = null;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = true;
  @Input() rounded = true;
  @Input() icon: string | null = null;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() validationMessages: { [key: string]: string } = {};

  // For internal use
  internalControl = new FormControl('');
  showPassword = false;
  isFocused = false;

  // Value accessor methods
  private onTouched: () => void = () => {};
  private onChange: (value: any) => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.ngControl?.control) {
      if (this.disabled) {
        this.ngControl.control.disable();
      } else {
        this.ngControl.control.enable();
      }
    }
  }

  // Implement ControlValueAccessor methods
  writeValue(value: any): void {
    this.internalControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.internalControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }

  // Public methods
  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getInputType(): string {
    if (this.type === 'password' && this.showPassword) {
      return 'text';
    }
    return this.type;
  }

  get hasErrors(): boolean {
    return !!(this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty));
  }

  get errorMessage(): string | null {
    if (!this.ngControl?.errors || (!this.ngControl.touched && !this.ngControl.dirty)) {
      return null;
    }

    // Get the first error
    const errorKey = Object.keys(this.ngControl.errors)[0];

    // Return custom message if available, otherwise use default
    return this.validationMessages[errorKey] || this.getDefaultErrorMessage(errorKey, this.ngControl.errors[errorKey]);
  }

  private getDefaultErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
        return 'This field is required';
      case 'email':
        return 'Please enter a valid email address';
      case 'minlength':
        return `Must be at least ${errorValue.requiredLength} characters`;
      case 'maxlength':
        return `Cannot exceed ${errorValue.requiredLength} characters`;
      case 'pattern':
        return 'Invalid format';
      case 'min':
        return `Value must be at least ${errorValue.min}`;
      case 'max':
        return `Value cannot exceed ${errorValue.max}`;
      default:
        return 'Invalid value';
    }
  }

  get containerClasses(): string {
    return `${this.fullWidth ? 'w-full' : ''} mb-4`;
  }

  get labelClasses(): string {
    return `input-label ${this.hideLabel ? 'sr-only' : ''}`;
  }

  get inputClasses(): string {
    const sizeClasses = {
      sm: 'py-1.5 text-sm',
      md: 'py-2',
      lg: 'py-2.5 text-lg'
    };

    const iconPaddingClasses = {
      left: this.icon ? 'pl-10' : 'pl-4',
      right: this.icon ? 'pr-10' : 'pr-4'
    };

    const stateClasses = this.hasErrors
      ? 'border-danger focus:border-danger focus:ring-danger'
      : 'border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500';

    const roundedClasses = this.rounded ? 'rounded-lg' : 'rounded-none';

    return `input-field block w-full ${roundedClasses} ${sizeClasses[this.size]} ${iconPaddingClasses[this.iconPosition]} ${iconPaddingClasses[this.iconPosition === 'left' ? 'right' : 'left']} ${stateClasses} dark:bg-gray-800 transition-colors duration-200`;
  }
}
