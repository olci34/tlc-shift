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
  cld_public_id: string;
  file_type: string;
  file_size: string;
}

export interface ListingLocation {
  county: string;
  city: string;
  state: string;
}

export interface Listing {
  title: string;
  description: string;
  transaction_type?: 'Rental' | 'Sale';
  listing_category?: 'Vehicle' | 'Plate';
  item: ListingItem;
  // listing_code?: number;
  price: number;

  location: ListingLocation;
  active: boolean;
  images: ListingImage[];
}
