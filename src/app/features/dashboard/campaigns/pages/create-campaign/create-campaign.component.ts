import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreateCampaignService} from './services/create-campaign.service';

export interface CampaignFormData {
  basicInfo: any;
  details: any;
  settings: any;
}

export interface StepperStep {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  standalone: false,
})
export class CreateCampaignComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  isLoading = false;
  isSaving = false;

  campaignForm!: FormGroup;
  formData: CampaignFormData = {
    basicInfo: null,
    details: null,
    settings: null
  };

  errorMessage = '';
  successMessage = '';

  steps: StepperStep[] = [
    {id: 1, title: 'Basic Information', description: 'Campaign title, description, and goals'},
    {id: 2, title: 'Campaign Details', description: 'Event date, location, and organizer info'},
    {id: 3, title: 'Settings & Permissions', description: 'Privacy settings and payment methods'},
    {id: 4, title: 'Review & Publish', description: 'Review your campaign before publishing'}
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private createCampaignService: CreateCampaignService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.campaignForm = this.fb.group({
      basicInfo: this.fb.group({}),
      details: this.fb.group({}),
      settings: this.fb.group({})
    });
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.saveCurrentStepData();
      this.currentStep++;
      this.errorMessage = '';
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.canNavigateToStep(step)) {
      this.saveCurrentStepData();
      this.currentStep = step;
      this.errorMessage = '';
    }
  }

  // Form validation
  isCurrentStepValid(): boolean {
    const currentFormGroup = this.getCurrentFormGroup();
    if (currentFormGroup) {
      currentFormGroup.markAllAsTouched();
      return currentFormGroup.valid;
    }
    return true;
  }

  canNavigateToStep(step: number): boolean {
    // Allow navigation to previous steps or if all previous steps are valid
    if (step <= this.currentStep) return true;

    for (let i = 1; i < step; i++) {
      if (!this.isStepValid(i)) return false;
    }
    return true;
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return this.campaignForm.get('basicInfo')?.valid || false;
      case 2:
        return this.campaignForm.get('details')?.valid || false;
      case 3:
        return this.campaignForm.get('settings')?.valid || false;
      default:
        return true;
    }
  }

  getCurrentFormGroup(): FormGroup | null {
    switch (this.currentStep) {
      case 1:
        return this.campaignForm.get('basicInfo') as FormGroup;
      case 2:
        return this.campaignForm.get('details') as FormGroup;
      case 3:
        return this.campaignForm.get('settings') as FormGroup;
      default:
        return null;
    }
  }

  saveCurrentStepData(): void {
    switch (this.currentStep) {
      case 1:
        this.formData.basicInfo = this.campaignForm.get('basicInfo')?.value;
        break;
      case 2:
        this.formData.details = this.campaignForm.get('details')?.value;
        break;
      case 3:
        this.formData.settings = this.campaignForm.get('settings')?.value;
        break;
    }
  }

  // Campaign submission
  createCampaign(): void {
    this.saveCurrentStepData();

    if (!this.isFormValid()) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const campaignData = this.prepareCampaignData();

    // Validate data before submitting
    const validation = this.createCampaignService.validateCampaignData(campaignData);
    if (!validation.isValid) {
      this.isSaving = false;
      this.errorMessage = validation.errors[0];
      return;
    }

    this.createCampaignService.createCampaign(campaignData).subscribe({
      next: (campaign) => {
        this.isSaving = false;
        this.successMessage = 'Campaign created successfully!';

        // Redirect to campaign dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard/campaigns', campaign.id]);
        }, 2000);
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

  isFormValid(): boolean {
    return this.campaignForm.valid &&
      this.formData.basicInfo &&
      this.formData.details &&
      this.formData.settings;
  }

  prepareCampaignData(): any {
    return {
      ...this.formData.basicInfo,
      ...this.formData.details,
      ...this.formData.settings,
      createdAt: new Date().toISOString()
    };
  }

  // Save as draft
  saveDraft(): void {
    this.saveCurrentStepData();
    this.isSaving = true;
    this.errorMessage = '';

    const draftData = {
      ...this.prepareCampaignData(),
      isDraft: true
    };

    this.createCampaignService.saveDraft(draftData).subscribe({
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

  // Get completion percentage
  getCompletionPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  get basicInfoFormGroup(): FormGroup {
    return this.campaignForm.get('basicInfo') as FormGroup;
  }

  get detailsFormGroup(): FormGroup {
    return this.campaignForm.get('details') as FormGroup;
  }

  get settingsFormGroup(): FormGroup {
    return this.campaignForm.get('settings') as FormGroup;
  }
}
