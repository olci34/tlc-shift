import axios from 'axios';

export type TripDensityResponse = {
  location_id: number;
  density: number;
};

const getTripDensity = async (startDatetime: string, endDatetime: string) => {
  const tripsURL = 'http://localhost:8000/density';
  const query = `startDate=${startDatetime}&endDate=${endDatetime}`;

  try {
    const resp = await axios.get<TripDensityResponse[]>(`${tripsURL}?${query}`);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred. Error: ${ex}`);
  }
};

export default getTripDensity;
