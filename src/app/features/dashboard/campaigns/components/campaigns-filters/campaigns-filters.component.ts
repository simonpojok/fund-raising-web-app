import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ISupportCampaignCategory } from '../../pages/create-campaign/interfaces/support_category.interface';
import { CampaignFilters } from '../../services/campaigns-list.service';

@Component({
  selector: 'app-campaigns-filters',
  templateUrl: './campaigns-filters.component.html',
  styleUrls: ['./campaigns-filters.component.scss'],
  standalone: false,
})
export class CampaignsFiltersComponent implements OnInit {
  @Input() categories: ISupportCampaignCategory[] = [];
  @Input() loadingCategories = false;
  @Input() currentFilters: CampaignFilters = {};

  @Output() filtersChange = new EventEmitter<CampaignFilters>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  filtersForm!: FormGroup;
  isExpanded = false;
  activeFiltersCount = 0;

  sortOptions = [
    { value: '-created_at', label: 'Newest First' },
    { value: 'created_at', label: 'Oldest First' },
    { value: '-target_amount', label: 'Highest Goal' },
    { value: 'target_amount', label: 'Lowest Goal' },
    { value: '-progress', label: 'Most Progress' },
    { value: 'progress', label: 'Least Progress' },
    { value: 'end_date', label: 'Ending Soon' },
    { value: '-end_date', label: 'Ending Later' }
  ];

  statusOptions = [
    { value: 'all', label: 'All Campaigns' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
    this.updateActiveFiltersCount();
  }

  initializeForm(): void {
    this.filtersForm = this.fb.group({
      search: [this.currentFilters.search || ''],
      category: [this.currentFilters.category || ''],
      status: [this.currentFilters.status || 'all'],
      sort: [this.currentFilters.sort || '-created_at'],
      min_amount: [this.currentFilters.min_amount || ''],
      max_amount: [this.currentFilters.max_amount || ''],
      is_urgent: [this.currentFilters.is_urgent || false],
      is_public: [this.currentFilters.is_public],
      created_by_me: [this.currentFilters.created_by_me || false],
      contributed_by_me: [this.currentFilters.contributed_by_me || false]
    });
  }

  setupFormSubscriptions(): void {
    // Search with debounce
    this.filtersForm.get('search')?.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(search => {
        this.searchChange.emit(search);
        this.emitFilters();
      });

    // Other filters - emit immediately
    const controlsToWatch = ['category', 'status', 'sort', 'min_amount', 'max_amount',
      'is_urgent', 'is_public', 'created_by_me', 'contributed_by_me'];

    controlsToWatch.forEach(controlName => {
      this.filtersForm.get(controlName)?.valueChanges
        .subscribe(() => {
          this.emitFilters();
          this.updateActiveFiltersCount();
        });
    });
  }

  emitFilters(): void {
    const formValue = this.filtersForm.value;
    const filters: CampaignFilters = {};

    // Only include non-empty values
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'all') {
        if (key === 'min_amount' || key === 'max_amount') {
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && numValue > 0) {
            (filters as any)[key] = numValue;
          }
        } else {
          (filters as any)[key] = value;
        }
      }
    });

    this.filtersChange.emit(filters);
  }

  updateActiveFiltersCount(): void {
    const formValue = this.filtersForm.value;
    let count = 0;

    if (formValue.category) count++;
    if (formValue.status && formValue.status !== 'all') count++;
    if (formValue.sort && formValue.sort !== '-created_at') count++;
    if (formValue.min_amount) count++;
    if (formValue.max_amount) count++;
    if (formValue.is_urgent) count++;
    if (formValue.is_public !== null && formValue.is_public !== undefined) count++;
    if (formValue.created_by_me) count++;
    if (formValue.contributed_by_me) count++;

    this.activeFiltersCount = count;
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  clearAllFilters(): void {
    this.filtersForm.reset({
      search: '',
      category: '',
      status: 'all',
      sort: '-created_at',
      min_amount: '',
      max_amount: '',
      is_urgent: false,
      is_public: null,
      created_by_me: false,
      contributed_by_me: false
    });
    this.clearFilters.emit();
    this.updateActiveFiltersCount();
  }

  // Quick filter methods
  setUrgentFilter(): void {
    this.filtersForm.patchValue({ is_urgent: true });
  }

  setMyCreatedFilter(): void {
    this.filtersForm.patchValue({ created_by_me: true });
  }

  setMyContributedFilter(): void {
    this.filtersForm.patchValue({ contributed_by_me: true });
  }

  setActiveFilter(): void {
    this.filtersForm.patchValue({ status: 'active' });
  }

  // Get category name by ID
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  // Get sort option label
  getSortLabel(sortValue: string): string {
    const option = this.sortOptions.find(opt => opt.value === sortValue);
    return option ? option.label : 'Custom';
  }

  // Get status label
  getStatusLabel(statusValue: string): string {
    const option = this.statusOptions.find(opt => opt.value === statusValue);
    return option ? option.label : 'Unknown';
  }

  // Format currency for display in filters
  formatCurrencyFilter(amount: string): string {
    if (!amount) return '';
    const num = parseFloat(amount.replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-US').format(num);
  }

  // Amount input formatting
  onAmountInput(event: any, controlName: string): void {
    const input = event.target;
    let value = input.value.replace(/[^\d]/g, '');

    if (value) {
      const numericValue = parseInt(value);
      input.value = this.formatCurrencyFilter(numericValue.toString());
      this.filtersForm.get(controlName)?.setValue(numericValue, { emitEvent: false });
    } else {
      input.value = '';
      this.filtersForm.get(controlName)?.setValue('', { emitEvent: false });
    }

    // Trigger manual value change
    this.emitFilters();
    this.updateActiveFiltersCount();
  }
}
