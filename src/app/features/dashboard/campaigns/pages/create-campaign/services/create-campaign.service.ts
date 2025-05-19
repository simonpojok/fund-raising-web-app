import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../../environments/environment';
import {CreateCampaignRequest} from '../interfaces/create-campaign-request.interface';
import {ISupportCampaignCategory} from '../interfaces/support_category.interface';
import {ISupportedPaymentMethod} from '../interfaces/supported_payment_method.interface';
import {IGetSupportCategoryResponse} from '../interfaces/get-support-category-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateCampaignService {
  private readonly apiUrl = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {
  }

  // Create a new campaign
  createCampaign(campaignData: CreateCampaignRequest): Observable<any> {
    const formData = new FormData();

    // Append all text fields
    formData.append('title', campaignData.title);
    formData.append('description', campaignData.description);
    formData.append('end_date', campaignData.end_date);
    formData.append('coordinator', campaignData.coordinator);
    formData.append('target_amount', campaignData.target_amount.toString());
    formData.append('category', campaignData.category);
    formData.append('is_urgent', campaignData.is_urgent.toString());
    formData.append('is_public', campaignData.is_public.toString());
    formData.append('include_pledges', campaignData.include_pledges.toString());
    formData.append('allow_anonymous_contributions', campaignData.allow_anonymous_contributions.toString());
    formData.append('send_thank_you_messages', campaignData.send_thank_you_messages.toString());
    formData.append('allow_comments', campaignData.allow_comments.toString());
    formData.append('is_invitation_only', campaignData.is_invitation_only.toString());
    formData.append('auto_approve_invitees', campaignData.auto_approve_invitees.toString());
    formData.append('is_published', campaignData.is_published.toString());

    // Append payment methods as JSON
    formData.append('payment_methods', JSON.stringify(campaignData.payment_methods));

    // Append files if present
    if (campaignData.banner) {
      formData.append('banner', campaignData.banner);
    }
    if (campaignData.video) {
      formData.append('video', campaignData.video);
    }

    return this.http.post<any>(`${this.apiUrl}/`, formData);
  }

  // Save campaign as draft
  saveDraft(campaignData: Partial<CreateCampaignRequest>): Observable<any> {
    const draftData = {...campaignData, is_published: false};
    return this.createCampaign(draftData as CreateCampaignRequest);
  }

  // Get campaign categories
  getCampaignCategories(): Observable<IGetSupportCategoryResponse> {
    return this.http.get<IGetSupportCategoryResponse>(`${environment.apiUrl}/categories/`);
  }

  // Get supported payment methods
  getSupportedPaymentMethods(): Observable<ISupportedPaymentMethod[]> {
    return this.http.get<ISupportedPaymentMethod[]>(`${environment.apiUrl}/payment-methods/`);
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

    if (!campaignData.target_amount || campaignData.target_amount < 10000) {
      errors.push('Target amount must be at least 10,000 UGX');
    }

    if (!campaignData.category) {
      errors.push('Campaign category is required');
    }

    // Event details validation
    if (!campaignData.end_date) {
      errors.push('End date is required');
    } else {
      const endDate = new Date(campaignData.end_date);
      const today = new Date();
      if (endDate <= today) {
        errors.push('End date must be in the future');
      }
    }

    if (!campaignData.coordinator) {
      errors.push('Coordinator is required');
    }

    // Payment methods validation
    if (!campaignData.payment_methods || campaignData.payment_methods.length === 0) {
      errors.push('At least one payment method is required');
    } else {
      campaignData.payment_methods.forEach((method, index) => {
        if (!method.id) {
          errors.push(`Payment method ${index + 1} type is required`);
        }
        if (!method.account_name || method.account_name.trim().length === 0) {
          errors.push(`Payment method ${index + 1} account name is required`);
        }
        if (!method.account_number || method.account_number.trim().length === 0) {
          errors.push(`Payment method ${index + 1} account number is required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Upload files (if needed separately)
  uploadFile(file: File, type: 'banner' | 'video'): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append(type, file);

    return this.http.post<{ url: string }>(`${this.apiUrl}/upload/`, formData);
  }
}
