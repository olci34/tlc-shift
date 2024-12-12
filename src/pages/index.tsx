import {
  Box,
  Grid,
  GridItem,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Spinner,
  Stack,
  Text,
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
import getTripDensity from '@/api/getTripDensity';
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
  const [startDate, setStartDate] = useState<moment.Moment>(last_year_today);
  const [endDate, setEndDate] = useState<moment.Moment>(last_year_today);
  const [startTime, setStartTime] = useState<number>(12);
  const [endTime, setEndTime] = useState<number>(16);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDateChange = useCallback((setDate: Dispatch<SetStateAction<moment.Moment>>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setDate(moment(e.target.value));
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
      setIsLoading(true);
      const dateFormat = 'YYYY-MM-DDTHH:mm:ss';
      const s = moment(startDate).set('hour', startTime);
      const e = moment(endDate).set('hour', endTime);
      const resp = await getTripDensity(s.format(dateFormat), e.format(dateFormat));

      if (resp) {
        const density = new Map<number, number>();
        resp.forEach((data) => density.set(data.location_id, data.density));
        setTripDenstiy(density);
      }
      setIsLoading(false);
    }, 300);

    fetchTrips();

    return () => fetchTrips.cancel();
  }, [startDate, endDate, startTime, endTime]);

  return (
    <Box height="full" width="full">
      <VStack gap={2} height="full" width="full">
        <Stack gap={4} direction="row" alignContent="flex-start" width="full">
          <DateFormInput
            value={startDate.format(dateFormat)}
            max={endDate.format(dateFormat)}
            ref={startDateRef}
            onChange={handleDateChange(setStartDate)}
            isDisabled={isLoading}
          />
          <DateFormInput
            value={endDate.format(dateFormat)}
            min={startDate.format(dateFormat)}
            ref={endDateRef}
            onChange={handleDateChange(setEndDate)}
            isDisabled={isLoading}
          />
        </Stack>
        <Box height={6} width="full" px={6}>
          <RangeSlider
            defaultValue={[startTime, endTime]}
            min={0}
            max={23}
            step={1}
            onChangeEnd={([t1, t2]) => {
              setEndTime(t2);
              setStartTime(t1);
            }}
            isDisabled={isLoading}
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
            />
            <RangeSliderMark
              value={endTime}
              textAlign="center"
              bg="blue.500"
              color="white"
              mt="-10"
              ml="-5"
              w="12"
              borderRadius={4}
            />
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} boxSize={6} width={10} fontSize="xs">
              <Text color="blackAlpha.600">{startTime}:00</Text>
            </RangeSliderThumb>
            <RangeSliderThumb index={1} boxSize={6} width={10} fontSize="xs">
              <Text color="blackAlpha.600">{endTime}:59</Text>
            </RangeSliderThumb>
          </RangeSlider>
        </Box>
        <Grid templateColumns="repeat(2, 1fr)" height="full" gap={4} width="full">
          <GridItem padding={2} backgroundColor="yellow.200" colSpan={2}>
            <Box height="full">
              <GeoMap geoData={geoData} tripDensity={tripDensity} isLoading={isLoading} />
              {isLoading && (
                <Stack direction="column" position="absolute" top="50%" left="50%" zIndex={1000}>
                  <Spinner
                    size="xl"
                    emptyColor="orange.300"
                    color="blue.300"
                    thickness="4px"
                    label="Loading..."
                    transform="translate(-50%, -50%)"
                  />
                  <Text color="blackAlpha.800">Loading...</Text>
                </Stack>
              )}
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
}
