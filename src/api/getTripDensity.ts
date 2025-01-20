import axios from 'axios';
import moment, { Moment } from 'moment';

export type TripDensityResponse = {
  location_id: number;
  density: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getTripDensity = async (startDatetime: Moment, startTime: number, endTime: number) => {
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000';
  const tripsURL = new URL(`${API_URL}/trips/density`);
  startDatetime.set('hour', startTime);
  const endDatetime = moment(startDatetime).set('hour', endTime);
  tripsURL.searchParams.set('startDate', startDatetime.format(dateFormat));
  tripsURL.searchParams.set('endDate', endDatetime.format(dateFormat));
  tripsURL.searchParams.set('startTime', startTime.toString());
  tripsURL.searchParams.set('endTime', endTime.toString());

  try {
    const resp = await axios.get<TripDensityResponse[]>(tripsURL.toString());
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred. Error: ${ex}`);
  }
};

export default getTripDensity;
