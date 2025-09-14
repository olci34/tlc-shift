export interface Vehicle {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  color?: string;
  details?: string;
  fuel?: 'Gas' | 'Hybrid' | 'Electric' | 'Diesel';
}

export interface Plate {
  plate_number?: string;
  base_number?: string;
}

export interface ListingItem extends Vehicle, Plate {}

export interface ListingImage {
  name: string;
  src: string;
  cld_public_id?: string;
  file_type: string;
  file_size: string;
  file: File;
}

export interface ListingLocation {
  county: string;
  city: string;
  state: string;
}

export interface ListingContact {
  phone: string;
  email: string;
}

export interface Listing {
  _id?: string;
  title: string;
  description: string;
  transaction_type?: 'Rental' | 'Sale';
  listing_category?: 'Vehicle' | 'Plate';
  item: ListingItem;
  // listing_code?: number;
  price: number;

  location: ListingLocation;
  contact: ListingContact;
  active: boolean;
  images: ListingImage[];
  user_id?: string;
  created_at: Date | undefined;
  updated_at: Date | undefined;
}
