import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  forecast: Array<{
    time: string;
    temp: number;
    condition: 'sunny' | 'cloudy' | 'rainy';
  }>;
  dailyForecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: 'sunny' | 'cloudy' | 'rainy';
    humidity: number;
    windSpeed: number;
  }>;
}

interface WeatherWidgetProps {
  data?: WeatherData;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  // Mock weather data
  const weatherData: WeatherData = data || {
    location: 'TP. Hồ Chí Minh',
    temperature: 32,
    condition: 'sunny',
    humidity: 75,
    windSpeed: 12,
    pressure: 1013,
    uvIndex: 8,
    visibility: 10,
    forecast: [
      { time: '14:00', temp: 32, condition: 'sunny' },
      { time: '15:00', temp: 31, condition: 'cloudy' },
      { time: '16:00', temp: 30, condition: 'cloudy' },
      { time: '17:00', temp: 29, condition: 'rainy' },
      { time: '18:00', temp: 28, condition: 'rainy' },
      { time: '19:00', temp: 27, condition: 'cloudy' }
    ],
    dailyForecast: [
      { day: 'Hôm nay', high: 34, low: 26, condition: 'sunny', humidity: 75, windSpeed: 12 },
      { day: 'Ngày mai', high: 33, low: 25, condition: 'cloudy', humidity: 78, windSpeed: 15 },
      { day: 'Thứ 3', high: 31, low: 24, condition: 'rainy', humidity: 85, windSpeed: 18 },
      { day: 'Thứ 4', high: 29, low: 23, condition: 'rainy', humidity: 88, windSpeed: 20 },
      { day: 'Thứ 5', high: 32, low: 25, condition: 'cloudy', humidity: 80, windSpeed: 14 },
      { day: 'Thứ 6', high: 35, low: 27, condition: 'sunny', humidity: 70, windSpeed: 10 },
      { day: 'Thứ 7', high: 36, low: 28, condition: 'sunny', humidity: 68, windSpeed: 8 }
    ]
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={size} className="text-yellow-400" />;
      case 'cloudy':
        return <Cloud size={size} className="text-gray-400" />;
      case 'rainy':
        return <CloudRain size={size} className="text-blue-400" />;
      default:
        return <Sun size={size} className="text-yellow-400" />;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'Nắng';
      case 'cloudy':
        return 'Nhiều mây';
      case 'rainy':
        return 'Mưa';
      default:
        return 'Nắng';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">Thời tiết</h3>
      </div>

      {/* Current Weather - Very Compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getWeatherIcon(weatherData.condition, 24)}
          <div>
            <div className="text-lg font-bold text-white">{weatherData.temperature}°C</div>
            <div className="text-gray-400 text-xs">{getConditionText(weatherData.condition)}</div>
          </div>
        </div>
        
        <div className="text-right space-y-0.5">
          <div className="flex items-center text-gray-400 text-xs">
            <Droplets size={10} className="mr-1" />
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs">
            <Wind size={10} className="mr-1" />
            <span>{weatherData.windSpeed}km/h</span>
          </div>
        </div>
      </div>

      {/* Mini Forecast */}
      <div className="mt-2 pt-2 border-t border-gray-700">
        <div className="grid grid-cols-4 gap-1">
          {weatherData.forecast.slice(0, 4).map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-400">{item.time}</div>
              <div className="flex justify-center my-0.5">
                {getWeatherIcon(item.condition, 12)}
              </div>
              <div className="text-xs text-white">{item.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;