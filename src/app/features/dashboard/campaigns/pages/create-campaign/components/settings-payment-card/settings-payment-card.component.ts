import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'bank_account' | 'card';
  provider: string; // e.g., 'MTN', 'Airtel', 'Bank of Uganda'
  account_name: string;
  account_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportedProvider {
  id: string;
  name: string;
  type: 'mobile_money' | 'bank_account' | 'card';
  logo_url?: string;
  is_active: boolean;
}

@Component({
  selector: 'app-settings-payment-card',
  templateUrl: './settings-payment-card.component.html',
  standalone: false,
})
export class SettingsPaymentCardComponent implements OnInit {
  @Input() paymentMethod?: PaymentMethod;
  @Input() supportedProviders: SupportedProvider[] = [];
  @Input() isDefault = false;
  @Input() canSetDefault = true;
  @Input() canEdit = true;
  @Input() canDelete = true;

  @Output() edit = new EventEmitter<PaymentMethod>();
  @Output() delete = new EventEmitter<string>();
  @Output() setDefault = new EventEmitter<string>();
  @Output() save = new EventEmitter<Partial<PaymentMethod>>();

  isEditing = false;
  isLoading = false;
  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      provider: [this.paymentMethod?.provider || '', Validators.required],
      account_name: [this.paymentMethod?.account_name || '', Validators.required],
      account_number: [this.paymentMethod?.account_number || '', Validators.required]
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.initializeForm();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.initializeForm();
  }

  saveChanges(): void {
    if (this.editForm.invalid) {
      Object.keys(this.editForm.controls).forEach(key => {
        this.editForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const updatedData = {
      ...this.editForm.value,
      id: this.paymentMethod?.id
    };

    this.save.emit(updatedData);
    this.isEditing = false;
    this.isLoading = false;
  }

  onEdit(): void {
    if (this.paymentMethod) {
      this.edit.emit(this.paymentMethod);
    }
  }

  onDelete(): void {
    if (this.paymentMethod && !this.isDefault) {
      if (confirm('Are you sure you want to delete this payment method?')) {
        this.delete.emit(this.paymentMethod.id);
      }
    }
  }

  onSetDefault(): void {
    if (this.paymentMethod && !this.isDefault) {
      this.setDefault.emit(this.paymentMethod.id);
    }
  }

  getProviderName(): string {
    if (!this.paymentMethod) return 'Unknown';
    const provider = this.supportedProviders.find(p => p.id === this.paymentMethod!.provider);
    return provider ? provider.name : this.paymentMethod.provider;
  }

  getPaymentTypeIcon(): string {
    if (!this.paymentMethod) return '';

    switch (this.paymentMethod.type) {
      case 'mobile_money':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        `;
      case 'bank_account':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        `;
      case 'card':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        `;
      default:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
    }
  }

  getPaymentTypeLabel(): string {
    if (!this.paymentMethod) return 'Unknown';

    switch (this.paymentMethod.type) {
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank_account':
        return 'Bank Account';
      case 'card':
        return 'Card';
      default:
        return 'Payment Method';
    }
  }

  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length <= 4) return accountNumber;

    const lastFour = accountNumber.slice(-4);
    const masked = '*'.repeat(accountNumber.length - 4);
    return masked + lastFour;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getProvidersByType(type: string): SupportedProvider[] {
    return this.supportedProviders.filter(provider => provider.type === type && provider.is_active);
  }

  // Form validation helpers
  get f() {
    return this.editForm.controls;
  }

  getFieldError(fieldName: string): string | null {
    const field = this.editForm.get(fieldName);
    if (field?.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        const fieldLabels: { [key: string]: string } = {
          'provider': 'Provider',
          'account_name': 'Account name',
          'account_number': 'Account number'
        };
        return `${fieldLabels[fieldName]} is required`;
      }
    }
    return null;
  }
}
