import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  beneficiary: string;
  event_date: string; // ISO date string
  location: string;
  target_amount: number;
  coordinator_name: string;
  coordinator_email?: string;
  coordinator_phone?: string;
  is_public: boolean;
  allow_anonymous_contributions: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  total_contributed: number;
  total_pledged: number;
  contribution_progress: number; // 0 to 1
  progress_percentage: number; // 0 to 100
  days_remaining: number;
  is_active: boolean;
  short_description: string;
  banner_url?: string;
  category?: string;
  is_urgent?: boolean;
}

export interface Contribution {
  id: string;
  contributor_name: string;
  contributor_phone?: string;
  contributor_email?: string;
  amount: number;
  date: string; // ISO date string
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: string;
  transaction_id?: string;
  note?: string;
  is_anonymous: boolean;
  campaign_id: string;
  campaign_title?: string;
}

export interface Pledge {
  id: string;
  pledger_name: string;
  description: string;
  type: 'monetary' | 'item';
  monetary_value: number;
  quantity?: number;
  unit?: string;
  date: string; // ISO date string
  status: 'pending' | 'fulfilled';
  currency?: string;
  campaign_id: string;
  campaign_title?: string;
}

export interface Contributor {
  id: string;
  name: string;
  photo_url?: string;
  total_contributed: number;
  contribution_count: number;
  last_contribution_date: string; // ISO date string
}

export interface CampaignActivity {
  id: string;
  type: 'contribution' | 'pledge' | 'update' | 'comment';
  message: string;
  campaign_id: string;
  campaign_title?: string;
  user_id?: string;
  user_name?: string;
  user_photo?: string;
  amount?: number;
  created_at: string; // ISO date string
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly API_URL = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  // Get campaigns where the user is either creator or contributor
  getUserCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.API_URL}/user-campaigns/`);
  }

  // Get campaigns created by the user
  getCreatedCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.API_URL}/created/`);
  }

  // Get campaigns where the user is a contributor
  getContributedCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.API_URL}/contributed/`);
  }

  // Get a single campaign by ID
  getCampaign(id: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.API_URL}/${id}/`);
  }

  // Get contributions for a campaign
  getCampaignContributions(campaignId: string): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.API_URL}/${campaignId}/contributions/`);
  }

  // Get pledges for a campaign
  getCampaignPledges(campaignId: string): Observable<Pledge[]> {
    return this.http.get<Pledge[]>(`${this.API_URL}/${campaignId}/pledges/`);
  }

  // Get top contributors for a campaign
  getTopContributors(campaignId: string, limit: number = 5): Observable<Contributor[]> {
    return this.http.get<Contributor[]>(`${this.API_URL}/${campaignId}/top-contributors/?limit=${limit}`);
  }

  // Get recent activities for a campaign
  getCampaignActivities(campaignId: string, limit: number = 5): Observable<CampaignActivity[]> {
    return this.http.get<CampaignActivity[]>(`${this.API_URL}/${campaignId}/activities/?limit=${limit}`);
  }

  // Get user's recent activities across all campaigns
  getUserActivities(limit: number = 10): Observable<CampaignActivity[]> {
    return this.http.get<CampaignActivity[]>(`${this.API_URL}/user-activities/?limit=${limit}`);
  }

  // Create a share link for a campaign
  getShareLink(campaignId: string): string {
    return `${window.location.origin}/campaigns/${campaignId}`;
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Calculate days between two dates
  calculateDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // Calculate progress percentage
  calculateProgress(current: number, target: number): number {
    return Math.min(Math.round((current / target) * 100), 100);
  }
}
