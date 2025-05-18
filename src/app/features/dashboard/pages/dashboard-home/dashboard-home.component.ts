import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProgressBarComponent} from '../../../../shared/components/progress-bar/progress-bar.component';
import {RecentActivitiesComponent} from '../../../../shared/components/recent-activities/recent-activities.component';
import {CampaignCardComponent} from '../../../../shared/components/campaign-card/campaign-card.component';
import {CampaignCalendarComponent} from '../../../../shared/components/campaign-calendar/campaign-calendar.component';
import {QuickActionsComponent} from '../../../../shared/components/quick-actions/quick-actions.component';
import {TopContributorsComponent} from '../../../../shared/components/top-contributors/top-contributors.component';
import {CampaignTabsComponent} from '../../../../shared/components/campaign-tabs/campaign-tabs.component';
import {CampaignDetailComponent} from '../../../../shared/components/campaign-detail/campaign-detail.component';
import {
  ActivityService,
  AuthService,
  CampaignService,
  ContributionService,
  ContributorService,
  PledgeService,
  User
} from '../../../../core/services';
import {ICampaign, ICampaignActivity, IContribution, IContributor, IPledge} from '../../../../core/interfaces';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // ProgressBarComponent,
    CampaignCardComponent,
    RecentActivitiesComponent,
    CampaignCalendarComponent,
    QuickActionsComponent,
    TopContributorsComponent,
    CampaignTabsComponent,
    CampaignDetailComponent
  ]
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User | null = null;
  isLoading: boolean = true;

  // Dashboard data
  createdCampaigns: ICampaign[] = [];
  contributedCampaigns: ICampaign[] = [];
  selectedCampaign: ICampaign | null = null;
  recentActivities: ICampaignActivity[] = [];
  topContributors: IContributor[] = [];
  recentContributions: IContribution[] = [];
  pendingPledges: IPledge[] = [];

  // UI state
  activeTab: 'created' | 'contributed' = 'contributed';

  constructor(
    private authService: AuthService,
    private campaignService: CampaignService,
    private contributionService: ContributionService,
    private pledgeService: PledgeService,
    private contributorService: ContributorService,
    private activityService: ActivityService
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Load dashboard data
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load campaigns
    this.campaignService.getContributedCampaigns().subscribe({
      next: (campaigns) => {
        this.contributedCampaigns = campaigns;

        // Select first campaign by default
        if (campaigns.length > 0 && !this.selectedCampaign) {
          this.selectCampaign(campaigns[0]);
        }
      },
      error: (error) => {
        console.error('Error loading contributed campaigns:', error);
      }
    });

    this.campaignService.getCreatedCampaigns().subscribe({
      next: (campaigns) => {
        this.createdCampaigns = campaigns;

        // If no contributed campaigns but has created campaigns
        if (this.contributedCampaigns.length === 0 && campaigns.length > 0 && !this.selectedCampaign) {
          this.activeTab = 'created';
          this.selectCampaign(campaigns[0]);
        }
      },
      error: (error) => {
        console.error('Error loading created campaigns:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    // Load user's recent activities
    this.activityService.getUserActivities(10).subscribe({
      next: (activities) => {
        this.recentActivities = activities;
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
      }
    });

    // Load recent contributions across all campaigns
    this.contributionService.getRecentContributions(5).subscribe({
      next: (contributions) => {
        this.recentContributions = contributions;
      },
      error: (error) => {
        console.error('Error loading recent contributions:', error);
      }
    });

    // Load pending pledges across all campaigns
    this.pledgeService.getPendingPledges(5).subscribe({
      next: (pledges) => {
        this.pendingPledges = pledges;
      },
      error: (error) => {
        console.error('Error loading pending pledges:', error);
      }
    });

    // Load top contributors across all campaigns
    this.contributorService.getAllTopContributors(5).subscribe({
      next: (contributors) => {
        this.topContributors = contributors;
      },
      error: (error) => {
        console.error('Error loading top contributors:', error);
      }
    });
  }

  loadCampaignDetails(campaignId: string): void {
    // Load top contributors for the campaign
    this.contributorService.getTopContributors(campaignId).subscribe({
      next: (contributors) => {
        this.topContributors = contributors;
      },
      error: (error) => {
        console.error('Error loading top contributors:', error);
      }
    });

    // Load recent contributions for the campaign
    this.contributionService.getCampaignContributions(campaignId).subscribe({
      next: (contributions) => {
        this.recentContributions = contributions.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ).slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading recent contributions:', error);
      }
    });

    // Load pending pledges for the campaign
    this.pledgeService.getCampaignPledges(campaignId).subscribe({
      next: (pledges) => {
        this.pendingPledges = pledges.filter(p => p.status === 'pending')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading pending pledges:', error);
      }
    });

    // Load campaign activities
    this.activityService.getCampaignActivities(campaignId).subscribe({
      next: (activities) => {
        this.recentActivities = activities;
      },
      error: (error) => {
        console.error('Error loading campaign activities:', error);
      }
    });
  }

  selectCampaign(campaign: ICampaign): void {
    this.selectedCampaign = campaign;
    this.loadCampaignDetails(campaign.id);
  }

  onTabChange(tab: 'created' | 'contributed'): void {
    this.activeTab = tab;

    // Select first campaign in the selected tab
    const campaigns = tab === 'created' ? this.createdCampaigns : this.contributedCampaigns;
    if (campaigns.length > 0) {
      this.selectCampaign(campaigns[0]);
    } else {
      this.selectedCampaign = null;
    }
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return this.campaignService.formatCurrency(amount);
  }
}
