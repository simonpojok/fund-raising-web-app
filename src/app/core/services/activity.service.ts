import {Injectable} from '@angular/core';
import {Observable, of, delay} from 'rxjs';
import {ICampaignActivity} from '../interfaces';
import {mockActivities} from '../data';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor() {
  }

  // Get recent activities for a campaign
  getCampaignActivities(campaignId: string, limit: number = 5): Observable<ICampaignActivity[]> {
    return of(mockActivities.filter(a => a.campaign_id === campaignId).slice(0, limit)).pipe(delay(300));
  }

  // Get user's recent activities across all campaigns
  getUserActivities(limit: number = 10): Observable<ICampaignActivity[]> {
    return of(mockActivities.slice(0, limit)).pipe(delay(300));
  }

  // Get all activities
  getAllActivities(): Observable<ICampaignActivity[]> {
    return of(mockActivities).pipe(delay(300));
  }

  // Get activities by type
  getActivitiesByType(type: 'contribution' | 'pledge' | 'update' | 'comment'): Observable<ICampaignActivity[]> {
    return of(mockActivities.filter(a => a.type === type)).pipe(delay(300));
  }

  // Get activities for multiple campaigns
  getActivitiesForCampaigns(campaignIds: string[], limit: number = 10): Observable<ICampaignActivity[]> {
    const filteredActivities = mockActivities.filter(a =>
      campaignIds.includes(a.campaign_id)
    ).slice(0, limit);
    return of(filteredActivities).pipe(delay(300));
  }

  // Search activities by message content
  searchActivities(searchTerm: string): Observable<ICampaignActivity[]> {
    const filteredActivities = mockActivities.filter(activity =>
      activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.campaign_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(filteredActivities).pipe(delay(300));
  }

  // Get activities within a date range
  getActivitiesInDateRange(startDate: Date, endDate: Date): Observable<ICampaignActivity[]> {
    const filteredActivities = mockActivities.filter(activity => {
      const activityDate = new Date(activity.created_at);
      return activityDate >= startDate && activityDate <= endDate;
    });
    return of(filteredActivities).pipe(delay(300));
  }

  // Create a new activity (mock implementation)
  createActivity(activity: Partial<ICampaignActivity>): Observable<ICampaignActivity> {
    const newActivity: ICampaignActivity = {
      id: `act-${Date.now()}`,
      type: activity.type || 'update',
      message: activity.message || '',
      campaign_id: activity.campaign_id || '',
      campaign_title: activity.campaign_title,
      user_id: activity.user_id,
      user_name: activity.user_name,
      user_photo: activity.user_photo,
      amount: activity.amount,
      created_at: new Date().toISOString()
    };

    return of(newActivity).pipe(delay(500));
  }

  // Format time difference for display
  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }

    if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }

    if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    }

    return 'Just now';
  }
}
