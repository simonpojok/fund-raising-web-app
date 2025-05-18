import {Injectable} from '@angular/core';
import {Observable, of, delay} from 'rxjs';
import {IPledge} from '../interfaces';
import {mockPledges, mockPendingPledges} from '../data';

@Injectable({
  providedIn: 'root'
})
export class PledgeService {

  constructor() {
  }

  // Get pledges for a campaign
  getCampaignPledges(campaignId: string): Observable<IPledge[]> {
    const allPledges = [...mockPledges, ...mockPendingPledges];
    return of(allPledges.filter(p => p.campaign_id === campaignId)).pipe(delay(300));
  }

  // Get pending pledges across all campaigns
  getPendingPledges(limit: number = 5): Observable<IPledge[]> {
    return of(mockPendingPledges.slice(0, limit)).pipe(delay(300));
  }

  // Get all pledges
  getAllPledges(): Observable<IPledge[]> {
    return of([...mockPledges, ...mockPendingPledges]).pipe(delay(300));
  }

  // Get pledges by status
  getPledgesByStatus(status: 'pending' | 'fulfilled'): Observable<IPledge[]> {
    const allPledges = [...mockPledges, ...mockPendingPledges];
    return of(allPledges.filter(p => p.status === status)).pipe(delay(300));
  }

  // Create a new pledge (mock implementation)
  createPledge(pledge: Partial<IPledge>): Observable<IPledge> {
    const newPledge: IPledge = {
      id: `p${Date.now()}`,
      pledger_name: pledge.pledger_name || '',
      description: pledge.description || '',
      type: pledge.type || 'monetary',
      monetary_value: pledge.monetary_value || 0,
      quantity: pledge.quantity,
      unit: pledge.unit,
      date: new Date().toISOString(),
      status: 'pending',
      currency: pledge.currency || 'UGX',
      campaign_id: pledge.campaign_id || '',
      campaign_title: pledge.campaign_title
    };

    return of(newPledge).pipe(delay(500));
  }

  // Update pledge status (mock implementation)
  updatePledgeStatus(pledgeId: string, status: 'pending' | 'fulfilled'): Observable<IPledge> {
    const allPledges = [...mockPledges, ...mockPendingPledges];
    const pledge = allPledges.find(p => p.id === pledgeId);

    if (pledge) {
      const updatedPledge = {...pledge, status};
      return of(updatedPledge).pipe(delay(300));
    }

    throw new Error('Pledge not found');
  }
}
