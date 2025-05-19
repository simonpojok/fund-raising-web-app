import {ISupportCampaignCategory} from './support_category.interface';

export interface IGetSupportCategoryResponse {
  count: number;
  next: number | undefined;
  previous: number | undefined;
  results: ISupportCampaignCategory[];
}
