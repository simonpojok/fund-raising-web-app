export interface ICampaign {
  id: string;
  title: string;
  description: string;
  beneficiary: string;
  event_date: string; // ISO date string
  location: string;
  target_amount: number;
  coordinator_name: string;
  coordinator_email?: string;
  coordinator_phone?: string;
  is_public: boolean;
  allow_anonymous_contributions: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  total_contributed: number;
  total_pledged: number;
  contribution_progress: number; // 0 to 1
  progress_percentage: number; // 0 to 100
  days_remaining: number;
  is_active: boolean;
  short_description: string;
  banner_url?: string;
  category?: string;
  is_urgent?: boolean;
}
