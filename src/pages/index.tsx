import { Box, Grid, GridItem, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { GeoJsonObject } from 'geojson';
import dynamic from 'next/dynamic';
import getTrips from '@/api/getTrips';
import FormInput from '@/components/form/form-input';
const Map = dynamic(() => import('../components/geomap/geomap'), { ssr: false });

export default function Home() {
  const [geoData, setGeoData] = useState<GeoJsonObject>();
  const [startDate, setStartDate] = useState<moment.Moment>(
    moment().set('year', 2023).subtract(1, 'month')
  );
  const [endDate, setEndDate] = useState<moment.Moment>(moment().set('year', 2023));
  useEffect(() => {
    const fetchTrips = async () => {
      const resp = await getTrips(startDate, endDate);
      console.log(resp);
      setGeoData(resp);
    };

    fetchTrips();
  }, [startDate, endDate]);

  return (
    <Grid templateColumns="repeat(2, 1fr)" height="full" gap={4}>
      <GridItem padding={2} backgroundColor="yellow.800" colSpan={2}>
        <Box width="full" height="full">
          <Map geoData={geoData} />
        </Box>
      </GridItem>
    </Grid>
  );
}
