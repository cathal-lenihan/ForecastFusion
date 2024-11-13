import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [openWeatherMapData, setOpenWeatherMapData] = useState({
      loading: false,
      data: {},
      error: false,
  });
  const [openMeteoMapData, setOpenMeteoMapData] = useState({
      loading: false,
      data: {},
      error: false,
  });

  const searchWeather = async () => {
    setOpenWeatherMapData({ ...openWeatherMapData, loading: true });
    let url = 'https://api.openweathermap.org/data/2.5/weather';
    const api_key = 'a2c5e81ae8d6836deedc125c639fa0aa';
    await axios
        .get(url, {
            params: {
                lat: lat,
                lon: long,
                units: 'metric',
                appid: api_key,
            },
        })
        .then((res) => {
            console.log('res1', res);
            setOpenWeatherMapData({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setOpenWeatherMapData({ ...openWeatherMapData, data: {}, error: true });
            console.log('error', error);
        });
   
  setOpenMeteoMapData({ ...openWeatherMapData, loading: true });     

   url = 'https://api.open-meteo.com/v1/forecast';
    await axios
        .get(url, {
            params: {
              latitude: lat,
              longitude: long,
              current: ["temperature_2m", "weather_code", "wind_speed_10m"],
              daily: "weather_code",
              timezone: "Australia/Sydney",
              forecast_days: 16
            },
        })
        .then((res) => {
            console.log('res2', res);
            setOpenMeteoMapData({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setOpenMeteoMapData({ ...openMeteoMapData, data: {}, error: true });
            console.log('error', error);
        });
        console.log("openMeteoMapData");
console.log(openMeteoMapData);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });

    console.log("Latitude is:", lat)
    console.log("Longitude is:", long)
  }, [lat, long]);

  const toDateFunction = () => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const WeekDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
        }`;
    return date;
};

  return (
    <div>
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Forecast Fusion
      </p>
      {lat && long && (
        <div>
          <h2>User Location</h2>
          <p>Latitude: {lat}</p>
          <p>Longitude: {long}</p>
        </div>
      )}
      
      <button onClick={searchWeather}>Get Weather forecast</button>
      {openWeatherMapData.loading && (
                <>
                    <br />
                    <br />
                    <Oval type="Oval" color="black" height={100} width={100} />
                </>
            )}
            {openWeatherMapData.error && (
                <>
                    <br />
                    <br />
                    <span className="error-message">
                        <FontAwesomeIcon icon={faFrown} />
                        <span style={{ fontSize: '20px' }}>City not found</span>
                    </span>
                </>
            )}
            {openWeatherMapData && openWeatherMapData.data && openWeatherMapData.data.main && (
                <div>
                <div>
                    <h2>
                       Source: Open Map Weather
                    </h2>
                </div>
                    <div className="city-name">
                        <h2>
                            {openWeatherMapData.data.name}, <span>{openWeatherMapData.data.sys.country}</span>
                        </h2>
                    </div>
                    <div className="date">
                        <span>{toDateFunction()}</span>
                    </div>
                    <div className="icon-temp">
                        <img
                            className=""
                            src={`https://openweathermap.org/img/wn/${openWeatherMapData.data.weather[0].icon}@2x.png`}
                            alt={openWeatherMapData.data.weather[0].description}
                        />
                        {Math.round(openWeatherMapData.data.main.temp)}
                        <sup className="deg">°C</sup>
                    </div>
                    <div className="des-wind">
                        <p>{openWeatherMapData.data.weather[0].description.toUpperCase()}</p>
                        <p>Wind Speed: {openWeatherMapData.data.wind.speed}m/s</p>
                    </div>
                </div>
            )}


{openMeteoMapData.loading && (
                <>
                    <br />
                    <br />
                    <Oval type="Oval" color="black" height={100} width={100} />
                </>
            )}
            {openMeteoMapData.error && (
                <>
                    <br />
                    <br />
                    <span className="error-message">
                        <FontAwesomeIcon icon={faFrown} />
                        <span style={{ fontSize: '20px' }}>City not found</span>
                    </span>
                </>
            )}
            {openMeteoMapData && openMeteoMapData.data && openMeteoMapData.data.current && (
                <div>
                <div>
                    <h2>
                       Source: Open Meteo
                    </h2>
                </div>
                    <div className="city-name">
                        <h2>
                            {openWeatherMapData.data.name}, <span>{openWeatherMapData.data.sys.country}</span>
                        </h2>
                    </div>
                    <div className="date">
                        <span>{toDateFunction()}</span>
                    </div>
                    <div className="icon-temp">
                        {Math.round(openMeteoMapData.data.current.temperature_2m)}
                        <sup className="deg">°C</sup>
                    </div>
                    <div className="des-wind">
                        <p>Wind Speed: {openMeteoMapData.data.current.wind_speed_10m}km/h</p>
                    </div>
                </div>
            )}
    </header>
    </div>
  );
}

export default App;
