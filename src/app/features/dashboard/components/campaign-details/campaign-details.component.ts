import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {AuthService} from '../../../../core/services';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent
  ]
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
    this.formGroup.addControl('eventDate', this.fb.control('', [
      Validators.required,
      this.futureDateValidator.bind(this)
    ]));

    this.formGroup.addControl('location', this.fb.control('', [
      Validators.required,
      Validators.maxLength(200)
    ]));

    this.formGroup.addControl('massDetails', this.fb.control('', [
      Validators.maxLength(500)
    ]));

    this.formGroup.addControl('celebrant', this.fb.control('', [
      Validators.maxLength(100)
    ]));

    this.formGroup.addControl('coordinatorName', this.fb.control('', [
      Validators.required,
      Validators.maxLength(100)
    ]));

    this.formGroup.addControl('coordinatorEmail', this.fb.control('', [
      Validators.required,
      Validators.email
    ]));

    this.formGroup.addControl('coordinatorPhone', this.fb.control('', [
      Validators.required,
      Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$')
    ]));
  }

  loadUserData(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      // Pre-fill coordinator information with current user data
      if (user && !this.initialData) {
        this.formGroup.patchValue({
          coordinatorName: user.display_name || '',
          coordinatorEmail: user.email || '',
          coordinatorPhone: user.phone_number || ''
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
    const dateValue = this.formGroup.get('eventDate')?.value;
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
    const dateValue = this.formGroup.get('eventDate')?.value;
    if (!dateValue) return 0;

    const eventDate = new Date(dateValue);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  // Auto-fill location suggestions (could be enhanced with a location service)
  locationSuggestions = [
    'Kampala, Uganda',
    'Entebbe, Uganda',
    'Jinja, Uganda',
    'Mbarara, Uganda',
    'Gulu, Uganda',
    'Lira, Uganda',
    'Masaka, Uganda',
    'Soroti, Uganda'
  ];

  // Mass/Event type suggestions
  eventTypeSuggestions = [
    'Wedding Mass',
    'Funeral Mass',
    'Memorial Service',
    'Thanksgiving Mass',
    'Birthday Celebration',
    'Graduation Ceremony',
    'Community Event',
    'Charity Event',
    'Medical Treatment',
    'Educational Project'
  ];
}
