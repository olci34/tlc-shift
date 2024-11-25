import axios from 'axios';
import { Moment } from 'moment';

const getTrips = async (startDate: Moment, endDate: Moment, hour_span = 1) => {
  const tripsURL = 'http://localhost:8000/trips';
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss';
  const [start, end] = [startDate.format(dateFormat), endDate.format(dateFormat)];
  const query = `startDate=${start}&endDate=${end}&hour_span=${hour_span.toString()}`;

  try {
    const resp = await axios.get(`${tripsURL}?${query}`);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred. Error: ${ex}`);
  }
};

export default getTrips;
