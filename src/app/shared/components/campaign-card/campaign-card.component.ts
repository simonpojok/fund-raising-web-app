import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import {ICampaign} from '../../../core/interfaces';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ProgressBarComponent]
})
export class CampaignCardComponent implements OnInit {
  @Input() campaign!: ICampaign;
  @Input() showActions: boolean = true;
  @Input() compact: boolean = false;

  daysText: string = '';
  isExpired: boolean = false;

  ngOnInit(): void {
    this.setDaysText();
  }

  private setDaysText(): void {
    if (!this.campaign) return;

    if (this.campaign.days_remaining < 0) {
      this.isExpired = true;
      this.daysText = 'Expired';
    } else if (this.campaign.days_remaining === 0) {
      this.daysText = 'Last day';
    } else if (this.campaign.days_remaining === 1) {
      this.daysText = '1 day left';
    } else {
      this.daysText = `${this.campaign.days_remaining} days left`;
    }
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getProgressColor(): 'primary' | 'success' | 'warning' | 'danger' {
    const progress = this.campaign.progress_percentage;

    if (progress >= 100) return 'success';
    if (progress >= 75) return 'primary';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'danger';
  }
}
