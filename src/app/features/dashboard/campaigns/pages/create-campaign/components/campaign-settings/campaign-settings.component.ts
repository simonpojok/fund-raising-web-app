import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {CreateCampaignService} from '../../services/create-campaign.service';
import {ICampaignPaymentMethod} from '../../interfaces/campaign_payment_method.interface';
import {ISupportedPaymentMethod} from '../../interfaces/supported_payment_method.interface';

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
  ) {
  }

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

    // Published status
    this.formGroup.addControl('is_published', this.fb.control(true));

    // Payment methods
    this.formGroup.addControl('payment_methods', this.fb.array([]));
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
      }
    });
  }

  loadPaymentMethods(): void {
    if (this.initialData && this.initialData.payment_methods) {
      const paymentMethodsArray = this.formGroup.get('payment_methods') as FormArray;
      this.initialData.payment_methods.forEach((method: ICampaignPaymentMethod) => {
        paymentMethodsArray.push(this.createPaymentMethodGroup(method));
      });
    }
  }

  get paymentMethodsArray(): FormArray {
    return this.formGroup.get('payment_methods') as FormArray;
  }

  createPaymentMethodGroup(method: Partial<ICampaignPaymentMethod> = {}): FormGroup {
    return this.fb.group({
      id: [method.id || '', Validators.required],
      account_name: [method.account_name || '', Validators.required],
      account_number: [method.account_number || '', Validators.required]
    });
  }

  addPaymentMethod(methodId?: string): void {
    const newMethod = methodId ? {id: methodId} : {};
    this.paymentMethodsArray.push(this.createPaymentMethodGroup(newMethod));
  }

  removePaymentMethod(index: number): void {
    this.paymentMethodsArray.removeAt(index);
  }

  getPaymentMethodName(id: string): string {
    const method = this.supportedPaymentMethods.find(m => m.id === id);
    return method ? method.name : id;
  }

  // Get validation status for different sections
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

  // Form validation helpers
  getPaymentMethodError(index: number, field: string): string | null {
    const paymentMethod = this.paymentMethodsArray.at(index);
    const control = paymentMethod.get(field);

    if (control?.invalid && (control?.dirty || control?.touched)) {
      if (control.errors?.['required']) {
        switch (field) {
          case 'id':
            return 'Payment method type is required';
          case 'account_name':
            return 'Account name is required';
          case 'account_number':
            return 'Account number is required';
          default:
            return 'This field is required';
        }
      }
    }
    return null;
  }
}
