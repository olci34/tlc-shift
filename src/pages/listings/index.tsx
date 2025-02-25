import { getListings } from '@/api/getListings';
import { ListingCard } from '@/components/listing/listing-card';
import Paginator from '@/components/paginator/paginator';
import { USCarBrand } from '@/lib/constants/car-brands';
import { Listing } from '@/lib/interfaces/Listing';
import { Search2Icon } from '@chakra-ui/icons';
import { Box, Button, FormControl, Select, Stack, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export interface CarFilter {
  make?: string;
  model?: string;
  minYear?: string;
  maxYear?: string;
  mileageRange?: string;
}

const ListingsPage = () => {
  const router = useRouter();
  const numPerPage = 21;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listings, setListings] = useState<Listing[]>([]);
  const [carFilter, setCarFilter] = useState<CarFilter>({});

  const totalPages = Math.ceil(total / numPerPage);

  const handleFilterChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    console.log(name, value);
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
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={4} align="flex-start">
        <FormControl>
          <Select
            placeholder="Make"
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
            placeholder="Model"
            name="model"
            isDisabled={!carFilter?.make}
            value={carFilter?.model}
            onChange={handleFilterChange}
          >
            {/* Models would be populated based on selected brand */}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2}>
          <FormControl>
            <Select
              width="100px"
              placeholder="Min"
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
              placeholder="Max"
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

        <FormControl>
          <Select
            placeholder="Select mileage range"
            value={carFilter?.mileageRange}
            name="mileageRange"
            onChange={handleFilterChange}
          >
            <option value="0-50000">0 - 50,000 miles</option>
            <option value="50000-100000">50,000 - 100,000 miles</option>
            <option value="100000-150000">100,000 - 150,000 miles</option>
            <option value="150000-200000">150,000 - 200,000 miles</option>
            <option value="200000+">200,000+ miles</option>
          </Select>
        </FormControl>
        <Button background={useColorModeValue('green.600', 'green.300')} onClick={handleSearch}>
          <Search2Icon />
        </Button>
      </Stack>

      <Button onClick={() => router.push('/listings/create')}>Create</Button>
      <Box paddingY={2}>
        <Stack direction={{ base: 'column', sm: 'row' }} wrap="wrap" justify="flex-start">
          {listings?.map((listing, idx) => (
            <ListingCard key={listing.title + idx + page} {...listing} />
          ))}
        </Stack>
      </Box>
      <Paginator currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </Box>
  );
};

export default ListingsPage;
