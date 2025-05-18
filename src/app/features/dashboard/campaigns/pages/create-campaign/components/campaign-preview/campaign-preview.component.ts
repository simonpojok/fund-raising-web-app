import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-campaign-preview',
  templateUrl: './campaign-preview.component.html',
  standalone: false,
})
export class CampaignPreviewComponent implements OnInit {
  @Input() campaignData: any = {};
  @Input() showShareButton: boolean = false; // Controls when to show share button

  constructor() {
  }

  ngOnInit(): void {
  }

  // Format currency
  formatCurrency(amount: number): string {
    if (!amount) return '0';
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Format date
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

  // Get payment methods summary
  getPaymentMethodsText(): string {
    if (!this.campaignData.paymentMethods || this.campaignData.paymentMethods.length === 0) {
      return 'No payment methods configured';
    }

    const methods = this.campaignData.paymentMethods.map((method: any) => method.name);
    return methods.join(', ');
  }

  // Get privacy level text
  getPrivacyText(): string {
    if (this.campaignData.isInvitationOnly) {
      return 'Private (Invitation Only)';
    }
    if (this.campaignData.isPublic) {
      return 'Public';
    }
    return 'Unlisted';
  }

  // Get enabled features
  getEnabledFeatures(): string[] {
    const features: string[] = [];

    if (this.campaignData.allowAnonymousContributions) {
      features.push('Anonymous contributions');
    }
    if (this.campaignData.includePledges) {
      features.push('Pledges');
    }
    if (this.campaignData.allowComments) {
      features.push('Comments');
    }
    if (this.campaignData.sendThankYouMessages) {
      features.push('Thank you messages');
    }

    return features;
  }

  // Check if all required data is present
  isDataComplete(): boolean {
    return !!(
      this.campaignData.title &&
      this.campaignData.description &&
      this.campaignData.beneficiary &&
      this.campaignData.targetAmount &&
      this.campaignData.category &&
      this.campaignData.eventDate &&
      this.campaignData.location &&
      this.campaignData.coordinatorName &&
      this.campaignData.coordinatorEmail &&
      this.campaignData.coordinatorPhone &&
      this.campaignData.paymentMethods &&
      this.campaignData.paymentMethods.length > 0
    );
  }

  // Get missing required fields
  getMissingFields(): string[] {
    const missing: string[] = [];

    if (!this.campaignData.title) missing.push('Campaign title');
    if (!this.campaignData.description) missing.push('Description');
    if (!this.campaignData.beneficiary) missing.push('Beneficiary');
    if (!this.campaignData.targetAmount) missing.push('Target amount');
    if (!this.campaignData.category) missing.push('Category');
    if (!this.campaignData.eventDate) missing.push('Event date');
    if (!this.campaignData.location) missing.push('Location');
    if (!this.campaignData.coordinatorName) missing.push('Coordinator name');
    if (!this.campaignData.coordinatorEmail) missing.push('Coordinator email');
    if (!this.campaignData.coordinatorPhone) missing.push('Coordinator phone');
    if (!this.campaignData.paymentMethods || this.campaignData.paymentMethods.length === 0) {
      missing.push('Payment methods');
    }

    return missing;
  }

  // Handle share campaign
  shareCampaign(): void {
    // Generate a shareable link (in a real app, this would be the actual campaign URL)
    const campaignLink = `${window.location.origin}/campaigns/${this.campaignData.id || 'preview'}`;

    // If Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: this.campaignData.title || 'Fundraising Campaign',
        text: this.campaignData.description || 'Support this important cause',
        url: campaignLink,
      })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(campaignLink)
        .then(() => {
          alert('Campaign link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy link: ', err);
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = campaignLink;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Campaign link copied to clipboard!');
        });
    }
  }
}
