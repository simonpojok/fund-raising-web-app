import { ICampaign } from '../interfaces';

export const mockCreatedCampaigns: ICampaign[] = [
  {
    id: "created-1",
    title: "My Church Building Fund",
    description: "I'm leading the fundraising effort for our church's expansion project. We need to build a new wing to accommodate our growing congregation and provide space for community activities.",
    short_description: "Help us expand our church to serve the growing community.",
    beneficiary: "St. Peter's Anglican Church",
    event_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days from now
    location: "Jinja, Uganda",
    target_amount: 80000000, // 80 million UGX
    total_contributed: 45000000,
    total_pledged: 12000000,
    contribution_progress: 0.5625,
    progress_percentage: 56,
    days_remaining: 75,
    is_active: true,
    coordinator_name: "Geoffrey Okot",
    coordinator_email: "geoffrey.okot@example.com",
    coordinator_phone: "+256772956676",
    is_public: true,
    allow_anonymous_contributions: true,
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
    updated_at: new Date().toISOString(),
    banner_url: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2h1cmNofGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Religious",
    is_urgent: false
  },
  {
    id: "created-2",
    title: "Youth Skills Training Center",
    description: "Establishing a vocational training center to equip young people with marketable skills in carpentry, tailoring, computer literacy, and entrepreneurship. This will help reduce youth unemployment in our area.",
    short_description: "Building a skills training center for unemployed youth.",
    beneficiary: "Nakasero Youth Group",
    event_date: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(), // 100 days from now
    location: "Nakasero, Kampala",
    target_amount: 25000000, // 25 million UGX
    total_contributed: 8000000,
    total_pledged: 3000000,
    contribution_progress: 0.32,
    progress_percentage: 32,
    days_remaining: 100,
    is_active: true,
    coordinator_name: "Geoffrey Okot",
    coordinator_email: "geoffrey.okot@example.com",
    coordinator_phone: "+256772956676",
    is_public: true,
    allow_anonymous_contributions: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updated_at: new Date().toISOString(),
    banner_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8eW91dGglMjB0cmFpbmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Community Project",
    is_urgent: false
  },
  {
    id: "created-3",
    title: "Emergency Medical Fund for Sarah",
    description: "My daughter Sarah was diagnosed with a serious kidney condition and needs immediate surgery. The medical bills are overwhelming and we need your support to save her life.",
    short_description: "Help save Sarah's life with urgent kidney surgery.",
    beneficiary: "Sarah Okot",
    event_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    location: "Mulago Hospital, Kampala",
    target_amount: 45000000, // 45 million UGX
    total_contributed: 28000000,
    total_pledged: 8000000,
    contribution_progress: 0.62,
    progress_percentage: 62,
    days_remaining: 20,
    is_active: true,
    coordinator_name: "Geoffrey Okot",
    coordinator_email: "geoffrey.okot@example.com",
    coordinator_phone: "+256772956676",
    is_public: true,
    allow_anonymous_contributions: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updated_at: new Date().toISOString(),
    banner_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvc3BpdGFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Healthcare",
    is_urgent: true
  }
];
