import { getListings } from '@/api/getListings';
import { ListingCard } from '@/components/listing/listing-card';
import { EmptyListingsState } from '@/components/listing/empty-listings-state';
import Paginator from '@/components/paginator/paginator';
import { CarModels, USCarBrand } from '@/lib/constants/car-brands';
import { Listing } from '@/lib/interfaces/Listing';
import { AddIcon, Search2Icon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  Icon,
  Select,
  Show,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { useTranslations } from 'next-intl';
import { GetStaticProps } from 'next';
import { getMessages } from '@/lib/utils/i18n';

export interface CarFilter {
  make?: string;
  model?: string;
  minYear?: string;
  maxYear?: string;
  mileageRange?: string;
}

const ListingsPage = () => {
  const router = useRouter();
  const t = useTranslations();
  const numPerPage = 21;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listings, setListings] = useState<Listing[]>([]);
  const [carFilter, setCarFilter] = useState<CarFilter>({});
  const { isOpen, onToggle } = useDisclosure();
  const totalPages = Math.ceil(total / numPerPage);

  const handleFilterChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'make') {
      carFilter.model = CarModels[e.currentTarget.value as keyof typeof CarModels]?.[0];
    }

    setCarFilter({ ...carFilter, [name]: value });
  };

  const handleSearch = () => {
    const resetPage = 1;
    const fetchLists = async () => {
      const resp = await getListings(resetPage, numPerPage, carFilter);
      if (resp) {
        if (resetPage !== page) setPage(resetPage);
        setListings(resp.listings);
        setTotal(resp.total);
      }
    };
    fetchLists();
    onToggle();
  };

  useEffect(() => {
    const fetchLists = async () => {
      const resp = await getListings(page, numPerPage, carFilter);
      if (resp) {
        setListings(resp.listings);
        setTotal(resp.total);
      }
    };

    fetchLists();
  }, [page]);

  return (
    <Box>
      <Button variant="ghost" onClick={onToggle}>
        <Icon as={IoFilter} marginRight={1} />
        {t('common.filter')}
      </Button>
      <Button
        float="right"
        leftIcon={<AddIcon />}
        backgroundColor={useColorModeValue('green.600', 'green.300')}
        onClick={() => router.push('/listings/create')}
      >
        {t('listings.newListing')}
      </Button>

      {/* Filters */}
      <Collapse in={isOpen}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} my={4} align="flex-start">
          <FormControl>
            <Select
              placeholder={t('listings.makeFilter')}
              name="make"
              value={carFilter?.make}
              onChange={handleFilterChange}
            >
              {Object.values(USCarBrand).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Select
              placeholder={t('listings.modelFilter')}
              name="model"
              isDisabled={!carFilter?.make}
              value={carFilter?.model}
              onChange={handleFilterChange}
            >
              {CarModels[carFilter.make as keyof typeof CarModels]?.map((model: string) => (
                <option value={model} key={model}>
                  {model}
                </option>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2}>
            <FormControl>
              <Select
                width="100px"
                placeholder={t('listings.minYearFilter')}
                name="minYear"
                value={carFilter?.minYear}
                onChange={(e) => {
                  if (carFilter?.maxYear && e.currentTarget.value > carFilter?.maxYear) {
                    e.currentTarget.value = carFilter?.maxYear.toString();
                  }
                  handleFilterChange(e);
                }}
              >
                {Array.from({ length: 2024 - 1990 + 1 }, (_, i) => 1990 + i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </Select>
            </FormControl>
            <span style={{ alignContent: 'center' }}>-</span>
            <FormControl>
              <Select
                width="100px"
                placeholder={t('listings.maxYearFilter')}
                name="maxYear"
                value={carFilter?.maxYear || ''}
                onChange={(e) => {
                  if (carFilter?.minYear && e.currentTarget.value < carFilter?.minYear) {
                    e.currentTarget.value = carFilter?.minYear.toString();
                  }
                  handleFilterChange(e);
                }}
              >
                {Array.from({ length: 2024 - 1990 + 1 }, (_, i) => 1990 + i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <FormControl flexShrink={0} width={{ base: 'full', sm: '230px' }}>
            <Select
              placeholder={t('listings.mileageFilter')}
              value={carFilter?.mileageRange}
              name="mileageRange"
              onChange={handleFilterChange}
            >
              <option value="0-50000">{t('listings.mileageRange1')}</option>
              <option value="50000-100000">{t('listings.mileageRange2')}</option>
              <option value="100000-150000">{t('listings.mileageRange3')}</option>
              <option value="150000-200000">{t('listings.mileageRange4')}</option>
              <option value="200000+">{t('listings.mileageRange5')}</option>
            </Select>
          </FormControl>
          <Button
            background={useColorModeValue('green.600', 'green.300')}
            onClick={handleSearch}
            width={{ base: 'full', sm: 'auto' }}
          >
            <Search2Icon />
            <Show below="sm">
              <Text mx={1}>{t('common.search')}</Text>
            </Show>
          </Button>
        </Stack>
      </Collapse>

      {/* Listing Tiles */}
      <Box paddingY={2}>
        {listings.length === 0 ? (
          <EmptyListingsState
            title={t('listings.noListingsTitle')}
            description={t('listings.noListingsDescription')}
            buttonText={t('listings.createFirstListing')}
          />
        ) : (
          <>
            <SimpleGrid
              columns={{ base: 2, sm: 3, md: 3, lg: 4 }}
              spacing={{ base: 3, sm: 4, md: 5 }}
            >
              {listings?.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  onClick={() => {
                    if (listing._id) router.push(`/listings/${listing._id}`);
                  }}
                />
              ))}
            </SimpleGrid>
            <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Box>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: await getMessages(locale ?? 'en')
    }
  };
};

export default ListingsPage;
