import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Campaign } from '../../../core/services/campaign.service';

@Component({
  selector: 'app-campaign-tabs',
  templateUrl: './campaign-tabs.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class CampaignTabsComponent implements OnInit {
  @Input() createdCampaigns: Campaign[] = [];
  @Input() contributedCampaigns: Campaign[] = [];
  @Input() loading: boolean = false;
  @Input() activeTab: 'created' | 'contributed' = 'contributed';
  @Input() selectedCampaignId: string | null = null;

  @Output() tabChange = new EventEmitter<'created' | 'contributed'>();
  @Output() campaignSelect = new EventEmitter<Campaign>();

  constructor() {}

  ngOnInit(): void {}

  selectTab(tab: 'created' | 'contributed'): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.tabChange.emit(tab);
    }
  }

  selectCampaign(campaign: Campaign): void {
    this.selectedCampaignId = campaign.id;
    this.campaignSelect.emit(campaign);
  }

  getProgressClass(campaign: Campaign): string {
    const progress = campaign.progress_percentage;

    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-primary-600 dark:bg-primary-500';
    if (progress >= 50) return 'bg-primary-500';
    if (progress >= 25) return 'bg-warning';
    return 'bg-danger';
  }
}
