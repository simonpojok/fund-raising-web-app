import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../../../core/services';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  standalone: false,
})
export class CampaignDetailsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() initialData: any = null;

  currentUser: any = null;
  minDate: string = '';
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setupDateLimits();
    this.setupForm();
    this.loadUserData();

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

    // coordinator field will be set automatically from current user
    this.formGroup.addControl('coordinator', this.fb.control('', [
      Validators.required
    ]));
  }

  loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      // Automatically set coordinator to current user's ID
      if (user && !this.initialData) {
        this.formGroup.patchValue({
          coordinator: user.id
        });
      }
    });
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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
