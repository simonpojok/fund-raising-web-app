import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Campaign, CampaignService } from '../../../core/services/campaign.service';

interface QuickAction {
  icon: string;
  label: string;
  route?: string;
  bgColor: string;
  textColor: string;
  action?: () => void;
}

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class QuickActionsComponent implements OnInit {
  @Input() campaign?: Campaign;
  @Input() showAll: boolean = false;

  actions: QuickAction[] = [];

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.generateQuickActions();
  }

  ngOnChanges(): void {
    this.generateQuickActions();
  }

  generateQuickActions(): void {
    this.actions = [];

    // If we have a specific campaign
    if (this.campaign) {
      this.actions = [
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>`,
          label: 'Contribute',
          route: `/dashboard/campaigns/${this.campaign.id}/contribute`,
          bgColor: 'bg-success hover:bg-success-600',
          textColor: 'text-white'
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>`,
          label: 'Pledge',
          route: `/dashboard/campaigns/${this.campaign.id}/pledge`,
          bgColor: 'bg-warning hover:bg-warning-600',
          textColor: 'text-white'
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>`,
          label: 'Invite Others',
          action: () => this.invitePeople(),
          bgColor: 'bg-primary-600 hover:bg-primary-700',
          textColor: 'text-white'
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>`,
          label: 'Share Campaign',
          action: () => this.shareCampaign(),
          bgColor: 'bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-700 dark:hover:bg-secondary-600',
          textColor: 'text-secondary-800 dark:text-secondary-100'
        }
      ];

      if (this.showAll) {
        this.actions.push(
          {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>`,
            label: 'Post Update',
            route: `/dashboard/campaigns/${this.campaign.id}/updates/create`,
            bgColor: 'bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800',
            textColor: 'text-primary-800 dark:text-primary-100'
          },
          {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>`,
            label: 'Send Message',
            route: `/dashboard/campaigns/${this.campaign.id}/messages`,
            bgColor: 'bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-900 dark:hover:bg-secondary-800',
            textColor: 'text-secondary-800 dark:text-secondary-100'
          }
        );
      }
    } else {
      // General quick actions
      this.actions = [
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>`,
          label: 'Create Campaign',
          route: '/dashboard/campaigns/create',
          bgColor: 'bg-primary-600 hover:bg-primary-700',
          textColor: 'text-white'
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`,
          label: 'Make a Contribution',
          route: '/dashboard/campaigns',
          bgColor: 'bg-success hover:bg-success-600',
          textColor: 'text-white'
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>`,
          label: 'Make a Pledge',
          route: '/dashboard/campaigns',
          bgColor: 'bg-warning hover:bg-warning-600',
          textColor: 'text-white'
        }
      ];
    }
  }

  invitePeople(): void {
    if (!this.campaign) return;

    // Generate a shareable link
    const campaignLink = this.campaignService.getShareLink(this.campaign.id);

    // In a real app, you would show a modal with options
    // For now, copy to clipboard
    navigator.clipboard.writeText(campaignLink)
      .then(() => {
        alert('Invitation link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  }

  shareCampaign(): void {
    if (!this.campaign) return;

    // Generate a shareable link
    const campaignLink = this.campaignService.getShareLink(this.campaign.id);

    // If Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: this.campaign.title,
        text: this.campaign.short_description,
        url: campaignLink,
      })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(campaignLink)
        .then(() => {
          alert('Campaign link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy link: ', err);
        });
    }
  }
}
