export interface IPledge {
  id: string;
  pledger_name: string;
  description: string;
  type: 'monetary' | 'item';
  monetary_value: number;
  quantity?: number;
  unit?: string;
  date: string; // ISO date string
  status: 'pending' | 'fulfilled';
  currency?: string;
  campaign_id: string;
  campaign_title?: string;
}
