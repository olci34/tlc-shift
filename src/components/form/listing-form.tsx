'use client';
import React, { useState, useEffect } from 'react';
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
  Button,
  FormErrorMessage
} from '@chakra-ui/react';
import { USStateCode } from '@/lib/constants/state-codes';
import ImageUploader from '../cloudinary/image-uploader';
import { CarModels, USCarBrand } from '@/lib/constants/car-brands';
import { Listing, ListingImage, Plate, Vehicle } from '@/lib/interfaces/Listing';
import { createPlateState, createVehicleState } from '@/lib/utils/listing-item-helpers';
import NumberInputWithCommas from './number-input-with-commas';
import { ImagePreview } from '../cloudinary/local-image-preview';
import { useRouter } from 'next/router';

export interface ListingFormProps {
  listing?: Listing;
  onSubmit: (listing: Listing) => Promise<void> | void;
}

const ListingForm: React.FC<ListingFormProps> = ({ listing, onSubmit }) => {
  const router = useRouter();
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
    contact: {
      phone: listing?.contact?.phone ?? '',
      email: listing?.contact?.email ?? ''
    },
    images: listing?.images ?? [],
    created_at: listing?.created_at,
    updated_at: listing?.updated_at
  };

  const [listingData, setListingData] = useState<Listing>(listing ?? initialListingState);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [imagesError, setImagesError] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);

  // Cleanup object URLs on unmount for new images
  useEffect(() => {
    return () => {
      listingData.images.forEach((img) => {
        if (!img.cld_public_id && img.src) {
          URL.revokeObjectURL(img.src);
        }
      });
    };
  }, [listingData.images]);

  const handleListingChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const updatedState = {
      ...listingData,
      [e.currentTarget.name]: e.currentTarget.value
    } as Listing;

    if (e.currentTarget.name === 'listing_category') {
      if (e.currentTarget.value === 'Vehicle') {
        updatedState.item = createVehicleState();
      } else if (e.currentTarget.value === 'Plate') {
        updatedState.item = createPlateState();
      }
    }

    setListingData(updatedState);

    if (e.currentTarget.name === 'title') {
      setTitleError('');
    }
    if (e.currentTarget.name === 'description') {
      setDescriptionError('');
    }
    if (e.currentTarget.name === 'price') {
      setPriceError('');
    }
  };

  const handleLocationChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedLocation = {
      ...listingData.location,
      [e.currentTarget.name]: e.currentTarget.value
    };

    setListingData({ ...listingData, location: updatedLocation });
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handleContactChange = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;

    if (e.currentTarget.name === 'phone') {
      value = formatPhoneNumber(value);
    }

    const updatedContact = {
      ...listingData.contact,
      [e.currentTarget.name]: value
    };

    setListingData({ ...listingData, contact: updatedContact });

    if (e.currentTarget.name === 'phone') {
      setPhoneError('');
    }
    if (e.currentTarget.name === 'email') {
      setEmailError('');
    }
  };

  const handleItemChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedItem = { ...listingData.item, [e.currentTarget.name]: e.currentTarget.value };

    if (e.currentTarget.name === 'make') {
      updatedItem.model = CarModels[e.currentTarget.value as keyof typeof CarModels][0];
    }

    setListingData({ ...listingData, item: updatedItem });
  };

  const handleFileSelect = (files: ListingImage[]) => {
    setListingData((prev) => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    setImagesError('');
  };

  const deleteImage = (index: number) => {
    const imageToDelete = listingData.images[index];
    // Revoke object URL for new images to free memory
    if (!imageToDelete.cld_public_id && imageToDelete.src) {
      URL.revokeObjectURL(imageToDelete.src);
    }

    setListingData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const cancelListing = async () => {
    setIsCanceling(true);

    try {
      // Cleanup local object URLs for new images
      listingData.images.forEach((img) => {
        if (!img.cld_public_id && img.src) {
          URL.revokeObjectURL(img.src);
        }
      });

      // Navigate based on whether editing existing listing or creating new one
      if (listingData._id) {
        // Edit mode - go back to the listing page
        router.push(`/listings/${listingData._id}`);
      } else {
        // Create mode - go to my-listings
        router.push('/my-listings');
      }
    } catch (error) {
      console.error('Error during cancellation:', error);
      // Fallback navigation
      if (listingData._id) {
        router.push(`/listings/${listingData._id}`);
      } else {
        router.push('/my-listings');
      }
    } finally {
      setIsCanceling(false);
    }
  };

  const isListingFormValid = () => {
    let isValid = true;

    if (listingData.title.length < 3) {
      setTitleError('Title must be at least 3 characters long.');
      isValid = false;
    }

    if (listingData.description.length < 25 || listingData.description.length > 1000) {
      setDescriptionError('Description length must be more than 25 characters or less than 1000.');
      isValid = false;
    }

    if (!listingData.price || !Number(listingData.price)) {
      setPriceError('Price should be greater than $ 0.00');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!listingData.contact?.email || !emailRegex.test(listingData.contact?.email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    // Phone validation (US phone number format)
    const phoneDigits = listingData.contact?.phone.replace(/\D/g, '');
    if (!listingData.contact?.phone || phoneDigits?.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      isValid = false;
    }

    if (listingData.images.length === 0 && listingData.transaction_type !== 'Rental') {
      setImagesError('Please upload at least one photo.');
      isValid = false;
    }

    return isValid;
  };

  const submitListing = async () => {
    if (isListingFormValid()) await onSubmit(listingData);
  };

  return (
    <Stack>
      <FormControl isRequired isInvalid={!!titleError}>
        <FormLabel>Title</FormLabel>
        <Input
          variant="outline"
          value={listingData?.title}
          name="title"
          onChange={handleListingChange}
          minLength={3}
          maxLength={42}
        />
        <FormErrorMessage>{titleError}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!descriptionError}>
        <FormLabel>Description</FormLabel>
        <Textarea
          variant="outline"
          value={listingData?.description}
          name="description"
          onChange={handleListingChange}
          minLength={25}
          maxLength={1000}
          whiteSpace="pre-wrap"
          wrap="soft"
        />
        <FormErrorMessage>{descriptionError}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Transaction</FormLabel>
        <Select
          variant="outline"
          value={listingData?.transaction_type}
          name="transaction_type"
          onChange={handleListingChange}
          disabled
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
              <Select
                variant="outline"
                name="model"
                value={(listingData?.item as Vehicle).model}
                onChange={handleItemChange}
              >
                {CarModels[listingData.item.make as keyof typeof CarModels]?.map(
                  (model: string) => (
                    <option value={model} key={model}>
                      {model}
                    </option>
                  )
                )}
              </Select>
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
      <FormControl isRequired isInvalid={!!priceError}>
        <FormLabel>Price</FormLabel>
        <InputGroup>
          <InputLeftElement>$</InputLeftElement>
          <Input
            variant="outline"
            type="number"
            value={listingData?.price}
            name="price"
            onChange={handleListingChange}
            min={1}
            placeholder="0"
          />
        </InputGroup>
        <FormErrorMessage>{priceError}</FormErrorMessage>
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
      <Stack direction={{ base: 'column', md: 'row' }}>
        <FormControl isRequired isInvalid={!!phoneError}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            variant="outline"
            value={listingData?.contact?.phone}
            name="phone"
            type="tel"
            onChange={handleContactChange}
            placeholder="(555) 123-4567"
          />
          <FormErrorMessage>{phoneError}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!emailError}>
          <FormLabel>Email Address</FormLabel>
          <Input
            variant="outline"
            value={listingData?.contact?.email}
            name="email"
            type="email"
            onChange={handleContactChange}
            placeholder="example@email.com"
          />
          <FormErrorMessage>{emailError}</FormErrorMessage>
        </FormControl>
      </Stack>
      <VStack>
        <FormControl
          isRequired={listingData.transaction_type !== 'Rental'}
          isInvalid={!!imagesError}
          width="full"
        >
          <FormLabel>Photos</FormLabel>
          <ImageUploader handleFileSelect={handleFileSelect} />
          {listingData.images.length > 0 && (
            <Stack
              direction="row"
              alignItems="start"
              gap={2}
              border="1px"
              borderRadius="lg"
              padding={2}
              flexWrap="wrap"
            >
              {listingData.images.map((img, idx) => (
                <ImagePreview
                  image={img}
                  key={`image-${img.cld_public_id || img.name}-${idx}`}
                  width={100}
                  height={100}
                  onDelete={() => deleteImage(idx)}
                />
              ))}
            </Stack>
          )}
          <FormErrorMessage>{imagesError}</FormErrorMessage>
        </FormControl>
      </VStack>
      <Stack direction={{ base: 'column', md: 'row' }} mt={4}>
        <Button onClick={submitListing}>
          {listingData._id ? 'Save Listing' : 'Create Listing'}
        </Button>
        <Button onClick={cancelListing} isLoading={isCanceling} loadingText="Cleaning up...">
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

export default ListingForm;
