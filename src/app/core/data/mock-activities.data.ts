import {ICampaignActivity} from '../interfaces';

export const mockActivities: ICampaignActivity[] = [
  {
    id: "act-1",
    type: "contribution",
    message: "Margaret Achieng contributed 500,000 UGX to the campaign",
    campaign_id: "1",
    campaign_title: "School Building Fund",
    user_id: "contrib-5",
    user_name: "Margaret Achieng",
    user_photo: "https://randomuser.me/api/portraits/women/3.jpg",
    amount: 500000,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: "act-2",
    type: "contribution",
    message: "Geoffrey Okot contributed 300,000 UGX to the community water project",
    campaign_id: "2",
    campaign_title: "Community Water Project",
    user_id: "contrib-8",
    user_name: "Geoffrey Okot",
    user_photo: "https://randomuser.me/api/portraits/men/5.jpg",
    amount: 300000,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "act-3",
    type: "pledge",
    message: "Grace Nakimuli pledged professional photography services",
    campaign_id: "5",
    campaign_title: "Wedding Fundraiser",
    user_id: "pledge-3",
    user_name: "Grace Nakimuli",
    user_photo: "https://randomuser.me/api/portraits/women/5.jpg",
    amount: 500000,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "act-4",
    type: "contribution",
    message: "Emmanuel Ssebuliba contributed 100,000 UGX to the wedding fundraiser",
    campaign_id: "5",
    campaign_title: "Wedding Fundraiser",
    user_id: "contrib-10",
    user_name: "Emmanuel Ssebuliba",
    amount: 100000,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
  },
  {
    id: "act-5",
    type: "contribution",
    message: "Anonymous contributor donated 1,000,000 UGX",
    campaign_id: "1",
    campaign_title: "School Building Fund",
    amount: 1000000,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: "act-6",
    type: "pledge",
    message: "Dr. Sarah Namukasa pledged medical equipment worth 3,000,000 UGX",
    campaign_id: "3",
    campaign_title: "Medical Support Fund",
    user_id: "pledge-1",
    user_name: "Dr. Sarah Namukasa",
    user_photo: "https://randomuser.me/api/portraits/women/6.jpg",
    amount: 3000000,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: "act-7",
    type: "contribution",
    message: "Grace Nalubega contributed 150,000 UGX to the water project",
    campaign_id: "2",
    campaign_title: "Community Water Project",
    user_id: "contrib-7",
    user_name: "Grace Nalubega",
    user_photo: "https://randomuser.me/api/portraits/women/4.jpg",
    amount: 150000,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
  },
  {
    id: "act-8",
    type: "contribution",
    message: "James Okello contributed 250,000 UGX to the school building fund",
    campaign_id: "1",
    campaign_title: "School Building Fund",
    user_id: "contrib-6",
    user_name: "James Okello",
    user_photo: "https://randomuser.me/api/portraits/men/4.jpg",
    amount: 250000,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: "act-9",
    type: "contribution",
    message: "Anonymous contributor donated 500,000 UGX",
    campaign_id: "3",
    campaign_title: "Medical Support Fund",
    amount: 500000,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
  },
  {
    id: "act-10",
    type: "update",
    message: "Campaign update: Medical specialist consultation scheduled for next week",
    campaign_id: "3",
    campaign_title: "Medical Support Fund",
    user_id: "creator-3",
    user_name: "Geoffrey Okot",
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() // 9 days ago
  },
  {
    id: "act-11",
    type: "contribution",
    message: "Dr. Patricia Nakamya contributed 2,000,000 UGX to the school building fund",
    campaign_id: "1",
    campaign_title: "School Building Fund",
    user_id: "contrib-1",
    user_name: "Dr. Patricia Nakamya",
    user_photo: "https://randomuser.me/api/portraits/women/2.jpg",
    amount: 2000000,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    id: "act-12",
    type: "pledge",
    message: "Uganda Water Supply Company pledged water pipes and connections",
    campaign_id: "2",
    campaign_title: "Community Water Project",
    user_id: "pledge-4",
    user_name: "Uganda Water Supply Company",
    amount: 1500000,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
  },
  {
    id: "act-13",
    type: "contribution",
    message: "Rev. Samuel Musoke contributed 1,000,000 UGX to Geoffrey's medical fund",
    campaign_id: "3",
    campaign_title: "Medical Support Fund",
    user_id: "contrib-2",
    user_name: "Rev. Samuel Musoke",
    user_photo: "https://randomuser.me/api/portraits/men/2.jpg",
    amount: 1000000,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
  },
  {
    id: "act-14",
    type: "update",
    message: "Campaign update: Construction materials delivered to the site",
    campaign_id: "1",
    campaign_title: "School Building Fund",
    user_id: "creator-1",
    user_name: "John Doe",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
  },
  {
    id: "act-15",
    type: "contribution",
    message: "Moses Wanyama contributed 750,000 UGX to the school building fund",
    campaign_id: "1",
    campaign_title: "School Building Fund",
    user_id: "contrib-4",
    user_name: "Moses Wanyama",
    user_photo: "https://randomuser.me/api/portraits/men/3.jpg",
    amount: 750000,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: "act-16",
    type: "comment",
    message: "Margaret Achieng commented: This is such a worthy cause. Education transforms lives!",
    campaign_id: "1",
    campaign_title: "School Building Fund",
    user_id: "contrib-5",
    user_name: "Margaret Achieng",
    user_photo: "https://randomuser.me/api/portraits/women/3.jpg",
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() // 18 days ago
  },
  {
    id: "act-17",
    type: "update",
    message: "Campaign update: Venue booked and invitations being prepared",
    campaign_id: "5",
    campaign_title: "Wedding Fundraiser",
    user_id: "creator-5",
    user_name: "Robert Kizito",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() // 20 days ago
  },
  {
    id: "act-18",
    type: "pledge",
    message: "Kampala Rotary Club pledged 2,000,000 UGX for school desks",
    campaign_id: "1",
    campaign_title: "School Building Fund",
    user_id: "pledge-2",
    user_name: "Kampala Rotary Club",
    amount: 2000000,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
  }
];
