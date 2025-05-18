import {Injectable} from '@angular/core';
import {Observable, of, delay} from 'rxjs';
import {IContributor} from '../interfaces';
import {mockContributors} from '../data';

@Injectable({
  providedIn: 'root'
})
export class ContributorService {

  constructor() {
  }

  // Get top contributors for a campaign
  getTopContributors(campaignId: string, limit: number = 5): Observable<IContributor[]> {
    // In a real implementation, this would filter by campaign
    // For mock data, we'll return the top contributors overall
    return of(mockContributors.slice(0, limit)).pipe(delay(300));
  }

  // Get top contributors across all campaigns
  getAllTopContributors(limit: number = 5): Observable<IContributor[]> {
    return of(mockContributors.slice(0, limit)).pipe(delay(300));
  }

  // Get all contributors
  getAllContributors(): Observable<IContributor[]> {
    return of(mockContributors).pipe(delay(300));
  }

  // Get contributor by ID
  getContributor(id: string): Observable<IContributor | undefined> {
    const contributor = mockContributors.find(c => c.id === id);
    return of(contributor).pipe(delay(300));
  }

  // Search contributors by name
  searchContributors(searchTerm: string): Observable<IContributor[]> {
    const filteredContributors = mockContributors.filter(contributor =>
      contributor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(filteredContributors).pipe(delay(300));
  }

  // Get contributors sorted by different criteria
  getContributorsSorted(
    sortBy: 'name' | 'total_contributed' | 'contribution_count' | 'last_contribution_date',
    order: 'asc' | 'desc' = 'desc'
  ): Observable<IContributor[]> {
    const sorted = [...mockContributors].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'total_contributed':
          comparison = a.total_contributed - b.total_contributed;
          break;
        case 'contribution_count':
          comparison = a.contribution_count - b.contribution_count;
          break;
        case 'last_contribution_date':
          comparison = new Date(a.last_contribution_date).getTime() - new Date(b.last_contribution_date).getTime();
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return of(sorted).pipe(delay(300));
  }
}
