import { IContributor } from '../interfaces';

export const mockContributors: IContributor[] = [
  {
    id: "contrib-1",
    name: "Dr. Patricia Nakamya",
    photo_url: "https://randomuser.me/api/portraits/women/2.jpg",
    total_contributed: 2500000,
    contribution_count: 3,
    last_contribution_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    id: "contrib-2",
    name: "Rev. Samuel Musoke",
    photo_url: "https://randomuser.me/api/portraits/men/2.jpg",
    total_contributed: 2000000,
    contribution_count: 2,
    last_contribution_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
  },
  {
    id: "contrib-3",
    name: "Anonymous Contributors",
    total_contributed: 1500000,
    contribution_count: 5,
    last_contribution_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: "contrib-4",
    name: "Moses Wanyama",
    photo_url: "https://randomuser.me/api/portraits/men/3.jpg",
    total_contributed: 1250000,
    contribution_count: 4,
    last_contribution_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: "contrib-5",
    name: "Margaret Achieng",
    photo_url: "https://randomuser.me/api/portraits/women/3.jpg",
    total_contributed: 1000000,
    contribution_count: 3,
    last_contribution_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: "contrib-6",
    name: "James Okello",
    photo_url: "https://randomuser.me/api/portraits/men/4.jpg",
    total_contributed: 750000,
    contribution_count: 2,
    last_contribution_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: "contrib-7",
    name: "Grace Nalubega",
    photo_url: "https://randomuser.me/api/portraits/women/4.jpg",
    total_contributed: 500000,
    contribution_count: 2,
    last_contribution_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
  },
  {
    id: "contrib-8",
    name: "Geoffrey Okot",
    photo_url: "https://randomuser.me/api/portraits/men/5.jpg",
    total_contributed: 400000,
    contribution_count: 1,
    last_contribution_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  }
];
