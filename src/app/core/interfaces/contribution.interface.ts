export interface IContribution {
  id: string;
  contributor_name: string;
  contributor_phone?: string;
  contributor_email?: string;
  amount: number;
  date: string; // ISO date string
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: string;
  transaction_id?: string;
  note?: string;
  is_anonymous: boolean;
  campaign_id: string;
  campaign_title?: string;
}
