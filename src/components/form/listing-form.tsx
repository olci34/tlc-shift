'use client';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  VStack,
  InputGroup,
  InputLeftElement,
  Button
} from '@chakra-ui/react';
import { USStateCode } from '@/lib/constants/state-codes';
import { CldImage } from 'next-cloudinary';
import CloudinaryUploader from '../cloudinary/cloudinary-uploader';
import { USCarBrand } from '@/lib/constants/car-brands';
import { Listing, ListingImage, Plate, Vehicle } from '@/lib/interfaces/Listing';
import { createPlateState, createVehicleState } from '@/lib/utils/listing-item-helpers';
import NumberInputWithCommas from './number-input-with-commas';

export interface ListingFormProps {
  listing?: Listing;
}

const ListingForm: React.FC<ListingFormProps> = ({ listing }) => {
  const initialListingState: Listing = {
    title: listing?.title ?? '',
    description: listing?.description ?? '',
    transaction_type: listing?.transaction_type ?? 'Rental',
    listing_category: listing?.listing_category ?? 'Vehicle',
    price: listing?.price ?? 0,
    active: listing?.active ?? true,
    item: listing?.item ?? createVehicleState(),
    location: {
      county: listing?.location?.county ?? '',
      city: listing?.location?.city ?? '',
      state: listing?.location?.state ?? USStateCode.NY
    },
    images: listing?.images ?? []
  };

  const [listingData, setListingData] = useState<Listing>(listing ?? initialListingState);

  const handleListingChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const updatedState = {
      ...listingData,
      [e.currentTarget.name]: e.currentTarget.value
    } as Listing;

    if (e.currentTarget.name === 'listing_category') {
      updatedState.item =
        e.currentTarget.value === 'Vehicle' ? createVehicleState() : createPlateState();
    }

    setListingData(updatedState);
  };

  const handleLocationChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedLocation = {
      ...listingData.location,
      [e.currentTarget.name]: e.currentTarget.value
    };

    setListingData({ ...listingData, location: updatedLocation });
  };

  const handleItemChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedItem = { ...listingData.item, [e.currentTarget.name]: e.currentTarget.value };

    setListingData({ ...listingData, item: updatedItem });
  };

  const handleCldUploadSuccess = (e: any) => {
    const uploadedImg = {
      name: e.info.original_filename,
      src: e.info.url,
      cld_public_id: e.info.public_id,
      file_size: e.info.bytes,
      file_type: e.info.format
    } as ListingImage;

    setListingData((prev) => ({ ...prev, images: [...prev.images, uploadedImg] }));
  };

  const submitListing = async () => {
    console.log(listingData);
    // const res = await createListing(listingData);
  };

  return (
    <Stack>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          variant="outline"
          value={listingData?.title}
          name="title"
          onChange={handleListingChange}
          minLength={3}
          maxLength={42}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          variant="outline"
          value={listingData?.description}
          name="description"
          onChange={handleListingChange}
          minLength={16}
          maxLength={2000}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Transaction</FormLabel>
        <Select
          variant="outline"
          value={listingData?.transaction_type}
          name="transaction_type"
          onChange={handleListingChange}
        >
          <option value={'Rental'}>Rental</option>
          <option value={'Sale'}>Sale</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Listing Type</FormLabel>
        <Select
          variant="outline"
          value={listingData?.listing_category}
          name="listing_category"
          onChange={handleListingChange}
        >
          <option value={'Vehicle'}>Vehicle</option>
          <option value={'Plate'}>Plate</option>
        </Select>
      </FormControl>
      <Stack direction={{ base: 'column', md: 'row' }}>
        {/* Vehicle */}
        {listingData?.listing_category === 'Vehicle' && (
          <>
            <FormControl>
              <FormLabel>Make</FormLabel>
              <Select
                variant="outline"
                name="make"
                value={(listingData?.item as Vehicle).make}
                onChange={handleItemChange}
              >
                {Object.values(USCarBrand).map((brand) => (
                  <option value={brand} key={brand}>
                    {brand}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Model</FormLabel>
              <Input
                variant="outline"
                name="model"
                value={(listingData?.item as Vehicle).model}
                onChange={handleItemChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Year</FormLabel>
              <Input
                variant="outline"
                type="number"
                name="year"
                value={(listingData?.item as Vehicle).year}
                onChange={handleItemChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Fuel Type</FormLabel>
              <Select
                variant="outline"
                name="fuel"
                value={(listingData?.item as Vehicle).fuel}
                onChange={handleItemChange}
              >
                <option value="Gas">Gas</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Mileage</FormLabel>
              <NumberInputWithCommas
                variant="outline"
                type="number"
                name="mileage"
                value={(listingData?.item as Vehicle).mileage}
                onChange={handleItemChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Color</FormLabel>
              <Input
                variant="outline"
                name="color"
                value={(listingData?.item as Vehicle).color}
                onChange={handleItemChange}
              />
            </FormControl>
          </>
        )}
        {/* Plate */}
        {listingData?.listing_category === 'Plate' && (
          <>
            <FormControl>
              <FormLabel>Plate Number</FormLabel>
              <Input
                variant="outline"
                name="plate_number"
                value={(listingData?.item as Plate).plate_number}
                onChange={handleItemChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Base Number</FormLabel>
              <Input
                variant="outline"
                name="base_number"
                value={(listingData?.item as Plate).base_number}
                onChange={handleItemChange}
              />
            </FormControl>
          </>
        )}
      </Stack>
      <FormControl isRequired>
        <FormLabel>Price</FormLabel>
        <InputGroup>
          <InputLeftElement>$</InputLeftElement>
          <Input
            variant="outline"
            type="number"
            value={listingData?.price}
            name="price"
            onChange={handleListingChange}
            min={0}
            placeholder="0"
          />
        </InputGroup>
      </FormControl>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <FormControl>
          <FormLabel>County</FormLabel>
          <Input
            variant="outline"
            value={listingData?.location.county}
            name="county"
            onChange={handleLocationChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>City</FormLabel>
          <Input
            variant="outline"
            value={listingData?.location.city}
            name="city"
            onChange={handleLocationChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>State</FormLabel>
          <Select
            variant="outline"
            value={listingData?.location.state}
            name="state"
            onChange={handleLocationChange}
          >
            {Object.values(USStateCode).map((stateAbbr) => (
              <option value={stateAbbr} key={stateAbbr}>
                {stateAbbr}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <VStack>
        <CloudinaryUploader handleCldUploadSuccess={handleCldUploadSuccess} />
        {listingData.images && listingData.images.length && (
          <Stack
            direction="row"
            alignItems="start"
            gap={2}
            border="1px"
            borderRadius="lg"
            padding={2}
          >
            {listingData.images.map((img, idx) => (
              <CldImage
                key={`${img.name}-${idx}`}
                src={img.cld_public_id}
                width={100}
                height={100}
                crop="fill"
                alt=""
                sizes="100vw"
              />
            ))}
          </Stack>
        )}
      </VStack>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <Button onClick={submitListing}>Create Listing</Button>
        <Button>Cancel</Button>
      </Stack>
    </Stack>
  );
};

export default ListingForm;
