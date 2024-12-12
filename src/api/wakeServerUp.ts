import axios from 'axios';

type WakeServerUpResponse = {
  message: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const wakeServerUp = async () => {
  try {
    const resp = await axios.get<WakeServerUpResponse>(`${API_URL}/wakeup`);
    console.log(resp.data);
  } catch (error) {
    console.error('Error waking up server:', error);
  }

  // Schedule next wake up call in 15 minutes
  setTimeout(wakeServerUp, 10000);
};

export default wakeServerUp;
