import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreateCampaignService} from '../../services/create-campaign.service';
import {ISupportCampaignCategory} from '../../interfaces/support_category.interface';

@Component({
  selector: 'app-campaign-basic-info',
  templateUrl: './campaign-basic-info.component.html',
  standalone: false,
})
export class CampaignBasicInfoComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() initialData: any = null;

  categories: ISupportCampaignCategory[] = [];
  loadingCategories = false;
  selectedBanner: File | null = null;
  selectedVideo: File | null = null;
  bannerPreview: string | null = null;
  videoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private createCampaignService: CreateCampaignService
  ) {}

  ngOnInit(): void {
    this.setupForm();
    this.loadCategories();
    if (this.initialData) {
      this.formGroup.patchValue(this.initialData);
      if (this.initialData.target_amount) {
        this.updateAmountDisplay(this.initialData.target_amount);
      }
    }
  }

  setupForm(): void {
    this.formGroup.addControl('title', this.fb.control('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200)
    ]));

    this.formGroup.addControl('description', this.fb.control('', [
      Validators.required,
      Validators.minLength(50),
      Validators.maxLength(2000)
    ]));

    this.formGroup.addControl('target_amount', this.fb.control('', [
      Validators.required,
      Validators.min(10000),
      this.numberValidator
    ]));

    this.formGroup.addControl('category', this.fb.control('', [
      Validators.required
    ]));

    this.formGroup.addControl('is_urgent', this.fb.control(false));

    // File upload controls
    this.formGroup.addControl('banner', this.fb.control(null));
    this.formGroup.addControl('video', this.fb.control(null));
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.createCampaignService.getCampaignCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
        // Fallback to default categories
        this.categories = [
          { id: 'education', name: 'Education', description: 'Educational campaigns' },
          { id: 'healthcare', name: 'Healthcare', description: 'Health and medical campaigns' },
          { id: 'community', name: 'Community Project', description: 'Community development' },
          { id: 'religious', name: 'Religious', description: 'Religious activities' },
          { id: 'personal', name: 'Personal', description: 'Personal fundraising' },
          { id: 'emergency', name: 'Emergency', description: 'Emergency and disaster relief' },
          { id: 'other', name: 'Other', description: 'Other purposes' }
        ];
      }
    });
  }

  numberValidator(control: any) {
    const value = control.value;
    if (value && isNaN(Number(value))) {
      return { invalidNumber: true };
    }
    return null;
  }

  // Format currency display with commas
  formatCurrency(value: string | number): string {
    if (!value) return '0';
    const num = typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, '')) : value;
    return new Intl.NumberFormat('en-UG').format(num);
  }

  // Handle amount input formatting
  onAmountInput(event: any): void {
    const input = event.target;
    let value = input.value.replace(/[^\d]/g, '');

    if (value) {
      input.value = this.formatCurrency(value);
      this.formGroup.get('target_amount')?.setValue(Number(value), { emitEvent: false });
    } else {
      input.value = '';
      this.formGroup.get('target_amount')?.setValue(null, { emitEvent: false });
    }
  }

  updateAmountDisplay(value: string | number): void {
    const targetAmountInput = document.getElementById('target_amount') as HTMLInputElement;
    if (targetAmountInput) {
      targetAmountInput.value = this.formatCurrency(value);
    }
  }

  // Handle banner upload
  onBannerSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for the banner.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Banner file size should not exceed 5MB.');
        return;
      }

      this.selectedBanner = file;
      this.formGroup.get('banner')?.setValue(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bannerPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle video upload
  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file.');
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file size should not exceed 100MB.');
        return;
      }

      this.selectedVideo = file;
      this.formGroup.get('video')?.setValue(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove banner
  removeBanner(): void {
    this.selectedBanner = null;
    this.bannerPreview = null;
    this.formGroup.get('banner')?.setValue(null);
    const bannerInput = document.getElementById('banner') as HTMLInputElement;
    if (bannerInput) {
      bannerInput.value = '';
    }
  }

  // Remove video
  removeVideo(): void {
    this.selectedVideo = null;
    this.videoPreview = null;
    this.formGroup.get('video')?.setValue(null);
    const videoInput = document.getElementById('video') as HTMLInputElement;
    if (videoInput) {
      videoInput.value = '';
    }
  }

  // Character count for description
  getDescriptionCount(): number {
    const description = this.formGroup.get('description')?.value || '';
    return description.length;
  }

  getDescriptionCountClass(): string {
    const count = this.getDescriptionCount();
    const max = 2000;

    if (count > max * 0.9) return 'text-danger-600';
    if (count > max * 0.7) return 'text-warning-600';
    return 'text-gray-500 dark:text-gray-400';
  }

  // Get category name by id
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }
}
