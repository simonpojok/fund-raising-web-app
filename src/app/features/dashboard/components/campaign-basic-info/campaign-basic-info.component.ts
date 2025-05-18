import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-campaign-basic-info',
  templateUrl: './campaign-basic-info.component.html',
  standalone: false,
})
export class CampaignBasicInfoComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() initialData: any = null;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.setupForm();
    if (this.initialData) {
      this.formGroup.patchValue(this.initialData);
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

    this.formGroup.addControl('beneficiary', this.fb.control('', [
      Validators.required,
      Validators.maxLength(100)
    ]));

    this.formGroup.addControl('targetAmount', this.fb.control('', [
      Validators.required,
      Validators.min(10000), // Minimum 10,000 UGX
      Validators.pattern('^[0-9]*$')
    ]));

    this.formGroup.addControl('category', this.fb.control('', [
      Validators.required
    ]));

    this.formGroup.addControl('isUrgent', this.fb.control(false));
  }

  // Campaign categories
  categories = [
    {value: 'Education', label: 'Education'},
    {value: 'Healthcare', label: 'Healthcare'},
    {value: 'Community Project', label: 'Community Project'},
    {value: 'Religious', label: 'Religious'},
    {value: 'Personal', label: 'Personal'},
    {value: 'Emergency', label: 'Emergency'},
    {value: 'Sports', label: 'Sports'},
    {value: 'Environmental', label: 'Environmental'},
    {value: 'Other', label: 'Other'}
  ];

  // Format currency display
  formatCurrency(value: string): string {
    if (!value) return '';
    const num = parseInt(value.replace(/[^\d]/g, ''));
    return new Intl.NumberFormat('en-UG').format(num);
  }

  // Handle amount input formatting
  onAmountInput(event: any): void {
    const input = event.target;
    const value = input.value.replace(/[^\d]/g, '');
    const formattedValue = this.formatCurrency(value);

    // Update the display
    input.value = formattedValue;

    // Update the form control with the raw number
    this.formGroup.get('targetAmount')?.setValue(value, {emitEvent: false});
  }

  // Character count for description
  getDescriptionCount(): number {
    const description = this.formGroup.get('description')?.value || '';
    return description.length;
  }

  getDescriptionCountClass(): string {
    const count = this.getDescriptionCount();
    const max = 1000;

    if (count > max * 0.9) return 'text-danger';
    if (count > max * 0.7) return 'text-warning';
    return 'text-gray-500 dark:text-gray-400';
  }
}
