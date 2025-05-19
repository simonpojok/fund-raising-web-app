import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { CreateCampaignService } from '../../services/create-campaign.service';
import { ICampaignPaymentMethod } from '../../interfaces/campaign_payment_method.interface';
import { ISupportedPaymentMethod } from '../../interfaces/supported_payment_method.interface';

@Component({
  selector: 'app-campaign-settings',
  templateUrl: './campaign-settings.component.html',
  standalone: false,
})
export class CampaignSettingsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() initialData: any = null;

  supportedPaymentMethods: ISupportedPaymentMethod[] = [];
  loadingPaymentMethods = false;

  constructor(
    private fb: FormBuilder,
    private createCampaignService: CreateCampaignService
  ) {}

  ngOnInit(): void {
    this.setupForm();
    this.loadSupportedPaymentMethods();
    if (this.initialData) {
      this.formGroup.patchValue(this.initialData);
      this.loadPaymentMethods();
    }
  }

  setupForm(): void {
    // Campaign visibility and permissions
    this.formGroup.addControl('is_public', this.fb.control(true));
    this.formGroup.addControl('allow_anonymous_contributions', this.fb.control(true));
    this.formGroup.addControl('include_pledges', this.fb.control(true));
    this.formGroup.addControl('send_thank_you_messages', this.fb.control(true));
    this.formGroup.addControl('allow_comments', this.fb.control(true));

    // Invitation settings
    this.formGroup.addControl('is_invitation_only', this.fb.control(false));
    this.formGroup.addControl('auto_approve_invitees', this.fb.control(true));

    // Set default value for is_published (will be set when creating campaign)
    this.formGroup.addControl('is_published', this.fb.control(true));

    // Payment methods - create FormArray with custom validator
    const paymentMethodsArray = this.fb.array([], this.atLeastOnePaymentMethodValidator);
    this.formGroup.addControl('payment_methods', paymentMethodsArray);
  }

  loadSupportedPaymentMethods(): void {
    this.loadingPaymentMethods = true;
    this.createCampaignService.getSupportedPaymentMethods().subscribe({
      next: (methods) => {
        this.supportedPaymentMethods = methods.filter(method => method.is_active);
        this.loadingPaymentMethods = false;
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.loadingPaymentMethods = false;
        // Fallback to default payment methods
        this.supportedPaymentMethods = [
          { id: 'mtn', name: 'MTN Mobile Money', description: 'Pay using MTN Mobile Money', is_active: true },
          { id: 'airtel', name: 'Airtel Money', description: 'Pay using Airtel Money', is_active: true },
          { id: 'bank', name: 'Bank Transfer', description: 'Direct bank transfer', is_active: true },
          { id: 'cash', name: 'Cash Payment', description: 'Pay in cash', is_active: true }
        ];
      }
    });
  }

  loadPaymentMethods(): void {
    if (this.initialData && this.initialData.payment_methods) {
      const paymentMethodsArray = this.formGroup.get('payment_methods') as FormArray;
      this.initialData.payment_methods.forEach((method: ICampaignPaymentMethod) => {
        paymentMethodsArray.push(this.createPaymentMethodGroup(method.id, method.account_name, method.account_number));
      });
    }
  }

  get paymentMethodsArray(): FormArray {
    return this.formGroup.get('payment_methods') as FormArray;
  }

  createPaymentMethodGroup(id: string = '', accountName: string = '', accountNumber: string = ''): FormGroup {
    return this.fb.group({
      id: [id, Validators.required],
      account_name: [accountName, Validators.required],
      account_number: [accountNumber, Validators.required]
    });
  }

  addPaymentMethod(): void {
    const newMethod = this.createPaymentMethodGroup();
    this.paymentMethodsArray.push(newMethod);
  }

  addPredefinedPaymentMethod(paymentMethod: ISupportedPaymentMethod): void {
    // Check if this payment method is already added
    if (this.isPaymentMethodAdded(paymentMethod.id)) {
      return;
    }

    const newMethod = this.createPaymentMethodGroup(paymentMethod.id);
    this.paymentMethodsArray.push(newMethod);
  }

  removePaymentMethod(index: number): void {
    this.paymentMethodsArray.removeAt(index);
  }

  // Custom validator to ensure at least one payment method
  atLeastOnePaymentMethodValidator = (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    return formArray.length >= 1 ? null : { atLeastOnePaymentMethod: true };
  };

  // Get validation status for payment methods
  isPaymentMethodsValid(): boolean {
    return this.paymentMethodsArray.length > 0 && this.paymentMethodsArray.valid;
  }

  // Privacy level helpers
  getPrivacyLevel(): string {
    const isPublic = this.formGroup.get('is_public')?.value;
    const isInvitationOnly = this.formGroup.get('is_invitation_only')?.value;

    if (isInvitationOnly) return 'Private (Invitation Only)';
    if (isPublic) return 'Public';
    return 'Unlisted';
  }

  getPrivacyDescription(): string {
    const isPublic = this.formGroup.get('is_public')?.value;
    const isInvitationOnly = this.formGroup.get('is_invitation_only')?.value;

    if (isInvitationOnly) {
      return 'Only people you invite can view and contribute to this campaign.';
    }
    if (isPublic) {
      return 'Anyone can find and contribute to this campaign through search.';
    }
    return 'Only people with the direct link can view and contribute.';
  }

  // Get payment method name by ID
  getPaymentMethodName(id: string): string {
    const method = this.supportedPaymentMethods.find(m => m.id === id);
    return method ? method.name : 'Unknown Payment Method';
  }

  // Form validation helpers
  getPaymentMethodError(index: number, field: string): string | null {
    const paymentMethod = this.paymentMethodsArray.at(index);
    const control = paymentMethod.get(field);

    if (control?.invalid && (control?.dirty || control?.touched)) {
      if (control.errors?.['required']) {
        const fieldLabels: { [key: string]: string } = {
          'id': 'Payment method',
          'account_name': 'Account name',
          'account_number': 'Account number'
        };
        return `${fieldLabels[field] || field} is required`;
      }
    }
    return null;
  }

  // Check if payment method type is already added
  isPaymentMethodAdded(methodId: string): boolean {
    return this.paymentMethodsArray.value.some((method: ICampaignPaymentMethod) => method.id === methodId);
  }

  getFileSize(file: File): string {
    const bytes = file.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return Math.round(size * 100) / 100 + ' ' + sizes[i];
  }
}
