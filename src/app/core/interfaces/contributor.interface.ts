export interface IContributor {
  id: string;
  name: string;
  photo_url?: string;
  total_contributed: number;
  contribution_count: number;
  last_contribution_date: string; // ISO date string
}
