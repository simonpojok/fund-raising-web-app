import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import {ICampaignPaymentMethod} from '../interfaces/campaign_payment_method.interface';
import {ISupportCampaignCategory} from '../interfaces/support_category.interface';
import {ISupportedPaymentMethod} from '../interfaces/supported_payment_method.interface';
import {CreateCampaignRequest} from '../interfaces/create-campaign-request.interface';


export interface CampaignResponse {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  created_at: string;
  is_draft: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CreateCampaignService {
  private readonly apiUrl = `${environment.apiUrl}/campaigns/`;

  constructor(private http: HttpClient) {}

  // Get supported categories
  getSupportedCategories(): Observable<ISupportCampaignCategory[]> {
    return this.http.get<ISupportCampaignCategory[]>(`${this.apiUrl}categories/`);
  }

  // Get supported payment methods
  getSupportedPaymentMethods(): Observable<ISupportedPaymentMethod[]> {
    return this.http.get<ISupportedPaymentMethod[]>(`${this.apiUrl}payment-methods/`);
  }

  // Create a new campaign
  createCampaign(campaignData: CreateCampaignRequest): Observable<CampaignResponse> {
    const formData = this.createFormData(campaignData);
    return this.http.post<CampaignResponse>(this.apiUrl, formData);
  }

  // Save campaign as draft
  saveDraft(campaignData: Partial<CreateCampaignRequest>): Observable<any> {
    const formData = this.createFormData(campaignData);
    return this.http.post<any>(`${this.apiUrl}draft/`, formData);
  }

  // Load draft campaign
  loadDraft(draftId: string): Observable<CreateCampaignRequest> {
    return this.http.get<CreateCampaignRequest>(`${this.apiUrl}draft/${draftId}/`);
  }

  // Create FormData for file uploads
  private createFormData(campaignData: Partial<CreateCampaignRequest>): FormData {
    const formData = new FormData();

    // Add all non-file fields
    Object.keys(campaignData).forEach(key => {
      // @ts-ignore
      if (key !== 'banner' && key !== 'video' && campaignData[key] !== undefined) {
        if (key === 'payment_methods') {
          formData.append(key, JSON.stringify(campaignData[key]));
        } else {
          // @ts-ignore
          formData.append(key, campaignData[key] as string);
        }
      }
    });

    // Add files if present
    if (campaignData.banner) {
      formData.append('banner', campaignData.banner);
    }
    if (campaignData.video) {
      formData.append('video', campaignData.video);
    }

    return formData;
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

    if (!campaignData.coordinator || campaignData.coordinator.trim().length === 0) {
      errors.push('Coordinator is required');
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

  // Upload campaign image/video
  uploadFile(file: File, type: 'image' | 'video'): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<{ url: string }>(`${this.apiUrl}upload/`, formData);
  }
}
