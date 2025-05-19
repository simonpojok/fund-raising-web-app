import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ISupportCampaignCategory } from '../../interfaces/support_category.interface';

@Component({
  selector: 'app-basic-info-card',
  templateUrl: './basic-info-card.component.html',
  styleUrls: ['./basic-info-card.component.scss'],
  standalone: false,
})
export class BasicInfoCardComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() categories: ISupportCampaignCategory[] = [];
  @Input() loadingCategories = false;
  @Input() bannerPreview: string | null = null;
  @Input() videoPreview: string | null = null;
  @Input() selectedBanner: File | null = null;
  @Input() selectedVideo: File | null = null;

  @Output() amountInput = new EventEmitter<any>();
  @Output() bannerSelected = new EventEmitter<File>();
  @Output() videoSelected = new EventEmitter<File>();
  @Output() bannerRemoved = new EventEmitter<void>();
  @Output() videoRemoved = new EventEmitter<void>();

  @ViewChild('bannerUpload') bannerUploadInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoUpload') videoUploadInput!: ElementRef<HTMLInputElement>;

  minDate: string = '';
  maxDate: string = '';

  ngOnInit(): void {
    this.setupDateLimits();
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

  onAmountInput(event: any): void {
    this.amountInput.emit(event);
  }

  onBannerChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.bannerSelected.emit(file);
    }
  }

  onVideoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.videoSelected.emit(file);
    }
  }

  removeBanner(): void {
    this.bannerRemoved.emit();
  }

  removeVideo(): void {
    this.videoRemoved.emit();
  }

  // Method to trigger banner file input
  triggerBannerUpload(): void {
    this.bannerUploadInput.nativeElement.click();
  }

  // Method to trigger video file input
  triggerVideoUpload(): void {
    this.videoUploadInput.nativeElement.click();
  }

  // Character count for description
  getDescriptionCount(): number {
    const description = this.formGroup.get('description')?.value || '';
    return description.length;
  }

  getDescriptionCountClass(): string {
    const count = this.getDescriptionCount();
    const max = 2000;

    if (count > max * 0.9) return 'text-red-600 dark:text-red-400';
    if (count > max * 0.7) return 'text-amber-600 dark:text-amber-400';
    return 'text-gray-500 dark:text-gray-400';
  }

  // Format date for display
  getFormattedDate(): string {
    const dateValue = this.formGroup.get('end_date')?.value;
    if (!dateValue) return '';

    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get days until event
  getDaysUntilEvent(): number {
    const dateValue = this.formGroup.get('end_date')?.value;
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
}
