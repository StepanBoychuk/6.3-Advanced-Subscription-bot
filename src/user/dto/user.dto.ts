export class UserDto {
  userId?: number;
  location?: {
    lat: number;
    long: number;
  };
  forecastTime?: string;
}
