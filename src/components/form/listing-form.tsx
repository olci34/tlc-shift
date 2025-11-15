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
import { useTranslations } from 'next-intl';

export interface ListingFormProps {
  listing?: Listing;
  onSubmit: (listing: Listing) => Promise<void> | void;
}

const ListingForm: React.FC<ListingFormProps> = ({ listing, onSubmit }) => {
  const router = useRouter();
  const t = useTranslations('listingForm');
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
      setTitleError(t('errorTitleLength'));
      isValid = false;
    }

    if (listingData.description.length < 25 || listingData.description.length > 1000) {
      setDescriptionError(t('errorDescriptionLength'));
      isValid = false;
    }

    if (!listingData.price || !Number(listingData.price)) {
      setPriceError(t('errorPriceInvalid'));
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!listingData.contact?.email || !emailRegex.test(listingData.contact?.email)) {
      setEmailError(t('errorEmailInvalid'));
      isValid = false;
    }

    // Phone validation (US phone number format)
    const phoneDigits = listingData.contact?.phone.replace(/\D/g, '');
    if (!listingData.contact?.phone || phoneDigits?.length !== 10) {
      setPhoneError(t('errorPhoneInvalid'));
      isValid = false;
    }

    if (listingData.images.length === 0 && listingData.listing_category === 'Vehicle') {
      setImagesError(t('errorImagesRequired'));
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
        <FormLabel>{t('title')}</FormLabel>
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
        <FormLabel>{t('description')}</FormLabel>
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
        <FormLabel>{t('transaction')}</FormLabel>
        <Select
          variant="outline"
          value={listingData?.transaction_type}
          name="transaction_type"
          onChange={handleListingChange}
          disabled
        >
          <option value={'Rental'}>{t('transactionRental')}</option>
          <option value={'Sale'}>{t('transactionSale')}</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>{t('listingType')}</FormLabel>
        <Select
          variant="outline"
          value={listingData?.listing_category}
          name="listing_category"
          onChange={handleListingChange}
        >
          <option value={'Vehicle'}>{t('listingTypeVehicle')}</option>
          <option value={'Plate'}>{t('listingTypePlate')}</option>
        </Select>
      </FormControl>
      <Stack direction={{ base: 'column', md: 'row' }}>
        {/* Vehicle */}
        {listingData?.listing_category === 'Vehicle' && (
          <>
            <FormControl>
              <FormLabel>{t('brand')}</FormLabel>
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
              <FormLabel>{t('model')}</FormLabel>
              <Select
                variant="outline"
                name="model"
                value={(listingData?.item as Vehicle).model}
                onChange={handleItemChange}
              >
                {CarModels[(listingData.item as Vehicle).make as keyof typeof CarModels]?.map(
                  (model: string) => (
                    <option value={model} key={model}>
                      {model}
                    </option>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>{t('year')}</FormLabel>
              <Input
                variant="outline"
                type="number"
                name="year"
                value={(listingData?.item as Vehicle).year}
                onChange={handleItemChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>{t('fuelType')}</FormLabel>
              <Select
                variant="outline"
                name="fuel"
                value={(listingData?.item as Vehicle).fuel}
                onChange={handleItemChange}
              >
                <option value="Gas">{t('fuelGas')}</option>
                <option value="Hybrid">{t('fuelHybrid')}</option>
                <option value="Electric">{t('fuelElectric')}</option>
                <option value="Diesel">{t('fuelDiesel')}</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>{t('mileage')}</FormLabel>
              <NumberInputWithCommas
                variant="outline"
                type="number"
                name="mileage"
                value={(listingData?.item as Vehicle).mileage}
                onChange={handleItemChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>{t('color')}</FormLabel>
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
              <FormLabel>{t('plateNumber')}</FormLabel>
              <Input
                variant="outline"
                name="plate_number"
                value={(listingData?.item as Plate).plate_number}
                onChange={handleItemChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>{t('baseNumber')}</FormLabel>
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
        <FormLabel>{t('price')}</FormLabel>
        <InputGroup>
          <InputLeftElement>$</InputLeftElement>
          <Input
            variant="outline"
            type="number"
            value={listingData?.price}
            name="price"
            onChange={handleListingChange}
            min={1}
            placeholder={t('pricePlaceholder')}
          />
        </InputGroup>
        <FormErrorMessage>{priceError}</FormErrorMessage>
      </FormControl>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <FormControl>
          <FormLabel>{t('county')}</FormLabel>
          <Input
            variant="outline"
            value={listingData?.location.county}
            name="county"
            onChange={handleLocationChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{t('city')}</FormLabel>
          <Input
            variant="outline"
            value={listingData?.location.city}
            name="city"
            onChange={handleLocationChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{t('state')}</FormLabel>
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
          <FormLabel>{t('phoneNumber')}</FormLabel>
          <Input
            variant="outline"
            value={listingData?.contact?.phone}
            name="phone"
            type="tel"
            onChange={handleContactChange}
            placeholder={t('phonePlaceholder')}
          />
          <FormErrorMessage>{phoneError}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!emailError}>
          <FormLabel>{t('emailAddress')}</FormLabel>
          <Input
            variant="outline"
            value={listingData?.contact?.email}
            name="email"
            type="email"
            onChange={handleContactChange}
            placeholder={t('emailPlaceholder')}
          />
          <FormErrorMessage>{emailError}</FormErrorMessage>
        </FormControl>
      </Stack>
      <VStack>
        <FormControl
          isRequired={listingData.listing_category === 'Vehicle'}
          isInvalid={!!imagesError}
          width="full"
        >
          <FormLabel>{t('photos')}</FormLabel>
          <ImageUploader handleFileSelect={handleFileSelect} currentImages={listingData.images} />
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
          {listingData._id ? t('saveListing') : t('createListing')}
        </Button>
        <Button onClick={cancelListing} isLoading={isCanceling} loadingText={t('cleaningUp')}>
          {t('cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ListingForm;
