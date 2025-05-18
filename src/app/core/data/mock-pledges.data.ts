import {IPledge} from '../interfaces';

export const mockPledges: IPledge[] = [
  {
    id: "p1",
    pledger_name: "Jane Smith",
    description: "Cash pledge",
    type: "monetary",
    monetary_value: 1000000,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: "pending",
    currency: "UGX",
    campaign_id: "1",
    campaign_title: "School Building Fund"
  },
  {
    id: "p2",
    pledger_name: "David Mwesigwa",
    description: "Building materials - Cement",
    type: "item",
    monetary_value: 500000,
    quantity: 20,
    unit: "bags",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    status: "pending",
    currency: "UGX",
    campaign_id: "1",
    campaign_title: "School Building Fund"
  },
  {
    id: "p3",
    pledger_name: "Robert Kizito",
    description: "Cash pledge",
    type: "monetary",
    monetary_value: 750000,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "fulfilled",
    currency: "UGX",
    campaign_id: "1",
    campaign_title: "School Building Fund"
  }
];

export const mockPendingPledges: IPledge[] = [
  {
    id: "pp1",
    pledger_name: "Dr. Sarah Namukasa",
    description: "Medical equipment for the clinic",
    type: "item",
    monetary_value: 3000000,
    quantity: 1,
    unit: "set",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: "pending",
    currency: "UGX",
    campaign_id: "3",
    campaign_title: "Medical Support Fund"
  },
  {
    id: "pp2",
    pledger_name: "Kampala Rotary Club",
    description: "Cash pledge for school desks",
    type: "monetary",
    monetary_value: 2000000,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    status: "pending",
    currency: "UGX",
    campaign_id: "1",
    campaign_title: "School Building Fund"
  },
  {
    id: "pp3",
    pledger_name: "Grace Nakimuli",
    description: "Professional photography services",
    type: "item",
    monetary_value: 500000,
    quantity: 1,
    unit: "package",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "pending",
    currency: "UGX",
    campaign_id: "5",
    campaign_title: "Wedding Fundraiser"
  },
  {
    id: "pp4",
    pledger_name: "Uganda Water Supply Company",
    description: "Water pipes and connections",
    type: "item",
    monetary_value: 1500000,
    quantity: 500,
    unit: "meters",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    status: "pending",
    currency: "UGX",
    campaign_id: "2",
    campaign_title: "Community Water Project"
  },
  {
    id: "pp5",
    pledger_name: "Tech Solutions Ltd",
    description: "Computer equipment for training center",
    type: "item",
    monetary_value: 4000000,
    quantity: 10,
    unit: "units",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    status: "pending",
    currency: "UGX",
    campaign_id: "created-2",
    campaign_title: "Youth Skills Training Center"
  }
];
