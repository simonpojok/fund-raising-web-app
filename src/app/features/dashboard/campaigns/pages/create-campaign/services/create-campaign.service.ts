import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, delay} from 'rxjs';
import {environment} from '../../../../../../../environments/environment';
import {ICampaignPaymentMethod} from '../interfaces/campaign_payment_method.interface';

export interface CreateCampaignRequest {
  title: string;
  description: string;
  end_date: string;
  coordinator: string;
  target_amount: number;
  category: string;
  is_urgent: boolean;
  is_public: boolean;
  include_pledges: boolean;
  allow_anonymous_contributions: boolean;
  send_thank_you_messages: boolean;
  allow_comments: boolean;
  is_invitation_only: boolean;
  auto_approve_invitees: boolean;
  payment_methods: Array<ICampaignPaymentMethod>;
  is_published: boolean;
  banner: File,
  video: File,
}

export interface CampaignResponse {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  createdAt: string;
  isDraft: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CreateCampaignService {
  private readonly apiUrl = `${environment.apiUrl}/campaigns/`;

  constructor(private http: HttpClient) {
  }

  // Create a new campaign
  createCampaign(campaignData: CreateCampaignRequest): Observable<CampaignResponse> {
    console.log(campaignData);
    return this.http.post<CampaignResponse>(this.apiUrl, campaignData);
  }

  // Save campaign as draft
  saveDraft(campaignData: Partial<CreateCampaignRequest>): Observable<any> {
    // Mock implementation - replace with actual API call
    const draftData = {...campaignData, isDraft: true};
    return of({message: 'Draft saved successfully', id: `draft-${Date.now()}`}).pipe(delay(1000));

    // Real implementation would be:
    // return this.http.post<any>(`${this.apiUrl}/draft`, draftData);
  }

  // Load draft campaign
  loadDraft(draftId: string): Observable<CreateCampaignRequest> {
    // Mock implementation - replace with actual API call
    return this.http.get<CreateCampaignRequest>(`${this.apiUrl}/draft/${draftId}`);
  }

  // Validate campaign data
  validateCampaignData(campaignData: CreateCampaignRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic info validation
    if (!campaignData.title || campaignData.title.trim().length < 5) {
      errors.push('Campaign title must be at least 5 characters');
    }

    if (!campaignData.description || campaignData.description.trim().length < 50) {
      errors.push('Campaign description must be at least 50 characters');
    }

    if (!campaignData.beneficiary || campaignData.beneficiary.trim().length === 0) {
      errors.push('Beneficiary is required');
    }

    if (!campaignData.targetAmount || campaignData.targetAmount < 10000) {
      errors.push('Target amount must be at least 10,000 UGX');
    }

    if (!campaignData.category) {
      errors.push('Campaign category is required');
    }

    // Event details validation
    if (!campaignData.end_date) {
      errors.push('Event date is required');
    } else {
      const eventDate = new Date(campaignData.end_date);
      const today = new Date();
      if (eventDate <= today) {
        errors.push('Event date must be in the future');
      }
    }

    if (!campaignData.location || campaignData.location.trim().length === 0) {
      errors.push('Event location is required');
    }

    // Coordinator validation
    if (!campaignData.coordinatorName || campaignData.coordinatorName.trim().length === 0) {
      errors.push('Coordinator name is required');
    }

    if (!campaignData.coordinatorEmail || !this.isValidEmail(campaignData.coordinatorEmail)) {
      errors.push('Valid coordinator email is required');
    }

    if (!campaignData.coordinatorPhone || campaignData.coordinatorPhone.trim().length === 0) {
      errors.push('Coordinator phone number is required');
    }

    // Payment methods validation
    if (!campaignData.paymentMethods || campaignData.paymentMethods.length === 0) {
      errors.push('At least one payment method is required');
    } else {
      campaignData.paymentMethods.forEach((method, index) => {
        if (!method.name || method.name.trim().length === 0) {
          errors.push(`Payment method ${index + 1} name is required`);
        }
        if (!method.number || method.number.trim().length === 0) {
          errors.push(`Payment method ${index + 1} account details are required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to validate email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get campaign categories
  getCampaignCategories(): Observable<Array<{ value: string; label: string }>> {
    const categories = [
      {value: 'Education', label: 'Education'},
      {value: 'Healthcare', label: 'Healthcare'},
      {value: 'Community Project', label: 'Community Project'},
      {value: 'Religious', label: 'Religious'},
      {value: 'Personal', label: 'Personal'},
      {value: 'Emergency', label: 'Emergency'},
      {value: 'Sports', label: 'Sports'},
      {value: 'Environmental', label: 'Environmental'},
      {value: 'Other', label: 'Other'}
    ];

    return of(categories);
  }

  // Upload campaign banner/images (if needed)
  uploadCampaignImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    // Mock implementation - replace with actual API call
    return of({url: `https://example.com/uploads/${file.name}`}).pipe(delay(2000));

    // Real implementation would be:
    // return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
