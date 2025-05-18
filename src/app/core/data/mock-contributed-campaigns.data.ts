import {ICampaign} from '../interfaces';

export const mockContributedCampaigns: ICampaign[] = [
  {
    id: "1",
    title: "School Building Fund",
    description: "We are raising funds to build a new classroom block for the local primary school. The current classrooms are overcrowded and in poor condition. The new block will provide a better learning environment for the children.",
    short_description: "Help us build a new classroom block for the local primary school.",
    beneficiary: "St. Mary's Primary School",
    event_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    location: "Kampala, Uganda",
    target_amount: 50000000, // 50 million UGX
    total_contributed: 20000000,
    total_pledged: 5000000,
    contribution_progress: 0.4,
    progress_percentage: 40,
    days_remaining: 60,
    is_active: true,
    coordinator_name: "John Doe",
    coordinator_email: "john.doe@example.com",
    coordinator_phone: "+256701234567",
    is_public: true,
    allow_anonymous_contributions: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updated_at: new Date().toISOString(),
    banner_url: "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dWdhbmRhJTIwc2Nob29sfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Education",
    is_urgent: true
  },
  {
    id: "2",
    title: "Community Water Project",
    description: "Access to clean water is a major challenge in our community. This fundraiser aims to install water points across the village to ensure everyone has access to clean and safe water.",
    short_description: "Help us provide clean water to our community.",
    beneficiary: "Lweza Community",
    event_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    location: "Lweza, Wakiso",
    target_amount: 35000000, // 35 million UGX
    total_contributed: 28000000,
    total_pledged: 3000000,
    contribution_progress: 0.8,
    progress_percentage: 80,
    days_remaining: 90,
    is_active: true,
    coordinator_name: "Jane Smith",
    coordinator_email: "jane.smith@example.com",
    coordinator_phone: "+256702345678",
    is_public: true,
    allow_anonymous_contributions: true,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    updated_at: new Date().toISOString(),
    banner_url: "https://images.unsplash.com/photo-1581544291347-d25aef81a218?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2F0ZXIlMjBwcm9qZWN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Community Project",
    is_urgent: false
  },
  {
    id: "3",
    title: "Medical Support Fund",
    description: "Geoffrey needs urgent medical treatment abroad. He has been diagnosed with a rare heart condition that requires specialized surgery not available in Uganda.",
    short_description: "Help Geoffrey get the heart surgery he needs.",
    beneficiary: "Geoffrey Okot",
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    location: "Gulu, Uganda",
    target_amount: 75000000, // 75 million UGX
    total_contributed: 15000000,
    total_pledged: 10000000,
    contribution_progress: 0.2,
    progress_percentage: 20,
    days_remaining: 30,
    is_active: true,
    coordinator_name: "David Mwesigwa",
    coordinator_email: "david.mwesigwa@example.com",
    coordinator_phone: "+256703456789",
    is_public: true,
    allow_anonymous_contributions: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updated_at: new Date().toISOString(),
    banner_url: "https://images.unsplash.com/photo-1579154392429-0e6b4e850ad2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9zcGl0YWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    category: "Healthcare",
    is_urgent: true
  },
  {
    id: "5",
    title: "Wedding Fundraiser",
    description: "Sarah and James are getting married! They are raising funds to have a wonderful celebration with family and friends. Your contribution will help make their special day memorable.",
    short_description: "Help Sarah and James celebrate their wedding day.",
    beneficiary: "Sarah & James",
    event_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    location: "Kampala, Uganda",
    target_amount: 10000000, // 10 million UGX
    total_contributed: 8000000,
    total_pledged: 1000000,
    contribution_progress: 0.8,
    progress_percentage: 80,
    days_remaining: 45,
    is_active: true,
    coordinator_name: "Robert Kizito",
    coordinator_email: "robert.kizito@example.com",
    coordinator_phone: "+256705678901",
    is_public: true,
    allow_anonymous_contributions: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updated_at: new Date().toISOString(),
    banner_url: "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Personal",
    is_urgent: false
  },
  {
    id: "contrib-5",
    title: "Orphanage Food Support",
    description: "Providing monthly food supplies to the children at Hope Orphanage. These kids depend on our support for their daily meals and nutritional needs.",
    short_description: "Help feed orphaned children with monthly food supplies.",
    beneficiary: "Hope Orphanage",
    event_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days from now
    location: "Masaka, Uganda",
    target_amount: 15000000, // 15 million UGX
    total_contributed: 12000000,
    total_pledged: 2000000,
    contribution_progress: 0.8,
    progress_percentage: 80,
    days_remaining: 180,
    is_active: true,
    coordinator_name: "Sister Mary",
    coordinator_email: "sister.mary@hopeorphanage.org",
    coordinator_phone: "+256706789012",
    is_public: true,
    allow_anonymous_contributions: true,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    updated_at: new Date().toISOString(),
    banner_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8b3JwaGFuYWdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Community Project",
    is_urgent: false
  }
];
