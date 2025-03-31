import moment, { Moment } from 'moment';
import apiClient from './interceptors/apiClient';

export type TripDensityResponse = {
  location_id: number;
  density: number;
};

const getTripDensity = async (startDatetime: Moment, startTime: number, endTime: number) => {
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000';
  const tripsURL = new URL(`/trips/density`);
  startDatetime.set('hour', startTime);
  const endDatetime = moment(startDatetime).set('hour', endTime);
  tripsURL.searchParams.set('startDate', startDatetime.format(dateFormat));
  tripsURL.searchParams.set('endDate', endDatetime.format(dateFormat));
  tripsURL.searchParams.set('startTime', startTime.toString());
  tripsURL.searchParams.set('endTime', endTime.toString());

  try {
    const resp = await apiClient.get<TripDensityResponse[]>(tripsURL.toString());
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred. Error: ${ex}`);
  }
};

export default getTripDensity;
