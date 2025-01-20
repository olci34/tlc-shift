import {
  Box,
  HStack,
  Icon,
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
import { TimeIcon } from '@chakra-ui/icons';
const GeoMap = dynamic(() => import('../components/geomap/geomap'), { ssr: false });

export default function Home() {
  const dateFormat = 'YYYY-MM-DD';
  const [defaultStartTime, defaultEndTime] = [12, 17];
  const lastYearToday = moment.utc().startOf('day').set('year', 2023).set('hour', defaultStartTime);

  const startDateRef = useRef<HTMLInputElement>(null);

  const [geoData, setGeoData] = useState<FeatureCollection>();
  const [tripDensity, setTripDenstiy] = useState<Map<number, number>>();
  const [startTime, setStartTime] = useState<number>(defaultStartTime);
  const [endTime, setEndTime] = useState<number>(defaultEndTime);
  const [searchDate, setSearchDate] = useState<moment.Moment>(lastYearToday);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const startSliderText = useRef<HTMLParagraphElement>(null);
  const endSliderText = useRef<HTMLParagraphElement>(null);

  const handleDateChange = useCallback((setDate: Dispatch<SetStateAction<moment.Moment>>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const newDate = moment.utc(e.target.value);
      setDate(newDate);
    };
  }, []);

  useEffect(() => {
    if (startSliderText.current && endSliderText.current) {
      startSliderText.current.innerText = `${startTime}:00`;
      endSliderText.current.innerText = `${endTime - 1}:59`;
    }
    const fetchGeoData = async () => {
      const geojson: FeatureCollection | undefined = await fetch('./nyc-taxi-zones.geojson').then(
        (resp) => resp.json()
      );
      setGeoData(geojson);
    };
    fetchGeoData();
  }, []);

  const adjustSliderTexts = (t1: number, t2: number) => {
    if (startSliderText.current) {
      startSliderText.current.innerText = `${t1}:00`;
    }
    if (endSliderText.current) {
      endSliderText.current.innerText = `${t2 - 1}:59`;
    }
  };

  useEffect(() => {
    const fetchTrips = debounce(async () => {
      setIsLoading(true);
      const resp = await getTripDensity(searchDate, startTime, endTime);

      if (resp) {
        const density = new Map<number, number>();
        resp.forEach((data) => density.set(data.location_id, data.density));
        setTripDenstiy(density);
      }
      setIsLoading(false);
    }, 300);

    fetchTrips();
    return () => fetchTrips.cancel();
  }, [searchDate, startTime, endTime]);

  return (
    <Box height="full" width="full">
      <VStack gap={2} width="full" height="full">
        <Stack
          gap={4}
          direction={{ base: 'column', md: 'row' }}
          alignContent="flex-start"
          width="full"
        >
          <HStack>
            <DateFormInput
              value={searchDate.format(dateFormat)}
              max={moment('2023-12-31').format(dateFormat)}
              min={moment('2023-01-01').format(dateFormat)}
              ref={startDateRef}
              onChange={handleDateChange(setSearchDate)}
              isDisabled={isLoading}
            />
          </HStack>
          <HStack width="full" gap={4}>
            <Icon as={TimeIcon}></Icon>
            <Box height={6} width="full" pr={6}>
              <RangeSlider
                defaultValue={[startTime, endTime]}
                min={0}
                max={23}
                step={1}
                onChange={([t1, t2]) => adjustSliderTexts(t1, t2)}
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
                <RangeSliderThumb
                  index={0}
                  boxSize={6}
                  width={10}
                  fontSize="xs"
                  color="blackAlpha.600"
                >
                  <Text color="blackAlpha.600" ref={startSliderText}>
                    {startSliderText.current?.innerText}
                  </Text>
                </RangeSliderThumb>
                <RangeSliderThumb index={1} boxSize={6} width={10} fontSize="xs">
                  <Text color="blackAlpha.600" ref={endSliderText}>
                    {endSliderText.current?.innerText}
                  </Text>
                </RangeSliderThumb>
              </RangeSlider>
            </Box>
          </HStack>
        </Stack>

        <Box backgroundColor="yellow.200" width="full" height="full" borderRadius="2xl">
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
              <Text color="blackAlpha.700">Loading...</Text>
              <Text color="blackAlpha.700">This may take up to 50 seconds.</Text>
            </Stack>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
