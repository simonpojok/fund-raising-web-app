import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import {ICampaign} from '../../../core/interfaces';
import {CampaignService} from '../../../core/services';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ProgressBarComponent]
})
export class CampaignDetailComponent implements OnInit {
  @Input() campaign!: ICampaign;
  @Input() compact: boolean = false;

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {}

  // Format currency
  formatCurrency(amount: number): string {
    return this.campaignService.formatCurrency(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Calculate time remaining
  getTimeRemaining(): string {
    if (!this.campaign) return '';

    const days = this.campaign.days_remaining;

    if (days <= 0) return 'Campaign ended';
    if (days === 1) return '1 day left';
    if (days < 30) return `${days} days left`;

    const months = Math.floor(days / 30);
    return months === 1 ? '1 month left' : `${months} months left`;
  }

  // Get progress color
  getProgressColor(): 'primary' | 'success' | 'warning' | 'danger' {
    const progress = this.campaign.progress_percentage;

    if (progress >= 100) return 'success';
    if (progress >= 75) return 'primary';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'danger';
  }

  // Get remaining target
  getRemainingTarget(): number {
    return Math.max(0, this.campaign.target_amount - this.campaign.total_contributed);
  }
}
