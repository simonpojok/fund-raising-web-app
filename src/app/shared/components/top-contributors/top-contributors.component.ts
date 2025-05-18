import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {IContributor} from '../../../core/interfaces';
import {CampaignService} from '../../../core/services';

@Component({
  selector: 'app-top-contributors',
  templateUrl: './top-contributors.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TopContributorsComponent implements OnInit {
  @Input() contributors: IContributor[] = [];
  @Input() campaignId?: string;
  @Input() loading: boolean = false;
  @Input() limit: number = 5;

  constructor(private campaignService: CampaignService) {
  }

  ngOnInit(): void {
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Format currency
  formatCurrency(amount: number): string {
    return this.campaignService.formatCurrency(amount);
  }

  // Generate initials from contributor name
  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
      return name.substring(0, 2).toUpperCase();
    }
  }

  // Get view more link
  getViewMoreLink(): string {
    return this.campaignId
      ? `/dashboard/campaigns/${this.campaignId}/contributors`
      : '/dashboard/contributors';
  }
}
