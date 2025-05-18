export interface CampaignBasicInfo {
  title: string;
  description: string;
  beneficiary: string;
  targetAmount: number;
  category: string;
  isUrgent: boolean;
}

export interface CampaignDetails {
  eventDate: string;
  location: string;
  massDetails?: string;
  celebrant?: string;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
}

export interface CampaignSettings {
  isPublic: boolean;
  allowAnonymousContributions: boolean;
  includePledges: boolean;
  sendThankYouMessages: boolean;
  allowComments: boolean;
  isInvitationOnly: boolean;
  autoApproveInvitees: boolean;
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  name: string;
  number: string;
}

export interface CreateCampaignData extends CampaignBasicInfo, CampaignDetails, CampaignSettings {
  isDraft?: boolean;
  createdAt?: string;
}

export interface CreateCampaignResponse {
  id: string;
  title: string;
  slug?: string;
  createdAt: string;
  isDraft: boolean;
}

export interface StepperStep {
  id: number;
  title: string;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface DraftSaveResponse {
  message: string;
  id: string;
}
