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
  selectedBannerFile: File | null = null;
  bannerPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private createCampaignService: CreateCampaignService
  ) {
  }

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
      Validators.maxLength(100)
    ]));

    this.formGroup.addControl('description', this.fb.control('', [
      Validators.required,
      Validators.minLength(50),
      Validators.maxLength(1000)
    ]));

    this.formGroup.addControl('coordinator', this.fb.control('', [
      Validators.required,
      Validators.maxLength(100)
    ]));

    this.formGroup.addControl('target_amount', this.fb.control('', [
      Validators.required,
      Validators.min(10000),
      Validators.pattern('^[0-9]*$')
    ]));

    this.formGroup.addControl('category', this.fb.control('', [
      Validators.required
    ]));

    this.formGroup.addControl('is_urgent', this.fb.control(false));

    // Optional banner file
    this.formGroup.addControl('banner', this.fb.control(null));
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.createCampaignService.getSupportedCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
      }
    });
  }

  // Handle banner file selection
  onBannerSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB.');
        return;
      }

      this.selectedBannerFile = file;
      this.formGroup.get('banner')?.setValue(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.bannerPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove banner
  removeBanner(): void {
    this.selectedBannerFile = null;
    this.bannerPreview = null;
    this.formGroup.get('banner')?.setValue(null);
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
      const formattedValue = this.formatCurrency(value);
      input.value = formattedValue;
      this.formGroup.get('target_amount')?.setValue(parseInt(value), {emitEvent: false});
    } else {
      input.value = '';
      this.formGroup.get('target_amount')?.setValue('', {emitEvent: false});
    }
  }

  updateAmountDisplay(value: string | number): void {
    // This will be handled by the template binding
  }

  // Character count for description
  getDescriptionCount(): number {
    const description = this.formGroup.get('description')?.value || '';
    return description.length;
  }

  getDescriptionCountClass(): string {
    const count = this.getDescriptionCount();
    const max = 1000;

    if (count > max * 0.9) return 'text-danger-600';
    if (count > max * 0.7) return 'text-warning-600';
    return 'text-gray-500 dark:text-gray-400';
  }
}
