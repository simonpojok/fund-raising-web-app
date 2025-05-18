import {Injectable} from '@angular/core';
import {Observable, of, delay} from 'rxjs';
import {ICampaign} from '../interfaces';
import {
    mockCreatedCampaigns,
    mockContributedCampaigns
} from '../data';

@Injectable({
    providedIn: 'root'
})
export class CampaignService {
    private allCampaigns: ICampaign[] = [...mockCreatedCampaigns, ...mockContributedCampaigns];

    constructor() {
    }

    // Get campaigns where the user is either creator or contributor
    getUserCampaigns(): Observable<ICampaign[]> {
        return of(this.allCampaigns).pipe(delay(500));
    }

    // Get campaigns created by the user
    getCreatedCampaigns(): Observable<ICampaign[]> {
        return of(mockCreatedCampaigns).pipe(delay(500));
    }

    // Get campaigns where the user is a contributor
    getContributedCampaigns(): Observable<ICampaign[]> {
        return of(mockContributedCampaigns).pipe(delay(500));
    }

    // Get a single campaign by ID
    getCampaign(id: string): Observable<ICampaign> {
        const campaign = this.allCampaigns.find(c => c.id === id);
        return of(campaign!).pipe(delay(300));
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
