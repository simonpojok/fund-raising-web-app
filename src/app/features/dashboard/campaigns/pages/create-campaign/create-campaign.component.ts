import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateCampaignService } from './services/create-campaign.service';
import { AuthService } from '../../../../../core/services';
import { ISupportCampaignCategory } from './interfaces/support_category.interface';
import { ISupportedPaymentMethod } from './interfaces/supported_payment_method.interface';
import { CreateCampaignRequest } from './interfaces/create-campaign-request.interface';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss'],
  standalone: false,
})
export class CreateCampaignComponent implements OnInit {
  currentStep = 1;
  totalSteps = 2;
  isLoading = false;
  isSaving = false;
  campaignCreated = false;

  campaignForm!: FormGroup;
  basicInfoFormGroup!: FormGroup;
  settingsFormGroup!: FormGroup;

  errorMessage = '';
  successMessage = '';

  // Data from API
  categories: ISupportCampaignCategory[] = [];
  supportedPaymentMethods: ISupportedPaymentMethod[] = [];
  loadingCategories = false;
  loadingPaymentMethods = false;

  // Current user
  currentUser: any = null;

  // File uploads
  selectedBanner: File | null = null;
  selectedVideo: File | null = null;
  bannerPreview: string | null = null;
  videoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private createCampaignService: CreateCampaignService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadData();
    this.loadUser();
  }

  initializeForms(): void {
    // Basic Information Form
    this.basicInfoFormGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2000)]],
      target_amount: ['', [Validators.required, Validators.min(10000)]],
      category: ['', [Validators.required]],
      is_urgent: [false],
      end_date: ['', [Validators.required, this.futureDateValidator]],
      banner: [null],
      video: [null]
    });

    // Settings Form
    this.settingsFormGroup = this.fb.group({
      is_public: [true],
      include_pledges: [true],
      allow_anonymous_contributions: [true],
      send_thank_you_messages: [true],
      allow_comments: [true],
      is_invitation_only: [false],
      auto_approve_invitees: [true],
      payment_methods: this.fb.array([], [Validators.required, this.atLeastOnePaymentMethodValidator])
    });

    // Main campaign form that combines both
    this.campaignForm = this.fb.group({
      basicInfo: this.basicInfoFormGroup,
      settings: this.settingsFormGroup,
      coordinator: ['', [Validators.required]], // Will be set automatically
      is_published: [true]
    });
  }

  loadData(): void {
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
        this.errorMessage = 'Failed to load categories. Please refresh the page.';
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

  loadUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.campaignForm.patchValue({
          coordinator: user.id
        });
      }
    });
  }

  // Custom validators
  futureDateValidator = (control: any) => {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return { futureDate: true };
    }

    return null;
  };

  atLeastOnePaymentMethodValidator = (control: any) => {
    const formArray = control as FormArray;
    return formArray.length >= 1 ? null : { atLeastOnePaymentMethod: true };
  };

  // Step navigation
  nextStep(): void {
    if (this.currentStep === 1 && this.isStep1Valid()) {
      this.currentStep = 2;
      this.errorMessage = '';
    } else if (this.currentStep === 2 && this.isStep2Valid()) {
      this.createCampaign();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  isStep1Valid(): boolean {
    this.basicInfoFormGroup.markAllAsTouched();
    return this.basicInfoFormGroup.valid;
  }

  isStep2Valid(): boolean {
    this.settingsFormGroup.markAllAsTouched();
    const paymentMethods = this.getPaymentMethodsArray();
    return this.settingsFormGroup.valid && paymentMethods.length > 0;
  }

  isFormValid(): boolean {
    return this.campaignForm.valid &&
      this.basicInfoFormGroup.valid &&
      this.settingsFormGroup.valid &&
      this.getPaymentMethodsArray().length > 0;
  }

  // Payment methods management
  getPaymentMethodsArray(): FormArray {
    return this.settingsFormGroup.get('payment_methods') as FormArray;
  }

  addPaymentMethod(): void {
    const paymentMethodGroup = this.fb.group({
      id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      account_number: ['', [Validators.required]]
    });
    this.getPaymentMethodsArray().push(paymentMethodGroup);
  }

  removePaymentMethod(index: number): void {
    this.getPaymentMethodsArray().removeAt(index);
  }

  addPredefinedPaymentMethod(method: ISupportedPaymentMethod): void {
    if (this.isPaymentMethodAdded(method.id)) {
      return;
    }

    const paymentMethodGroup = this.fb.group({
      id: [method.id, [Validators.required]],
      account_name: ['', [Validators.required]],
      account_number: ['', [Validators.required]]
    });
    this.getPaymentMethodsArray().push(paymentMethodGroup);
  }

  isPaymentMethodAdded(methodId: string): boolean {
    return this.getPaymentMethodsArray().value.some((method: any) => method.id === methodId);
  }

  getPaymentMethodName(id: string): string {
    const method = this.supportedPaymentMethods.find(m => m.id === id);
    return method ? method.name : 'Unknown';
  }

  // File upload handlers
  onBannerSelected(file: File): void {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file for the banner.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Banner file size should not exceed 5MB.');
      return;
    }

    this.selectedBanner = file;
    this.basicInfoFormGroup.patchValue({ banner: file });

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.bannerPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onVideoSelected(file: File): void {
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('Video file size should not exceed 100MB.');
      return;
    }

    this.selectedVideo = file;
    this.basicInfoFormGroup.patchValue({ video: file });

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.videoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeBanner(): void {
    this.selectedBanner = null;
    this.bannerPreview = null;
    this.basicInfoFormGroup.patchValue({ banner: null });
  }

  removeVideo(): void {
    this.selectedVideo = null;
    this.videoPreview = null;
    this.basicInfoFormGroup.patchValue({ video: null });
  }

  // Currency formatting
  formatCurrency(amount: number | string): string {
    if (!amount) return '0';
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.-]/g, '')) : amount;
    return new Intl.NumberFormat('en-US').format(num);
  }

  // Amount input handler with formatting
  onAmountInput(event: any): void {
    const input = event.target;
    let value = input.value.replace(/[^\d]/g, '');

    if (value) {
      const numericValue = parseInt(value);
      input.value = this.formatCurrency(numericValue);
      this.basicInfoFormGroup.patchValue({ target_amount: numericValue });
    } else {
      input.value = '';
      this.basicInfoFormGroup.patchValue({ target_amount: null });
    }
  }

  // Campaign creation
  createCampaign(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const campaignData = this.prepareCampaignData();

    this.createCampaignService.createCampaign(campaignData).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.campaignCreated = true;
        this.successMessage = 'Campaign created successfully!';

        // Redirect to campaign details after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard/campaigns', response.id]);
        }, 2000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error creating campaign:', error);

        if (error.error && typeof error.error === 'object') {
          // Handle validation errors
          const firstErrorField = Object.keys(error.error)[0];
          if (firstErrorField && error.error[firstErrorField][0]) {
            this.errorMessage = error.error[firstErrorField][0];
          } else {
            this.errorMessage = 'Please check the form for errors.';
          }
        } else {
          this.errorMessage = 'Failed to create campaign. Please try again.';
        }
      }
    });
  }

  prepareCampaignData(): CreateCampaignRequest {
    const basicInfo = this.basicInfoFormGroup.value;
    const settings = this.settingsFormGroup.value;

    return {
      title: basicInfo.title,
      description: basicInfo.description,
      end_date: basicInfo.end_date,
      coordinator: this.campaignForm.value.coordinator,
      target_amount: basicInfo.target_amount,
      category: basicInfo.category,
      is_urgent: basicInfo.is_urgent,
      is_public: settings.is_public,
      include_pledges: settings.include_pledges,
      allow_anonymous_contributions: settings.allow_anonymous_contributions,
      send_thank_you_messages: settings.send_thank_you_messages,
      allow_comments: settings.allow_comments,
      is_invitation_only: settings.is_invitation_only,
      auto_approve_invitees: settings.auto_approve_invitees,
      payment_methods: settings.payment_methods,
      is_published: this.campaignForm.value.is_published,
      banner: this.selectedBanner || undefined,
      video: this.selectedVideo || undefined
    };
  }

  // Save as draft
  saveDraft(): void {
    this.isSaving = true;
    const campaignData = this.prepareCampaignData();
    campaignData.is_published = false;

    this.createCampaignService.saveDraft(campaignData).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Draft saved successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error saving draft:', error);
        this.errorMessage = 'Failed to save draft. Please try again.';
      }
    });
  }

  // Cancel and navigate back
  cancel(): void {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.router.navigate(['/dashboard/campaigns']);
    }
  }

  // Utility methods
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  getCompletionPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }
}
