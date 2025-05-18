import {IContribution} from '../interfaces';

export const mockContributions: IContribution[] = [
  // Contributions for Campaign 1 (School Building Fund)
  {
    id: "c1",
    contributor_name: "Margaret Achieng",
    contributor_phone: "+256701234567",
    contributor_email: "margaret.achieng@example.com",
    amount: 500000,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: "completed",
    payment_method: "MTN Mobile Money",
    transaction_id: "TX123456789",
    note: "For the future of our children",
    is_anonymous: false,
    campaign_id: "1",
    campaign_title: "School Building Fund"
  },
  {
    id: "c2",
    contributor_name: "Anonymous",
    amount: 1000000,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: "completed",
    payment_method: "Bank Transfer",
    is_anonymous: true,
    campaign_id: "1",
    campaign_title: "School Building Fund"
  },
  {
    id: "c3",
    contributor_name: "James Okello",
    contributor_phone: "+256704567890",
    contributor_email: "james.okello@example.com",
    amount: 250000,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: "completed",
    payment_method: "Airtel Money",
    transaction_id: "TX987654321",
    note: "Education is the key to development",
    is_anonymous: false,
    campaign_id: "1",
    campaign_title: "School Building Fund"
  },
  {
    id: "c4",
    contributor_name: "Dr. Patricia Nakamya",
    contributor_phone: "+256705678901",
    contributor_email: "patricia.nakamya@example.com",
    amount: 2000000,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: "completed",
    payment_method: "Bank Transfer",
    transaction_id: "TX555444333",
    note: "Supporting quality education for all",
    is_anonymous: false,
    campaign_id: "1",
    campaign_title: "School Building Fund"
  },
  {
    id: "c5",
    contributor_name: "Moses Wanyama",
    contributor_phone: "+256703456789",
    contributor_email: "moses.wanyama@example.com",
    amount: 750000,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    status: "completed",
    payment_method: "MTN Mobile Money",
    transaction_id: "TX111222333",
    note: "God bless this initiative",
    is_anonymous: false,
    campaign_id: "1",
    campaign_title: "School Building Fund"
  },
  // More contributions for other campaigns
  {
    id: "c6",
    contributor_name: "Geoffrey Okot",
    contributor_phone: "+256772956676",
    contributor_email: "geoffrey.okot@example.com",
    amount: 300000,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "completed",
    payment_method: "MTN Mobile Money",
    transaction_id: "TX666777888",
    note: "Happy to support the community",
    is_anonymous: false,
    campaign_id: "2",
    campaign_title: "Community Water Project"
  },
  {
    id: "c7",
    contributor_name: "Grace Nalubega",
    contributor_phone: "+256708901234",
    contributor_email: "grace.nalubega@example.com",
    amount: 150000,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    status: "completed",
    payment_method: "Airtel Money",
    transaction_id: "TX999888777",
    note: "Clean water for all",
    is_anonymous: false,
    campaign_id: "2",
    campaign_title: "Community Water Project"
  },
  {
    id: "c8",
    contributor_name: "Anonymous",
    amount: 500000,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    status: "completed",
    payment_method: "Cash",
    is_anonymous: true,
    campaign_id: "3",
    campaign_title: "Medical Support Fund"
  },
  {
    id: "c9",
    contributor_name: "Rev. Samuel Musoke",
    contributor_phone: "+256709012345",
    contributor_email: "samuel.musoke@example.com",
    amount: 1000000,
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    status: "completed",
    payment_method: "Bank Transfer",
    transaction_id: "TX444555666",
    note: "Praying for Geoffrey's healing",
    is_anonymous: false,
    campaign_id: "3",
    campaign_title: "Medical Support Fund"
  },
  {
    id: "c10",
    contributor_name: "Emmanuel Ssebuliba",
    contributor_phone: "+256701112233",
    contributor_email: "emmanuel.ssebuliba@example.com",
    amount: 100000,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    status: "pending",
    payment_method: "MTN Mobile Money",
    transaction_id: "TX777888999",
    note: "Congratulations to the couple!",
    is_anonymous: false,
    campaign_id: "5",
    campaign_title: "Wedding Fundraiser"
  }
];
