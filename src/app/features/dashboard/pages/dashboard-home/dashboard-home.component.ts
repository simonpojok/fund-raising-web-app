import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  standalone: false,
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = true;

  // Dashboard statistics (these would come from an API in a real implementation)
  stats = {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalContributions: 0,
    totalRaised: 0,
    pendingPledges: 0
  };

  // Recent activities (these would come from an API in a real implementation)
  recentActivities: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Simulate loading data
    setTimeout(() => {
      // Mock data for demonstration
      this.stats = {
        totalCampaigns: 5,
        activeCampaigns: 3,
        totalContributions: 12,
        totalRaised: 250000, // UGX
        pendingPledges: 8
      };

      this.recentActivities = [
        {
          type: 'contribution',
          amount: 50000,
          campaign: 'School Building Fund',
          date: new Date(2025, 4, 14), // May 14, 2025
          user: 'You'
        },
        {
          type: 'pledge',
          amount: 100000,
          campaign: 'Community Water Project',
          date: new Date(2025, 4, 10), // May 10, 2025
          user: 'Sarah Nambozo'
        },
        {
          type: 'campaign_created',
          campaign: 'Medical Support Fund',
          date: new Date(2025, 4, 5), // May 5, 2025
          user: 'You'
        }
      ];

      this.isLoading = false;
    }, 1000);
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
