import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';
import './WeatherWidget.css';

const WeatherWidget = ({ data }) => {
  // Mock weather data
  const weatherData = data || {
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

  const getWeatherIcon = (condition, size = 24) => {
    const iconProps = {
      size,
      className: `weather-widget__icon weather-widget__icon--${condition}`
    };

    switch (condition) {
      case 'sunny':
        return <Sun {...iconProps} />;
      case 'cloudy':
        return <Cloud {...iconProps} />;
      case 'rainy':
        return <CloudRain {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  const getConditionText = (condition) => {
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
    <div className="weather-widget">
      <div className="weather-widget__header">
        <h3 className="weather-widget__title">Thời tiết</h3>
      </div>

      {/* Current Weather - Very Compact */}
      <div className="weather-widget__current">
        <div className="weather-widget__current-info">
          <div className="weather-widget__icon">
            {getWeatherIcon(weatherData.condition, 24)}
          </div>
          <div>
            <div className="weather-widget__temperature">{weatherData.temperature}°C</div>
            <div className="weather-widget__condition">{getConditionText(weatherData.condition)}</div>
          </div>
        </div>
        
        <div className="weather-widget__details">
          <div className="weather-widget__detail">
            <Droplets size={10} className="weather-widget__detail-icon" />
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="weather-widget__detail">
            <Wind size={10} className="weather-widget__detail-icon" />
            <span>{weatherData.windSpeed}km/h</span>
          </div>
        </div>
      </div>

      {/* Mini Forecast */}
      <div className="weather-widget__forecast">
        <div className="weather-widget__forecast-grid">
          {weatherData.forecast.slice(0, 4).map((item, index) => (
            <div key={index} className="weather-widget__forecast-item">
              <div className="weather-widget__forecast-time">{item.time}</div>
              <div className="weather-widget__forecast-icon">
                {getWeatherIcon(item.condition, 12)}
              </div>
              <div className="weather-widget__forecast-temp">{item.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
