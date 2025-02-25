import React, { use, useEffect, useState } from "react";
import "./weather.css";
import axios from "axios";
const Weather = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchDefault = async () => {
      const defaultLocation = "Delhi";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=88c5258287913d6954a7bbd6bc3df634`;
      const response = await axios.get(url);
      setData(response.data);
    };

    fetchDefault();
  }, []);

  const search = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=88c5258287913d6954a7bbd6bc3df634`;

    try {
      const response = await axios.get(url);
      if (response.data.cod !== 200) {
        setData({ notFound: true });
      } else {
        setData(response.data);
        setLocation("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setData({ notFound: true });
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
  };

  const handleLocation = (e) => {
    setLocation(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case "Clear":
        return "bx bxs-sun";
      case "Clouds":
        return "bx bxs-cloud";
      case "Rain":
        return "bx bxs-cloud-rain";
      case "Thunderstrom":
        return "bx bxs-cloud-lighting";
      case "Snow":
        return "bx bxs-cloud-snow";
      case "Haze":
      case "Mist":
        return "bx bxs-cloud";
      default:
        return "bx bxs-cloud";
    }
  };

  return (
    <div className="weather">
      <div className="search">
        <div className="search-top">
          <i className="fa-solid fa-location-dot"></i>
          <div className="location">{data.name}</div>
        </div>
        <div className="search-location">
          <input
            onKeyDown={handleKeyDown}
            onChange={handleLocation}
            value={location}
            type="text"
            placeholder="Enter location"
          />
          <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
        </div>
      </div>
      {data.notFound ? (
        <div className="not-found">Not Found 🙄</div>
      ) : (
        <div className="weather-data">
          {data.weather && data.weather[0] && (
            <i className={getWeatherIcon(data.weather[0].main)}></i>
          )}
          <div className="weather-type">
            {data.weather ? data.weather[0].main : null}
          </div>
          <div className="temp">
            {data.main ? `${Math.floor(data.main.temp)}°` : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
