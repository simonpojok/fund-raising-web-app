export interface ICampaignActivity {
  id: string;
  type: 'contribution' | 'pledge' | 'update' | 'comment';
  message: string;
  campaign_id: string;
  campaign_title?: string;
  user_id?: string;
  user_name?: string;
  user_photo?: string;
  amount?: number;
  created_at: string; // ISO date string
}
