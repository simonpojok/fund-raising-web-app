import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {CreateCampaignService} from './services/create-campaign.service';
import {AuthService} from '../../../../../core/services';
import {ISupportCampaignCategory} from './interfaces/support_category.interface';
import {ISupportedPaymentMethod} from './interfaces/supported_payment_method.interface';
import {CreateCampaignRequest} from './interfaces/create-campaign-request.interface';
import {ICampaignPaymentMethod} from './interfaces/campaign_payment_method.interface';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  standalone: false,
})
export class CreateCampaignComponent implements OnInit {
  currentStep = 1;
  totalSteps = 2; // Now only 2 steps
  isLoading = false;
  isSaving = false;
  campaignCreated = false;

  campaignForm!: FormGroup;

  // Form data for preview
  previewData: any = {};

  errorMessage = '';
  successMessage = '';

  // Categories and payment methods
  categories: ISupportCampaignCategory[] = [];
  supportedPaymentMethods: ISupportedPaymentMethod[] = [];
  loadingCategories = false;
  loadingPaymentMethods = false;

  // Media uploads
  selectedBanner: File | null = null;
  selectedVideo: File | null = null;
  bannerPreview: string | null = null;
  videoPreview: string | null = null;

  // Current user
  currentUser: any = null;

  // Date limits
  minDate: string = '';
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private createCampaignService: CreateCampaignService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setupDateLimits();
    this.initializeForm();
    this.loadData();
    this.setupRealTimePreview();
  }

  setupDateLimits(): void {
    const today = new Date();
    const maxYear = today.getFullYear() + 2;

    // Minimum date is tomorrow
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);

    this.minDate = minDate.toISOString().split('T')[0];
    this.maxDate = `${maxYear}-12-31`;
  }

  initializeForm(): void {
    this.campaignForm = this.fb.group({
      // Step 1: Basic Information & Details
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2000)]],
      target_amount: ['', [Validators.required, Validators.min(10000), this.numberValidator]],
      category: ['', [Validators.required]],
      is_urgent: [false],
      end_date: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      coordinator: ['', [Validators.required]],
      banner: [null],
      video: [null],

      // Step 2: Settings & Payment Methods
      is_public: [true],
      allow_anonymous_contributions: [true],
      include_pledges: [true],
      send_thank_you_messages: [true],
      allow_comments: [true],
      is_invitation_only: [false],
      auto_approve_invitees: [true],
      is_published: [true],
      payment_methods: this.fb.array([], this.atLeastOnePaymentMethodValidator)
    });
  }

  loadData(): void {
    // Load user data
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.campaignForm.patchValue({
          coordinator: user.id
        });
      }
    });

    // Load categories
    this.loadingCategories = true;
    this.createCampaignService.getCampaignCategories().subscribe({
      next: (response) => {
        this.categories = response.results;
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
      }
    });

    // Load payment methods
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

  setupRealTimePreview(): void {
    // Subscribe to form changes for real-time preview updates
    this.campaignForm.valueChanges.subscribe(formValue => {
      this.updatePreviewData(formValue);
    });

    // Initial preview data
    this.updatePreviewData(this.campaignForm.value);
  }

  updatePreviewData(formValue: any): void {
    this.previewData = {
      ...formValue,
      coordinatorName: this.currentUser?.display_name || '',
      coordinatorEmail: this.currentUser?.email || '',
      coordinatorPhone: this.currentUser?.phone_number || '',
      paymentMethods: formValue.payment_methods || [],
      // Add category name for display
      categoryName: this.getCategoryName(formValue.category)
    };
  }

  // Validators
  numberValidator = (control: any) => {
    const value = control.value;
    if (value && isNaN(Number(value))) {
      return {invalidNumber: true};
    }
    return null;
  };

  futureDateValidator = (control: any) => {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return { pastDate: true };
    }

    return null;
  };

  atLeastOnePaymentMethodValidator = (control: any) => {
    const formArray = control as FormArray;
    return formArray.length >= 1 ? null : { atLeastOnePaymentMethod: true };
  };

  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.currentStep++;
      this.errorMessage = '';
    } else if (this.currentStep === this.totalSteps && this.isCurrentStepValid()) {
      this.createCampaign();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  // Form validation
  isCurrentStepValid(): boolean {
    if (this.currentStep === 1) {
      // Check step 1 fields
      const step1Fields = ['title', 'description', 'target_amount', 'category', 'end_date', 'coordinator'];
      for (const field of step1Fields) {
        const control = this.campaignForm.get(field);
        if (control && control.invalid) {
          control.markAsTouched();
          return false;
        }
      }
      return true;
    } else if (this.currentStep === 2) {
      // Check if payment methods are valid
      const paymentMethods = this.campaignForm.get('payment_methods') as FormArray;
      if (paymentMethods.length === 0) {
        return false;
      }
      return paymentMethods.valid;
    }
    return true;
  }

  isFormValid(): boolean {
    return this.campaignForm.valid && this.getPaymentMethodsArray().length > 0;
  }

  // Media handling
  onBannerSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for the banner.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Banner file size should not exceed 5MB.');
        return;
      }

      this.selectedBanner = file;
      this.campaignForm.get('banner')?.setValue(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bannerPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file.');
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        alert('Video file size should not exceed 100MB.');
        return;
      }

      this.selectedVideo = file;
      this.campaignForm.get('video')?.setValue(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeBanner(): void {
    this.selectedBanner = null;
    this.bannerPreview = null;
    this.campaignForm.get('banner')?.setValue(null);
    const bannerInput = document.getElementById('banner') as HTMLInputElement;
    if (bannerInput) {
      bannerInput.value = '';
    }
  }

  removeVideo(): void {
    this.selectedVideo = null;
    this.videoPreview = null;
    this.campaignForm.get('video')?.setValue(null);
    const videoInput = document.getElementById('video') as HTMLInputElement;
    if (videoInput) {
      videoInput.value = '';
    }
  }

  // Amount formatting
  formatCurrency(value: string | number): string {
    if (!value) return '0';
    const num = typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, '')) : value;
    return new Intl.NumberFormat('en-UG').format(num);
  }

  onAmountInput(event: any): void {
    const input = event.target;
    let value = input.value.replace(/[^\d]/g, '');

    if (value) {
      input.value = this.formatCurrency(value);
      this.campaignForm.get('target_amount')?.setValue(Number(value), {emitEvent: false});
    } else {
      input.value = '';
      this.campaignForm.get('target_amount')?.setValue(null, {emitEvent: false});
    }
  }

  // Payment methods
  getPaymentMethodsArray(): FormArray {
    return this.campaignForm.get('payment_methods') as FormArray;
  }

  addPaymentMethod(): void {
    const newMethod = this.fb.group({
      id: ['', Validators.required],
      account_name: ['', Validators.required],
      account_number: ['', Validators.required]
    });
    this.getPaymentMethodsArray().push(newMethod);
  }

  addPredefinedPaymentMethod(paymentMethod: ISupportedPaymentMethod): void {
    if (this.isPaymentMethodAdded(paymentMethod.id)) {
      return;
    }

    const newMethod = this.fb.group({
      id: [paymentMethod.id, Validators.required],
      account_name: ['', Validators.required],
      account_number: ['', Validators.required]
    });
    this.getPaymentMethodsArray().push(newMethod);
  }

  removePaymentMethod(index: number): void {
    this.getPaymentMethodsArray().removeAt(index);
  }

  isPaymentMethodAdded(methodId: string): boolean {
    return this.getPaymentMethodsArray().value.some((method: ICampaignPaymentMethod) => method.id === methodId);
  }

  getPaymentMethodName(id: string): string {
    const method = this.supportedPaymentMethods.find(m => m.id === id);
    return method ? method.name : 'Unknown Payment Method';
  }

  getPaymentMethodError(index: number, field: string): string | null {
    const paymentMethod = this.getPaymentMethodsArray().at(index);
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

  // Campaign submission
  createCampaign(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const campaignData = this.prepareCampaignData();

    const validation = this.createCampaignService.validateCampaignData(campaignData);
    if (!validation.isValid) {
      this.isSaving = false;
      this.errorMessage = validation.errors[0];
      return;
    }

    this.createCampaignService.createCampaign(campaignData).subscribe({
      next: (campaign) => {
        this.isSaving = false;
        this.campaignCreated = true;
        this.successMessage = 'Campaign created successfully!';

        setTimeout(async () => {
          await this.router.navigate(['/dashboard/campaigns', campaign.id]);
        }, 3000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error creating campaign:', error);

        if (error.error && typeof error.error === 'object') {
          const firstErrorField = Object.keys(error.error)[0];
          if (firstErrorField && error.error[firstErrorField][0]) {
            this.errorMessage = error.error[firstErrorField][0];
          } else {
            this.errorMessage = 'Please check the form for errors.';
          }
        } else {
          this.errorMessage = 'An error occurred while creating the campaign. Please try again.';
        }
      }
    });
  }

  prepareCampaignData(): CreateCampaignRequest {
    const formValue = this.campaignForm.value;
    return {
      title: formValue.title,
      description: formValue.description,
      end_date: formValue.end_date,
      coordinator: formValue.coordinator,
      target_amount: formValue.target_amount,
      category: formValue.category,
      is_urgent: formValue.is_urgent,
      is_public: formValue.is_public,
      include_pledges: formValue.include_pledges,
      allow_anonymous_contributions: formValue.allow_anonymous_contributions,
      send_thank_you_messages: formValue.send_thank_you_messages,
      allow_comments: formValue.allow_comments,
      is_invitation_only: formValue.is_invitation_only,
      auto_approve_invitees: formValue.auto_approve_invitees,
      payment_methods: formValue.payment_methods,
      is_published: formValue.is_published,
      banner: this.selectedBanner || undefined,
      video: this.selectedVideo || undefined
    };
  }

  // Save as draft
  saveDraft(): void {
    this.isSaving = true;
    this.errorMessage = '';

    const campaignData = this.prepareCampaignData();
    campaignData.is_published = false;

    this.createCampaignService.saveDraft(campaignData).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Draft saved successfully!';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error saving draft:', error);
        this.errorMessage = 'Failed to save draft. Please try again.';
      }
    });
  }

  // Cancel campaign creation
  cancel(): void {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Utility methods
  getCompletionPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  getDescriptionCount(): number {
    const description = this.campaignForm.get('description')?.value || '';
    return description.length;
  }

  getDescriptionCountClass(): string {
    const count = this.getDescriptionCount();
    const max = 2000;

    if (count > max * 0.9) return 'text-danger-600';
    if (count > max * 0.7) return 'text-warning-600';
    return 'text-gray-500 dark:text-gray-400';
  }

  getFormattedDate(): string {
    const dateValue = this.campaignForm.get('end_date')?.value;
    if (!dateValue) return '';

    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDaysUntilEvent(): number {
    const dateValue = this.campaignForm.get('end_date')?.value;
    if (!dateValue) return 0;

    const eventDate = new Date(dateValue);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getFileSize(file: File): string {
    const bytes = file.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return Math.round(size * 100) / 100 + ' ' + sizes[i];
  }

  getPrivacyLevel(): string {
    const isPublic = this.campaignForm.get('is_public')?.value;
    const isInvitationOnly = this.campaignForm.get('is_invitation_only')?.value;

    if (isInvitationOnly) return 'Private (Invitation Only)';
    if (isPublic) return 'Public';
    return 'Unlisted';
  }

  getPrivacyDescription(): string {
    const isPublic = this.campaignForm.get('is_public')?.value;
    const isInvitationOnly = this.campaignForm.get('is_invitation_only')?.value;

    if (isInvitationOnly) {
      return 'Only people you invite can view and contribute to this campaign.';
    }
    if (isPublic) {
      return 'Anyone can find and contribute to this campaign through search.';
    }
    return 'Only people with the direct link can view and contribute.';
  }
}
