import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject, BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {takeUntil, debounceTime, distinctUntilChanged, switchMap, finalize} from 'rxjs/operators';
import {ICampaign} from '../../../../../core/interfaces';
import {ISupportCampaignCategory} from '../create-campaign/interfaces/support_category.interface';
import {CampaignsListService, CampaignFilters, CampaignsListResponse} from '../../services/campaigns-list.service';
import {AuthService, User} from '../../../../../core/services';
import {CreateCampaignService} from '../../services/create-campaign.service';

@Component({
  selector: 'app-campaigns-list',
  templateUrl: './campaigns-list.component.html',
  styleUrls: ['./campaigns-list.component.scss'],
  standalone: false,
})
export class CampaignsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private filtersSubject = new BehaviorSubject<CampaignFilters>({});
  private searchSubject = new BehaviorSubject<string>('');

  campaigns: ICampaign[] = [];
  categories: ISupportCampaignCategory[] = [];
  currentUser: User | null = null;
  filtersForm!: FormGroup;

  loading = false;
  loadingCategories = false;
  hasMore = true;
  currentPage = 1;
  pageSize = 12;
  totalCount = 0;

  viewMode: 'grid' | 'list' = 'grid';
  showFilters = false;

  currentFilters: CampaignFilters = {};
  searchQuery = '';

  // Error handling
  errorMessage = '';
  retryCount = 0;
  maxRetries = 3;

  constructor(
    private campaignsService: CampaignsListService,
    private createCampaignService: CreateCampaignService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filtersForm = this.fb.group({
      search: [''],
      category: [''],
      status: ['all'],
      sort: ['-created_at']
    });
  }

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadCategories();
    this.initializeFiltersFromRoute();
    this.setupFilterSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserInfo(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.createCampaignService.getCampaignCategories()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingCategories = false)
      )
      .subscribe({
        next: (response) => {
          this.categories = response.results;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  initializeFiltersFromRoute(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const filters: CampaignFilters = {};

      // Parse query parameters
      if (params['search']) filters.search = params['search'];
      if (params['category']) filters.category = params['category'];
      if (params['status']) filters.status = params['status'];
      if (params['sort']) filters.sort = params['sort'];
      if (params['min_amount']) filters.min_amount = parseFloat(params['min_amount']);
      if (params['max_amount']) filters.max_amount = parseFloat(params['max_amount']);
      if (params['is_urgent']) filters.is_urgent = params['is_urgent'] === 'true';
      if (params['is_public']) filters.is_public = params['is_public'] === 'true';
      if (params['created_by_me']) filters.created_by_me = params['created_by_me'] === 'true';
      if (params['contributed_by_me']) filters.contributed_by_me = params['contributed_by_me'] === 'true';
      if (params['view']) this.viewMode = params['view'] as 'grid' | 'list';

      // Clear filters if clear=true
      if (params['clear'] === 'true') {
        this.clearAllFilters();
        return;
      }

      this.currentFilters = filters;
      this.filtersSubject.next(filters);

      if (filters.search) {
        this.searchQuery = filters.search;
        this.searchSubject.next(filters.search);
      }
    });
  }

  setupFilterSubscriptions(): void {
    // Combine filters and search
    combineLatest([
      this.filtersSubject.pipe(distinctUntilChanged()),
      this.searchSubject.pipe(debounceTime(400), distinctUntilChanged())
    ])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([filters, search]) => {
          this.currentPage = 1;
          this.campaigns = [];
          this.hasMore = true;
          this.retryCount = 0;

          const searchFilters = {...filters};
          if (search) {
            searchFilters.search = search;
          }

          return this.loadCampaigns(searchFilters);
        })
      )
      .subscribe({
        next: (response) => {
          if (this.currentPage === 1) {
            this.campaigns = response.results;
          } else {
            this.campaigns = [...this.campaigns, ...response.results];
          }

          this.totalCount = response.count;
          this.hasMore = !!response.next;
          this.updateUrl();
        },
        error: (error) => {
          console.error('Error loading campaigns:', error);
          this.handleLoadError(error);
        }
      });
  }

  loadCampaigns(filters: CampaignFilters = {}): Observable<any> {
    this.loading = true;
    this.errorMessage = '';

    const requestFilters: CampaignFilters = {
      ...filters,
      page: this.currentPage,
      page_size: this.pageSize
    };

    return this.campaignsService.getCampaigns(requestFilters)
      .pipe(
        finalize(() => this.loading = false),
        takeUntil(this.destroy$)
      );
  }

  handleLoadError(error: any): void {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => {
        this.loadCampaigns(this.currentFilters);
      }, 1000 * this.retryCount);
    } else {
      this.errorMessage = 'Failed to load campaigns. Please try refreshing the page.';
    }
  }

  // Filter handlers
  onFiltersChange(filters: CampaignFilters): void {
    this.currentFilters = {...this.currentFilters, ...filters};
    this.filtersSubject.next(this.currentFilters);
  }

  onSearchChange(search: string): void {
    this.searchQuery = search;
    this.searchSubject.next(search);
  }

  onClearFilters(): void {
    this.clearAllFilters();
  }

  clearAllFilters(): void {
    this.currentFilters = {};
    this.searchQuery = '';
    this.filtersSubject.next({});
    this.searchSubject.next('');
    this.updateUrl();
  }

  // View mode handlers
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    this.updateUrl();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // Campaign actions
  onCampaignAction(event: { action: string; campaign: ICampaign }): void {
    const {action, campaign} = event;

    switch (action) {
      case 'view':
        this.router.navigate(['/dashboard/campaigns', campaign.id]);
        break;
      case 'edit':
        this.router.navigate(['/dashboard/campaigns', campaign.id, 'edit']);
        break;
      case 'contribute':
        this.router.navigate(['/dashboard/campaigns', campaign.id, 'contribute']);
        break;
      case 'pledge':
        this.router.navigate(['/dashboard/campaigns', campaign.id, 'pledge']);
        break;
      case 'share':
        this.shareCampaign(campaign);
        break;
      case 'follow':
        this.toggleFollowCampaign(campaign);
        break;
      case 'invite':
        this.inviteToCampaign(campaign);
        break;
      default:
        console.warn('Unknown campaign action:', action);
    }
  }

  // Load more campaigns
  onLoadMore(): void {
    if (this.hasMore && !this.loading) {
      this.currentPage++;
      this.loadCampaigns(this.currentFilters).subscribe({
        next: (response) => {
          this.campaigns = [...this.campaigns, ...response.results];
          this.totalCount = response.count;
          this.hasMore = !!response.next;
        },
        error: (error) => {
          console.error('Error loading more campaigns:', error);
          this.handleLoadError(error);
        }
      });
    }
  }

  // Sharing functionality
  shareCampaign(campaign: ICampaign): void {
    const shareUrl = this.campaignsService.getCampaignShareUrl(campaign.id);
    const shareText = `Check out this fundraising campaign: ${campaign.title}`;

    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Campaign link copied to clipboard!');
      }).catch((error) => {
        console.error('Failed to copy link:', error);
        this.openShareModal(campaign);
      });
    }
  }

  openShareModal(campaign: ICampaign): void {
    // This would open a modal with sharing options
    // For now, just log the action
    console.log('Opening share modal for campaign:', campaign.id);
  }

  // Follow/unfollow functionality
  toggleFollowCampaign(campaign: ICampaign): void {
    const isFollowing = false; // This would be determined from the campaign data
    const action = isFollowing ? 'unfollow' : 'follow';

    this.campaignsService.toggleCampaignFollow(campaign.id, !isFollowing)
      .subscribe({
        next: () => {
          // Update the campaign in the list
          const index = this.campaigns.findIndex(c => c.id === campaign.id);
          if (index !== -1) {
            // Update the follow status in the campaign object
            console.log(`${action}ed campaign:`, campaign.title);
          }
        },
        error: (error) => {
          console.error(`Error ${action}ing campaign:`, error);
        }
      });
  }

  // Invite functionality
  inviteToCampaign(campaign: ICampaign): void {
    this.router.navigate(['/dashboard/campaigns', campaign.id, 'invite']);
  }

  // URL management
  updateUrl(): void {
    const queryParams: any = {...this.currentFilters};

    if (this.searchQuery) {
      queryParams.search = this.searchQuery;
    }

    if (this.viewMode !== 'grid') {
      queryParams.view = this.viewMode;
    }

    // Remove empty values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  // Refresh campaigns
  refreshCampaigns(): void {
    this.currentPage = 1;
    this.campaigns = [];
    this.hasMore = true;
    this.retryCount = 0;
    this.loadCampaigns(this.currentFilters).subscribe({
      next: (response) => {
        this.campaigns = response.results;
        this.totalCount = response.count;
        this.hasMore = !!response.next;
      },
      error: (error) => {
        console.error('Error refreshing campaigns:', error);
        this.handleLoadError(error);
      }
    });
  }

  // Track by function for performance
  trackByCampaignId(index: number, campaign: ICampaign): string {
    return campaign.id;
  }

  // Utility methods
  getTotalContributors(): number {
    return this.campaigns.reduce((total, campaign) => {
      // Assuming each campaign has a contributors count
      // This would need to be added to the campaign interface
      return total + Math.floor(campaign.total_contributed / 50000);
    }, 0);
  }

  getTotalRaised(): number {
    return this.campaigns.reduce((total, campaign) => total + campaign.total_contributed, 0);
  }

  getActiveFiltersCount(): number {
    let count = 0;
    Object.entries(this.currentFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        if (key === 'sort' && value === '-created_at') return; // Default sort
        count++;
      }
    });
    if (this.searchQuery) count++;
    return count;
  }

  // Format methods
  formatCurrency(amount: number): string {
    return this.campaignsService.formatCurrency(amount);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
