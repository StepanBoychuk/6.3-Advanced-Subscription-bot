import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ForecastService {
  async getForecast(lat: number, long: number): Promise<object> {
    const forecast = await axios.get(
      'https://api.openweathermap.org/data/3.0/onecall',
      {
        params: {
          appid: process.env.WEATHER_API_TOKEN,
          lat: lat,
          lon: long,
          units: 'metric',
        },
      },
    );
    return forecast;
  }

  getWindDirection(degrees: number) {
    const direction = [
      'North',
      'Northeast',
      'East',
      'Southeast',
      'South',
      'Southwest',
      'West',
      'Northwest',
    ];
    const index = Math.round(degrees / 45) % 8;
    return direction[index];
  }

  formatTime(UnixTimestep: number, timezoneOffset: number) {
    const date = new Date((UnixTimestep + timezoneOffset) * 1000);
    return date.toLocaleDateString('en-US');
  }

  async weatherForecasResponse(lat: number, long: number): Promise<string> {
    const weatherData: any = await this.getForecast(lat, long);
    if (!weatherData) return 'Oops, something went wrong';
    const todaysWeather: any = weatherData.data.daily[0];
    return `
    Greetings! Here's your weather forecast for today:\n
    - Sunrise: ${this.formatTime(
      todaysWeather.sunrise,
      weatherData.data.timezone_offset,
    )}
    - Sunset: ${this.formatTime(
      todaysWeather.sunset,
      weatherData.data.timezone_offset,
    )}
    - Moonrise: ${this.formatTime(
      todaysWeather.moonrise,
      weatherData.data.timezone_offset,
    )}
    - Moonset: ${this.formatTime(
      todaysWeather.moonset,
      weatherData.data.timezone_offset,
    )}
    - Summary: ${todaysWeather.summary}
    During the day temperature will range from ${todaysWeather.temp.min}℃ to ${
      todaysWeather.temp.max
    }℃
    - In the morning ${todaysWeather.temp.morn}℃ (Feels like ${
      todaysWeather.feels_like.morn
    }℃)
    - By day ${todaysWeather.temp.day}℃ (Feels like ${
      todaysWeather.feels_like.day
    }℃)
    - In the evening ${todaysWeather.temp.eve}℃ (Feels like ${
      todaysWeather.feels_like.eve
    }℃)
    - At night ${todaysWeather.temp.night}℃ (Feels like ${
      todaysWeather.feels_like.night
    }℃) \n
    - Pressure: ${todaysWeather.pressure}hPa
    - Humidity: ${todaysWeather.humidity}%
    - Dew point: ${todaysWeather.dew_point}℃
    - Wind speed: ${todaysWeather.wind_speed} m/s
    - Wind direction: ${todaysWeather.wind_deg}° (${this.getWindDirection(
      todaysWeather.wind_deg,
    )})
    - Wind gust: ${todaysWeather.wind_gust}
    - Clouds cover: ${todaysWeather.clouds}%
    - UV index: ${todaysWeather.uvi}
    - Probability of precipitation: ${todaysWeather.pop * 100}% \n
    Weather conditions: \n
    - Main weather: ${todaysWeather.weather[0].main}
    - Description: ${todaysWeather.weather[0].description}
    `;
  }
}
