export class CreateUserDto {
  userId: number;
  location?: {
    lat: number;
    long: number;
  };
  forecastTime?: string;
}
