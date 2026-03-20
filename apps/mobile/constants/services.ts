export interface Service {
  id: string;
  icon: string;
  name: string;
  sub: string;
  count: string;
  range: string;
  desc: string;
  isEmergency?: boolean;
}

export interface Provider {
  name: string;
  category: string;
  rating: string;
  price: string;
  icon: string;
  tags: string[];
  brandBadge?: string;
}

export const services: Service[] = [
  { id: 'walk', icon: 'W', name: 'Walkers', sub: 'Daily walks & runs', count: '6 available', range: 'from $18', desc: 'Certified daily walkers, GPS tracking, live updates.' },
  { id: 'groom', icon: 'G', name: 'Groomers', sub: 'Bath, trim & style', count: '4 available', range: 'from $55', desc: 'Full-service grooming studios and mobile groomers.' },
  { id: 'hotel', icon: 'H', name: 'Dog Hotels', sub: 'Boarding & daycare', count: '3 available', range: 'from $65', desc: 'Boutique boarding, suites and premium daycare.' },
  { id: 'vet', icon: 'V', name: 'Vets', sub: 'Wellness & care', count: '2 hospitals', range: 'from $80', desc: 'Licensed vets for checkups, vaccines, and dental care.' },
  { id: 'emergency', icon: '!', name: 'Emergency', sub: '24/7 urgent care', count: '8 available', range: 'on-demand', desc: 'Round-the-clock emergency vet access, fast dispatch.', isEmergency: true },
  { id: 'shop', icon: 'S', name: 'Shop', sub: 'Premium pet goods', count: '2 curated shops', range: 'free delivery $75+', desc: 'Curated food, toys, accessories for discerning dogs.' },
];

export const providerDirectory: Record<string, Provider[]> = {
  walk: [
    { name: 'Carlos Mendoza', category: 'Certified Walker · Brickell', rating: '4.9', price: '$22', icon: 'CM', tags: ['GPS Tracking', 'Large Breeds', '2 years exp', 'Insured'] },
    { name: 'Mia Thompson', category: 'Pack Walker · Midtown', rating: '4.8', price: '$20', icon: 'MT', tags: ['Puppy Friendly', 'Photo Updates', 'CPR Certified'] },
    { name: 'Jordan Lee', category: 'Trail Walker · Coconut Grove', rating: '4.9', price: '$24', icon: 'JL', tags: ['High Energy Dogs', 'Long Walks', 'Insured'] },
    { name: 'Sofia Ramirez', category: 'Neighborhood Walker · Coral Gables', rating: '4.7', price: '$19', icon: 'SR', tags: ['Small Breeds', 'Medication Support', '1 year exp'] },
    { name: 'Ethan Brooks', category: 'Evening Walker · Downtown', rating: '4.8', price: '$21', icon: 'EB', tags: ['After-work Slots', 'Behavior Aware', 'Insured'] },
    { name: 'Priya Patel', category: 'Jogging Walker · Edgewater', rating: '5.0', price: '$26', icon: 'PP', tags: ['Active Breeds', 'Live Route', 'CPR Certified'] },
  ],
  groom: [
    { name: 'Pawlish Groom Studio', category: 'Luxury Groomer · Brickell', rating: '4.9', price: '$65', icon: 'PG', tags: ['Breed Cuts', 'Spa Bath', 'Nail Trim'] },
    { name: 'Fluff & Buff Mobile', category: 'Mobile Groomer · Miami Beach', rating: '4.8', price: '$72', icon: 'FB', tags: ['At Home', 'De-shedding', 'Hypoallergenic'] },
    { name: 'The Dapper Dog', category: 'Boutique Groomer · Midtown', rating: '4.7', price: '$58', icon: 'DD', tags: ['Hand Scissoring', 'Puppy Intro', 'Teeth Brushing'] },
    { name: 'Coastal Canine Grooming', category: 'Salon Groomer · Coconut Grove', rating: '4.8', price: '$62', icon: 'CC', tags: ['Flea Treatment', 'Sensitive Skin', 'Nail Grind'] },
  ],
  hotel: [
    { name: 'Barkington Suites', category: 'Dog Hotel · Brickell', rating: '4.9', price: '$78', icon: 'BS', tags: ['Private Suites', 'Webcam', 'Playgroups'] },
    { name: 'Palm Paws Resort', category: 'Dog Hotel · Coconut Grove', rating: '4.8', price: '$72', icon: 'PP', tags: ['Pool Time', 'Daycare', 'Medication Care'] },
    { name: 'Urban Tails Lodge', category: 'Dog Hotel · Downtown', rating: '4.7', price: '$68', icon: 'UT', tags: ['Overnight Boarding', 'Late Pickup', 'Report Card'] },
  ],
  vet: [
    { name: 'Biscayne Veterinary Hospital', category: 'Full-Service · Wynwood', rating: '4.8', price: '$95', icon: 'BV', tags: ['Surgery', 'Dental', 'Vaccines', 'Lab On-site'] },
    { name: 'Coral Way Animal Hospital', category: '24/7 Vet · Coral Way', rating: '4.7', price: '$90', icon: 'CW', tags: ['Urgent Care', 'Diagnostics', 'Pharmacy'] },
  ],
  emergency: [
    { name: 'RapidPaw ER', category: 'Emergency Vet · 24/7', rating: '4.8', price: 'on-demand', icon: 'RP', tags: ['Immediate Intake', 'Critical Care', 'Trauma Team'] },
  ],
  shop: [
    { name: 'Chewy', category: 'Online Pet Shop · Fast Delivery', rating: '4.8', price: 'from $15', icon: 'CH', brandBadge: 'CHEWY', tags: ['Food', 'Treats', 'Toys', 'Auto-ship'] },
    { name: "The Farmer's Dog", category: 'Fresh Dog Food · Subscription', rating: '4.9', price: 'from $2/day', icon: 'FD', brandBadge: "FARMER'S DOG", tags: ['Fresh Meals', 'Custom Plans', 'Human-grade'] },
  ],
};

export const dogProfile = {
  name: 'Mango',
  dob: 'May 14, 2022',
  breed: 'Golden Retriever',
  weight: '68 lb',
  personality: 'Friendly, playful, social, food-motivated',
  gender: 'Male',
  alteredStatus: 'Neutered',
  preferredFood: "The Farmer's Dog — Turkey Recipe",
  insurance: 'Healthy Paws · Policy #HP-482901 · Active',
  vaccines: ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis'],
};
