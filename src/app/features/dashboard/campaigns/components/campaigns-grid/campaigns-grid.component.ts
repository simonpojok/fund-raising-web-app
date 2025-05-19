import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICampaign } from '../../../../../core/interfaces';
import { CampaignsListService } from '../../services/campaigns-list.service';

@Component({
  selector: 'app-campaigns-grid',
  templateUrl: './campaigns-grid.component.html',
  styleUrls: ['./campaigns-grid.component.scss'],
  standalone: false,
})
export class CampaignsGridComponent {
  @Input() campaigns: ICampaign[] = [];
  @Input() loading = false;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() showActions = true;
  @Input() currentUserId: string | null = null;

  @Output() campaignAction = new EventEmitter<{ action: string; campaign: ICampaign }>();
  @Output() loadMore = new EventEmitter<void>();

  // Track items for performance
  trackByFn(index: number, item: ICampaign): string {
    return item.id;
  }

  constructor(private campaignsService: CampaignsListService) {}

  // Campaign actions
  onContribute(campaign: ICampaign): void {
    this.campaignAction.emit({ action: 'contribute', campaign });
  }

  onPledge(campaign: ICampaign): void {
    this.campaignAction.emit({ action: 'pledge', campaign });
  }

  onEdit(campaign: ICampaign): void {
    this.campaignAction.emit({ action: 'edit', campaign });
  }

  onView(campaign: ICampaign): void {
    this.campaignAction.emit({ action: 'view', campaign });
  }

  onShare(campaign: ICampaign): void {
    this.campaignAction.emit({ action: 'share', campaign });
  }

  onFollow(campaign: ICampaign): void {
    this.campaignAction.emit({ action: 'follow', campaign });
  }

  onInvite(campaign: ICampaign): void {
    this.campaignAction.emit({ action: 'invite', campaign });
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return this.campaignsService.formatCurrency(amount);
  }

  getCampaignStatus(campaign: ICampaign): string {
    return this.campaignsService.getCampaignStatus(campaign);
  }

  getStatusColorClass(status: string): string {
    return this.campaignsService.getStatusColorClass(status);
  }

  getStatusBgClass(status: string): string {
    return this.campaignsService.getStatusBgClass(status);
  }

  getProgressColor(progress: number): 'primary' | 'success' | 'warning' | 'danger' {
    if (progress >= 100) return 'success';
    if (progress >= 75) return 'primary';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'danger';
  }

  getDaysRemainingText(campaign: ICampaign): string {
    const days = this.campaignsService.calculateDaysRemaining(campaign.event_date);

    if (days <= 0) return 'Campaign ended';
    if (days === 1) return '1 day left';
    if (days < 30) return `${days} days left`;

    const months = Math.floor(days / 30);
    return months === 1 ? '1 month left' : `${months} months left`;
  }

  getDaysRemainingClass(campaign: ICampaign): string {
    const days = this.campaignsService.calculateDaysRemaining(campaign.event_date);

    if (days <= 0) return 'text-red-600 dark:text-red-400';
    if (days <= 7) return 'text-orange-600 dark:text-orange-400';
    if (days <= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  }

  // Check if user is campaign owner
  isOwner(campaign: ICampaign): boolean {
    return this.currentUserId === campaign.coordinator_name; // Assuming coordinator_name holds user ID
  }

  // Check if campaign accepts contributions
  canContribute(campaign: ICampaign): boolean {
    const status = this.getCampaignStatus(campaign);
    return status === 'active' && !this.isOwner(campaign);
  }

  // Check if campaign accepts pledges
  canPledge(campaign: ICampaign): boolean {
    const status = this.getCampaignStatus(campaign);
    // Assuming campaign has include_pledges field
    return status === 'active' && !this.isOwner(campaign);
  }

  // Get campaign urgency class
  getUrgencyClass(campaign: ICampaign): string {
    if (!campaign.is_urgent) return '';
    return 'border-red-500 shadow-red-100 dark:shadow-red-900/20';
  }

  // Format time ago for creation date
  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
    if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    return 'Just now';
  }

  // Get image with fallback
  getCampaignImage(campaign: ICampaign): string {
    if (campaign.banner_url) {
      return campaign.banner_url;
    }

    // Return a placeholder based on category or use default
    const category = campaign.category?.toLowerCase() || 'general';
    const placeholderMap: { [key: string]: string } = {
      'education': '/api/placeholder/400/240/education',
      'healthcare': '/api/placeholder/400/240/healthcare',
      'community': '/api/placeholder/400/240/community',
      'emergency': '/api/placeholder/400/240/emergency',
      'personal': '/api/placeholder/400/240/personal',
      'religious': '/api/placeholder/400/240/religious'
    };

    return placeholderMap[category] || '/api/placeholder/400/240/campaign';
  }

  // Get grid column classes based on view mode
  getGridClasses(): string {
    if (this.viewMode === 'list') {
      return 'grid grid-cols-1 gap-4';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  }

  // Load more campaigns
  onLoadMore(): void {
    this.loadMore.emit();
  }

  // Get contribution stats text
  getContributionStats(campaign: ICampaign): string {
    // This would need to be added to the campaign interface
    // For now, we'll use placeholder logic
    const contributors = Math.floor(campaign.total_contributed / 50000); // Estimate based on average contribution
    if (contributors === 0) return 'No contributors yet';
    if (contributors === 1) return '1 contributor';
    return `${contributors} contributors`;
  }

  // Get campaign title with length limit
  getTruncatedTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  }

  // Get campaign description with length limit
  getTruncatedDescription(description: string, maxLength: number = 120): string {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  }
}
