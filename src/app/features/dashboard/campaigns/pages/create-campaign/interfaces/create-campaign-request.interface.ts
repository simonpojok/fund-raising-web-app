import {ICampaignPaymentMethod} from './campaign_payment_method.interface';

export interface CreateCampaignRequest {
  title: string;
  description: string;
  end_date: string;
  coordinator: string;
  target_amount: number;
  category: string; // UUID of the category
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
  banner?: File; // Optional
  video?: File; // Optional
}
