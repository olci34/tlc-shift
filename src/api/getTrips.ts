import axios from 'axios';

const getTrips = async (startDatetime: string, endDatetime: string) => {
  const tripsURL = 'http://localhost:8000/trips';
  const query = `startDate=${startDatetime}&endDate=${endDatetime}`;
  console.log(startDatetime, endDatetime);
  try {
    const resp = await axios.get(`${tripsURL}?${query}`);
    return resp.data;
  } catch (ex) {
    console.log(`Error occurred. Error: ${ex}`);
  }
};

export default getTrips;
