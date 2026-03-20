// @kyno/shared — Types and constants shared across apps
// These will be imported by @kyno/mobile, @kyno/web, @kyno/provider, @kyno/admin

export type ServiceId = 'walk' | 'groom' | 'hotel' | 'vet' | 'emergency' | 'shop';

export interface Service {
  id: ServiceId;
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

export interface DogProfile {
  name: string;
  dob: string;
  breed: string;
  weight: string;
  personality: string;
  gender: string;
  alteredStatus: string;
  preferredFood: string;
  insurance: string;
  vaccines: string[];
}

export interface SignupPayload {
  type: 'owner' | 'provider' | 'partner';
  name: string;
  email: string;
  service?: string;
  company?: string;
}
