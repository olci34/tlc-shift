import {
  Box,
  Grid,
  GridItem,
  HStack,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  VStack
} from '@chakra-ui/react';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import moment from 'moment';
import { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import getTrips from '@/api/getTrips';
import DateFormInput from '@/components/form/date-form-input';
import { debounce } from 'lodash';
const GeoMap = dynamic(() => import('../components/geomap/geomap'), { ssr: false });

export default function Home() {
  const dateFormat = 'YYYY-MM-DD';
  const last_year_today = moment().set('year', 2023);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [geoData, setGeoData] = useState<FeatureCollection>();
  const [tripDensity, setTripDenstiy] = useState<Map<number, number>>();
  const [startDate, setStartDate] = useState<string>(last_year_today.format(dateFormat));
  const [endDate, setEndDate] = useState<string>(last_year_today.format(dateFormat));
  const [startTime, setStartTime] = useState<number>(12);
  const [endTime, setEndTime] = useState<number>(16);

  const handleDateChange = useCallback((setDate: Dispatch<SetStateAction<string>>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setDate(e.target.value);
    };
  }, []);

  useEffect(() => {
    const fetchGeoData = async () => {
      const geojson: FeatureCollection | undefined = await fetch('./nyc-taxi-zones.geojson').then(
        (resp) => resp.json()
      );
      setGeoData(geojson);
    };
    fetchGeoData();
  }, []);

  useEffect(() => {
    const fetchTrips = debounce(async () => {
      const dateFormat = 'YYYY-MM-DDTHH:mm:ss';
      const s = moment(startDate).set('hour', startTime);
      const e = moment(endDate).set('hour', endTime);
      const resp = await getTrips(s.format(dateFormat), e.format(dateFormat));

      if (resp) {
        const density = new Map<number, number>();
        resp.forEach((data) => density.set(data.location_id, data.density));
        setTripDenstiy(density);
      }
    }, 3000);

    fetchTrips();

    return () => fetchTrips.cancel();
  }, [startDate, endDate, startTime, endTime]);

  return (
    <Box height="full" width="full">
      <VStack gap={4} height="full" width="full">
        <HStack gap={4} alignContent="flex-start" width="full">
          <DateFormInput
            value={startDate}
            label="From"
            ref={startDateRef}
            onChange={handleDateChange(setStartDate)}
          />
          <DateFormInput
            value={endDate}
            label="To"
            ref={endDateRef}
            onChange={handleDateChange(setEndDate)}
          />
        </HStack>
        <RangeSlider
          defaultValue={[startTime, endTime]}
          min={0}
          max={24}
          step={1}
          onChangeEnd={([t1, t2]) => {
            setEndTime(t2);
            setStartTime(t1);
          }}
        >
          <RangeSliderMark
            value={startTime}
            textAlign="center"
            bg="blue.500"
            color="white"
            mt="-10"
            ml="-5"
            w="12"
            borderRadius={4}
          >
            {startTime}
          </RangeSliderMark>
          <RangeSliderMark
            value={endTime}
            textAlign="center"
            bg="blue.500"
            color="white"
            mt="-10"
            ml="-5"
            w="12"
            borderRadius={4}
          >
            {endTime}
          </RangeSliderMark>
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Grid templateColumns="repeat(2, 1fr)" height="full" gap={4} width="full">
          <GridItem padding={2} backgroundColor="yellow.200" colSpan={2}>
            <Box height="full">
              <GeoMap geoData={geoData} tripDensity={tripDensity} />
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
}
