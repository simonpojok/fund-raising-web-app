import { Component, Input, OnInit } from '@angular/core';
import { ISupportCampaignCategory } from '../../interfaces/support_category.interface';
import { ISupportedPaymentMethod } from '../../interfaces/supported_payment_method.interface';

@Component({
  selector: 'app-campaign-preview-card',
  templateUrl: './campaign-preview-card.component.html',
  styleUrls: ['./campaign-preview-card.component.scss'],
  standalone: false,
})
export class CampaignPreviewCardComponent implements OnInit {
  @Input() basicInfo: any = {};
  @Input() settings: any = {};
  @Input() currentUser: any = null;
  @Input() categories: ISupportCampaignCategory[] = [];
  @Input() supportedPaymentMethods: ISupportedPaymentMethod[] = [];
  @Input() bannerPreview: string | null = null;
  @Input() videoPreview: string | null = null;
  @Input() step: number = 1;

  ngOnInit(): void {}

  // Format currency for display
  formatCurrency(amount: number): string {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get category name by ID
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  // Get payment method name by ID
  getPaymentMethodName(methodId: string): string {
    const method = this.supportedPaymentMethods.find(m => m.id === methodId);
    return method ? method.name : '';
  }

  // Get privacy level text
  getPrivacyLevel(): string {
    if (this.settings.is_invitation_only) return 'Private (Invitation Only)';
    if (this.settings.is_public) return 'Public';
    return 'Unlisted';
  }

  // Get enabled features
  getEnabledFeatures(): string[] {
    const features: string[] = [];

    if (this.settings.allow_anonymous_contributions) {
      features.push('Anonymous contributions');
    }
    if (this.settings.include_pledges) {
      features.push('Pledges accepted');
    }
    if (this.settings.allow_comments) {
      features.push('Comments allowed');
    }
    if (this.settings.send_thank_you_messages) {
      features.push('Thank you messages');
    }

    return features;
  }

  // Calculate days until end date
  getDaysUntilEnd(): number {
    if (!this.basicInfo.end_date) return 0;

    const endDate = new Date(this.basicInfo.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if data is complete
  isDataComplete(): boolean {
    return !!(
      this.basicInfo.title &&
      this.basicInfo.description &&
      this.basicInfo.target_amount &&
      this.basicInfo.category &&
      this.basicInfo.end_date &&
      this.settings.payment_methods &&
      this.settings.payment_methods.length > 0
    );
  }

  // Get completion percentage
  getCompletionPercentage(): number {
    let completed = 0;
    const total = 8; // Total required fields

    if (this.basicInfo.title) completed++;
    if (this.basicInfo.description) completed++;
    if (this.basicInfo.target_amount) completed++;
    if (this.basicInfo.category) completed++;
    if (this.basicInfo.end_date) completed++;
    if (this.currentUser) completed++;
    if (this.settings.payment_methods && this.settings.payment_methods.length > 0) completed++;
    if (this.step === 2) completed++; // Settings configured

    return Math.round((completed / total) * 100);
  }
}
