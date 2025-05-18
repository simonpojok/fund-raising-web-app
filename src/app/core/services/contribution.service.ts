import {Injectable} from '@angular/core';
import {Observable, of, delay} from 'rxjs';
import {IContribution} from '../interfaces';
import {mockContributions} from '../data';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  constructor() {
  }

  // Get contributions for a campaign
  getCampaignContributions(campaignId: string): Observable<IContribution[]> {
    return of(mockContributions.filter(c => c.campaign_id === campaignId)).pipe(delay(300));
  }

  // Get recent contributions across all campaigns
  getRecentContributions(limit: number = 5): Observable<IContribution[]> {
    const recentContributions = mockContributions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
    return of(recentContributions).pipe(delay(300));
  }

  // Get all contributions (for user's contribution history)
  getAllContributions(): Observable<IContribution[]> {
    return of(mockContributions).pipe(delay(300));
  }

  // Create a new contribution (mock implementation)
  createContribution(contribution: Partial<IContribution>): Observable<IContribution> {
    const newContribution: IContribution = {
      id: `c${Date.now()}`,
      contributor_name: contribution.contributor_name || '',
      contributor_phone: contribution.contributor_phone,
      contributor_email: contribution.contributor_email,
      amount: contribution.amount || 0,
      date: new Date().toISOString(),
      status: 'pending',
      payment_method: contribution.payment_method || 'MTN Mobile Money',
      transaction_id: `TX${Math.random().toString(36).substr(2, 9)}`,
      note: contribution.note,
      is_anonymous: contribution.is_anonymous || false,
      campaign_id: contribution.campaign_id || '',
      campaign_title: contribution.campaign_title
    };

    return of(newContribution).pipe(delay(500));
  }
}
