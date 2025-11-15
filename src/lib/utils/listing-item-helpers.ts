import moment from 'moment';
import { Plate, Vehicle } from '../interfaces/Listing';
import { USCarBrand } from '../constants/car-brands';

export const createVehicleState = () => {
  return {
    make: USCarBrand.Toyota,
    model: 'Camry',
    year: moment().year(),
    mileage: 0,
    color: '',
    fuel: 'Gas',
    details: ''
  } as Vehicle;
};

export const createPlateState = () => {
  return {
    plate_number: '',
    base_number: ''
  } as Plate;
};
