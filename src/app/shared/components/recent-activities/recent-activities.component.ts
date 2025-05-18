import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ICampaignActivity } from '../../../core/interfaces';
import { CampaignService, ActivityService } from '../../../core/services';

@Component({
  selector: 'app-recent-activities',
  templateUrl: './recent-activities.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RecentActivitiesComponent implements OnInit {
  @Input() activities: ICampaignActivity[] = [];
  @Input() campaignId?: string;
  @Input() loading: boolean = false;
  @Input() limit: number = 5;
  @Input() showViewMore: boolean = true;

  constructor(
    private campaignService: CampaignService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  // Format time difference from now
  formatTimeAgo(dateString: string): string {
    return this.activityService.formatTimeAgo(dateString);
  }

  // Format currency
  formatCurrency(amount?: number): string {
    if (!amount) return '';
    return this.campaignService.formatCurrency(amount);
  }

  // Get icon class based on activity type
  getActivityIcon(type: string): string {
    switch (type) {
      case 'contribution':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success dark:text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
      case 'pledge':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning dark:text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        `;
      case 'update':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        `;
      case 'comment':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        `;
      default:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
    }
  }

  // Get background color class based on activity type
  getActivityBgClass(type: string): string {
    switch (type) {
      case 'contribution':
        return 'bg-success-100 dark:bg-success-900/50';
      case 'pledge':
        return 'bg-warning-100 dark:bg-warning-900/50';
      case 'update':
        return 'bg-primary-100 dark:bg-primary-900/50';
      case 'comment':
        return 'bg-secondary-100 dark:bg-secondary-900/50';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  }

  // Get view more link
  getViewMoreLink(): string {
    return this.campaignId
      ? `/dashboard/campaigns/${this.campaignId}/activities`
      : '/dashboard/activities';
  }
}
