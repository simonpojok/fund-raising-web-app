import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ICampaign } from '../../../../core/interfaces';

export interface CampaignsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ICampaign[];
}

export interface CampaignFilters {
  search?: string;
  category?: string;
  status?: 'active' | 'completed' | 'paused' | 'all';
  sort?: 'created_at' | '-created_at' | 'target_amount' | '-target_amount' | 'progress' | '-progress' | 'end_date' | '-end_date';
  page?: number;
  page_size?: number;
  min_amount?: number;
  max_amount?: number;
  is_urgent?: boolean;
  is_public?: boolean;
  created_by_me?: boolean;
  contributed_by_me?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignsListService {
  private readonly apiUrl = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  // Get campaigns with filters
  getCampaigns(filters: CampaignFilters = {}): Observable<CampaignsListResponse> {
    let params = new HttpParams();

    // Apply filters
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<CampaignsListResponse>(`${this.apiUrl}/`, { params });
  }

  // Get campaign by ID
  getCampaign(id: string): Observable<ICampaign> {
    return this.http.get<ICampaign>(`${this.apiUrl}/${id}/`);
  }

  // Follow/Unfollow campaign
  toggleCampaignFollow(campaignId: string, follow: boolean): Observable<any> {
    const action = follow ? 'follow' : 'unfollow';
    return this.http.post(`${this.apiUrl}/${campaignId}/${action}/`, {});
  }

  // Share campaign
  shareCampaign(campaignId: string, shareData: { method: string; message?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${campaignId}/share/`, shareData);
  }

  // Get trending campaigns
  getTrendingCampaigns(limit: number = 6): Observable<ICampaign[]> {
    return this.http.get<ICampaign[]>(`${this.apiUrl}/trending/?limit=${limit}`);
  }

  // Get featured campaigns
  getFeaturedCampaigns(limit: number = 3): Observable<ICampaign[]> {
    return this.http.get<ICampaign[]>(`${this.apiUrl}/featured/?limit=${limit}`);
  }

  // Get campaigns by category
  getCampaignsByCategory(categoryId: string, limit: number = 10): Observable<CampaignsListResponse> {
    return this.getCampaigns({ category: categoryId, page_size: limit });
  }

  // Search campaigns
  searchCampaigns(query: string, filters: Partial<CampaignFilters> = {}): Observable<CampaignsListResponse> {
    return this.getCampaigns({ ...filters, search: query });
  }

  // Helper method to build share URL
  getCampaignShareUrl(campaignId: string): string {
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

  // Calculate progress percentage
  calculateProgress(contributed: number, target: number): number {
    return Math.min(Math.round((contributed / target) * 100), 100);
  }

  // Calculate days remaining
  calculateDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // Get campaign status
  getCampaignStatus(campaign: ICampaign): 'active' | 'completed' | 'expired' | 'paused' {
    const daysRemaining = this.calculateDaysRemaining(campaign.event_date);

    if (!campaign.is_active) return 'paused';
    if (daysRemaining <= 0) return 'expired';
    if (campaign.progress_percentage >= 100) return 'completed';
    return 'active';
  }

  // Get status color class
  getStatusColorClass(status: string): string {
    const colorMap: { [key: string]: string } = {
      'active': 'text-green-600 dark:text-green-400',
      'completed': 'text-blue-600 dark:text-blue-400',
      'expired': 'text-red-600 dark:text-red-400',
      'paused': 'text-yellow-600 dark:text-yellow-400'
    };
    return colorMap[status] || 'text-gray-600 dark:text-gray-400';
  }

  // Get status background class
  getStatusBgClass(status: string): string {
    const bgMap: { [key: string]: string } = {
      'active': 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-700',
      'completed': 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
      'expired': 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-700',
      'paused': 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
    };
    return bgMap[status] || 'bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700';
  }
}
