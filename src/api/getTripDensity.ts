import apiClient from './interceptors/apiClient';
import moment from 'moment';

export interface TripDensityResponse {
  location_id: number;
  density: number;
}

export const getTripDensity = async (
  startDatetime: moment.Moment,
  endDatetime: moment.Moment,
  startTime: number,
  endTime: number
) => {
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.000';
  const params = new URLSearchParams();

  startDatetime.set('hour', startTime);
  params.set('startDate', startDatetime.format(dateFormat));
  params.set('endDate', endDatetime.format(dateFormat));
  params.set('startTime', startTime.toString());
  params.set('endTime', endTime.toString());

  try {
    const response = await apiClient.get<TripDensityResponse[]>(
      `/trips/density?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching trip density: ${error}`);
    throw error;
  }
};
