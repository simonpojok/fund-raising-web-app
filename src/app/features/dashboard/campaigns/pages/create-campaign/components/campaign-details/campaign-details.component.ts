import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  standalone: false,
})
export class CampaignDetailsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() initialData: any = null;

  selectedVideoFile: File | null = null;
  videoPreview: string | null = null;
  minDate: string = '';
  maxDate: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setupDateLimits();
    this.setupForm();

    if (this.initialData) {
      this.formGroup.patchValue(this.initialData);
    }
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

  setupForm(): void {
    this.formGroup.addControl('end_date', this.fb.control('', [
      Validators.required,
      this.futureDateValidator.bind(this)
    ]));

    // Optional video file
    this.formGroup.addControl('video', this.fb.control(null));
  }

  // Custom validator for future dates
  futureDateValidator(control: any) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return { pastDate: true };
    }

    return null;
  }

  // Handle video file selection
  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file.');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video size must be less than 50MB.');
        return;
      }

      this.selectedVideoFile = file;
      this.formGroup.get('video')?.setValue(file);

      // Create preview URL
      this.videoPreview = URL.createObjectURL(file);
    }
  }

  // Remove video
  removeVideo(): void {
    if (this.videoPreview) {
      URL.revokeObjectURL(this.videoPreview);
      this.videoPreview = null;
    }
    this.selectedVideoFile = null;
    this.formGroup.get('video')?.setValue(null);
  }

  // Get formatted date for display
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}
