import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';

interface PaymentMethod {
  name: string;
  number: string;
}

@Component({
  selector: 'app-campaign-settings',
  templateUrl: './campaign-settings.component.html',
  standalone: false,
})
export class CampaignSettingsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() initialData: any = null;

  predefinedPaymentMethods = [
    {id: 'mtn', name: 'MTN Mobile Money', placeholder: '256700000000'},
    {id: 'airtel', name: 'Airtel Money', placeholder: '256750000000'},
    {id: 'bank', name: 'Bank Transfer', placeholder: 'Account: 123456789'},
    {id: 'other', name: 'Other', placeholder: 'Enter details'}
  ];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.setupForm();
    if (this.initialData) {
      this.formGroup.patchValue(this.initialData);
      this.loadPaymentMethods();
    }
  }

  setupForm(): void {
    // Campaign visibility and permissions
    this.formGroup.addControl('isPublic', this.fb.control(true));
    this.formGroup.addControl('allowAnonymousContributions', this.fb.control(true));
    this.formGroup.addControl('includePledges', this.fb.control(true));
    this.formGroup.addControl('sendThankYouMessages', this.fb.control(true));
    this.formGroup.addControl('allowComments', this.fb.control(true));

    // Invitation settings
    this.formGroup.addControl('isInvitationOnly', this.fb.control(false));
    this.formGroup.addControl('autoApproveInvitees', this.fb.control(true));

    // Payment methods
    this.formGroup.addControl('paymentMethods', this.fb.array([]));
  }

  loadPaymentMethods(): void {
    if (this.initialData && this.initialData.paymentMethods) {
      const paymentMethodsArray = this.formGroup.get('paymentMethods') as FormArray;
      this.initialData.paymentMethods.forEach((method: PaymentMethod) => {
        paymentMethodsArray.push(this.createPaymentMethodGroup(method.name, method.number));
      });
    }
  }

  get paymentMethodsArray(): FormArray {
    return this.formGroup.get('paymentMethods') as FormArray;
  }

  createPaymentMethodGroup(name: string = '', number: string = ''): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      number: [number, Validators.required]
    });
  }

  addPaymentMethod(): void {
    this.paymentMethodsArray.push(this.createPaymentMethodGroup());
  }

  removePaymentMethod(index: number): void {
    this.paymentMethodsArray.removeAt(index);
  }

  addPredefinedPaymentMethod(methodType: any): void {
    const existingMethod = this.paymentMethodsArray.value.find(
      (method: PaymentMethod) => method.name === methodType.name
    );

    if (!existingMethod) {
      this.paymentMethodsArray.push(this.createPaymentMethodGroup(methodType.name, ''));
    }
  }

  // Get validation status for different sections
  isPaymentMethodsValid(): boolean {
    return this.paymentMethodsArray.length > 0 && this.paymentMethodsArray.valid;
  }

  // Privacy level helpers
  getPrivacyLevel(): string {
    const isPublic = this.formGroup.get('isPublic')?.value;
    const isInvitationOnly = this.formGroup.get('isInvitationOnly')?.value;

    if (isInvitationOnly) return 'Private (Invitation Only)';
    if (isPublic) return 'Public';
    return 'Unlisted';
  }

  getPrivacyDescription(): string {
    const isPublic = this.formGroup.get('isPublic')?.value;
    const isInvitationOnly = this.formGroup.get('isInvitationOnly')?.value;

    if (isInvitationOnly) {
      return 'Only people you invite can view and contribute to this campaign.';
    }
    if (isPublic) {
      return 'Anyone can find and contribute to this campaign through search.';
    }
    return 'Only people with the direct link can view and contribute.';
  }

  // Form validation helpers
  getPaymentMethodError(index: number, field: string): string | null {
    const paymentMethod = this.paymentMethodsArray.at(index);
    const control = paymentMethod.get(field);

    if (control?.invalid && (control?.dirty || control?.touched)) {
      if (control.errors?.['required']) {
        return `${field === 'name' ? 'Payment method name' : 'Account details'} is required`;
      }
    }
    return null;
  }
}
