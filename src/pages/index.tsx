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
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { GeoJsonObject } from 'geojson';
import dynamic from 'next/dynamic';
import getTrips from '@/api/getTrips';
import DateFormInput from '@/components/form/date-form-input';
const Map = dynamic(() => import('../components/geomap/geomap'), { ssr: false });

export default function Home() {
  const dateFormat = 'YYYY-MM-DD';
  const start = moment().set('year', 2023).subtract(1, 'month');
  const end = moment().set('year', 2023);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [geoData, setGeoData] = useState<GeoJsonObject>();
  const [startDate, setStartDate] = useState<string>(start.format(dateFormat));
  const [endDate, setEndDate] = useState<string>(end.format(dateFormat));
  const [startTime, setStartTime] = useState<number>(12);
  const [endTime, setEndTime] = useState<number>(16);

  const handleDateChange = (setDate: Dispatch<SetStateAction<string>>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setDate(e.target.value);
    };
  };

  useEffect(() => {
    const fetchTrips = async () => {
      const dateFormat = 'YYYY-MM-DDTHH:mm:ss';
      const s = moment(startDate).set('hour', startTime);
      const e = moment(endDate).set('hour', endTime);
      const resp = await getTrips(s.format(dateFormat), e.format(dateFormat));
      setGeoData(resp);
    };

    fetchTrips();
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
            setStartTime(t1);
            setEndTime(t2);
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
              <Map geoData={geoData} />
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
}
