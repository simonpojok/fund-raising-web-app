import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ISupportedPaymentMethod } from '../../interfaces/supported_payment_method.interface';

@Component({
  selector: 'app-settings-payment-card',
  templateUrl: './settings-payment-card.component.html',
  styleUrls: ['./settings-payment-card.component.scss'],
  standalone: false,
})
export class SettingsPaymentCardComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() supportedPaymentMethods: ISupportedPaymentMethod[] = [];
  @Input() loadingPaymentMethods = false;
  @Input() getPaymentMethodName!: (id: string) => string;
  @Input() isPaymentMethodAdded!: (id: string) => boolean;

  @Output() addPaymentMethod = new EventEmitter<void>();
  @Output() removePaymentMethod = new EventEmitter<number>();
  @Output() addPredefinedPaymentMethod = new EventEmitter<ISupportedPaymentMethod>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize with at least one payment method if none exist
    if (this.getPaymentMethodsArray().length === 0) {
      this.onAddPaymentMethod();
    }
  }

  getPaymentMethodsArray(): FormArray {
    return this.formGroup.get('payment_methods') as FormArray;
  }

  onAddPaymentMethod(): void {
    this.addPaymentMethod.emit();
  }

  onRemovePaymentMethod(index: number): void {
    if (this.getPaymentMethodsArray().length > 1) {
      this.removePaymentMethod.emit(index);
    }
  }

  onAddPredefinedPaymentMethod(method: ISupportedPaymentMethod): void {
    if (!this.isPaymentMethodAdded(method.id)) {
      this.addPredefinedPaymentMethod.emit(method);
    }
  }

  getPopularPaymentMethods(): ISupportedPaymentMethod[] {
    // Filter for commonly used payment methods
    const popularIds = ['mtn', 'airtel', 'bank', 'cash'];
    return this.supportedPaymentMethods.filter(method =>
      popularIds.includes(method.id) && method.is_active
    );
  }

  // Validation helpers
  isPaymentMethodValid(index: number): boolean {
    const paymentMethod = this.getPaymentMethodsArray().at(index);
    return paymentMethod ? paymentMethod.valid : false;
  }

  hasPaymentMethodError(index: number, field: string): boolean {
    const paymentMethod = this.getPaymentMethodsArray().at(index);
    if (!paymentMethod) return false;

    const control = paymentMethod.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getPaymentMethodError(index: number, field: string): string | null {
    const paymentMethod = this.getPaymentMethodsArray().at(index);
    if (!paymentMethod) return null;

    const control = paymentMethod.get(field);
    if (control && control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        const fieldLabels: { [key: string]: string } = {
          'id': 'Payment method type',
          'account_name': 'Account name',
          'account_number': 'Account number'
        };
        return `${fieldLabels[field]} is required`;
      }
    }
    return null;
  }

  // Get the display name for a payment method by ID
  getMethodDisplayName(methodId: string): string {
    const method = this.supportedPaymentMethods.find(m => m.id === methodId);
    return method ? method.name : methodId;
  }

  // Check if all payment methods have valid data
  areAllPaymentMethodsValid(): boolean {
    const paymentMethods = this.getPaymentMethodsArray();
    if (paymentMethods.length === 0) return false;

    return paymentMethods.controls.every(control => control.valid);
  }

  // Get summary of enabled features for preview
  getEnabledFeaturesSummary(): string[] {
    const features: string[] = [];

    if (this.formGroup.get('allow_anonymous_contributions')?.value) {
      features.push('Anonymous contributions allowed');
    }

    if (this.formGroup.get('include_pledges')?.value) {
      features.push('Pledges accepted');
    }

    if (this.formGroup.get('allow_comments')?.value) {
      features.push('Comments enabled');
    }

    if (this.formGroup.get('send_thank_you_messages')?.value) {
      features.push('Thank you messages enabled');
    }

    if (this.formGroup.get('is_invitation_only')?.value) {
      features.push('Invitation only');
    } else if (this.formGroup.get('is_public')?.value) {
      features.push('Public campaign');
    } else {
      features.push('Unlisted campaign');
    }

    return features;
  }

  // Get privacy level description
  getPrivacyDescription(): string {
    if (this.formGroup.get('is_invitation_only')?.value) {
      const autoApprove = this.formGroup.get('auto_approve_invitees')?.value;
      return `Private (Invitation only${autoApprove ? ', auto-approved' : ''})`;
    }

    if (this.formGroup.get('is_public')?.value) {
      return 'Public (visible to everyone)';
    }

    return 'Unlisted (only accessible with direct link)';
  }

  // Convenience method to check if form has any validation errors
  hasValidationErrors(): boolean {
    return this.formGroup.invalid || this.getPaymentMethodsArray().length === 0;
  }

  // Get total count of validation errors
  getValidationErrorCount(): number {
    let errorCount = 0;

    // Count form group errors
    Object.keys(this.formGroup.controls).forEach(key => {
      if (key !== 'payment_methods') {
        const control = this.formGroup.get(key);
        if (control && control.invalid && (control.dirty || control.touched)) {
          errorCount++;
        }
      }
    });

    // Count payment method errors
    const paymentMethods = this.getPaymentMethodsArray();
    if (paymentMethods.length === 0) {
      errorCount++;
    } else {
      paymentMethods.controls.forEach(control => {
        if (control.invalid) {
          errorCount++;
        }
      });
    }

    return errorCount;
  }

  // Track payment method changes for validation
  onPaymentMethodChange(index: number, field: string): void {
    const paymentMethod = this.getPaymentMethodsArray().at(index);
    if (paymentMethod) {
      const control = paymentMethod.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    }
  }

  // Helper to check if we should show the validation summary
  shouldShowValidationSummary(): boolean {
    return this.formGroup.dirty && this.hasValidationErrors();
  }
}
