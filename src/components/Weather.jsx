import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [cityName, setCityName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [weatherType, setWeatherType] = useState("");
    const [isNight, setIsNight] = useState(false);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const getWeatherType = (iconCode, temp) => {
        // Check if it's night (icon ends with 'n')
        const nightTime = iconCode.endsWith('n');
        setIsNight(nightTime);
        
        if (iconCode.startsWith('01')) return nightTime ? 'night' : 'sunny';
        if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'rainy';
        if (iconCode.startsWith('13')) return 'snowy';
        if (temp < 10) return 'cold';
        if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) return 'cloudy';
        return 'default';
    };

    useEffect(() => {
        getData("Pune");
    }, []);

    const getData = async (city) => {
        if (!city.trim()) {
            alert("Enter the city name!");
            setWeatherData(null);
            setError("");
            return;
        }

        setLoading(true);
        setError("");
        setWeatherData(null);

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if (data.cod !== 200) {
                // Handle all API errors
                setError(data.message || "Error fetching data!");
                setWeatherData(null);
                setWeatherType("");
            } else {
                setWeatherData(data);
                setError("");
                const type = getWeatherType(data.weather[0].icon, data.main.temp);
                setWeatherType(type);
            }
        } catch (err) {
            console.log("Network error:", err);
            setError("Network error. Please try again.");
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`weather ${weatherType} ${isNight ? 'night-mode' : 'day-mode'}`}>
            {/* Weather Animation Effects */}
            {weatherType === 'sunny' && (
                <div className="weather-effect sunny-effect">
                    <div className="sun-rays"></div>
                </div>
            )}
            {weatherType === 'night' && (
                <div className="weather-effect night-effect">
                    <div className="moon"></div>
                    <div className="stars">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="star" style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 80}%`,
                                animationDelay: `${Math.random() * 3}s`
                            }}>✦</div>
                        ))}
                    </div>
                </div>
            )}
            {weatherType === 'rainy' && (
                <div className="weather-effect rainy-effect">
                    {[...Array(25)].map((_, i) => (
                        <div key={i} className="raindrop" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}></div>
                    ))}
                </div>
            )}
            {weatherType === 'snowy' && (
                <div className="weather-effect snowy-effect">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="snowflake" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            fontSize: `${12 + Math.random() * 6}px`
                        }}>❄</div>
                    ))}
                </div>
            )}
            {weatherType === 'cold' && (
                <div className="weather-effect cold-effect">
                    <div className="frost-overlay"></div>
                </div>
            )}
            {weatherType === 'cloudy' && (
                <div className="weather-effect cloudy-effect">
                    <div className="cloud cloud1"></div>
                    <div className="cloud cloud2"></div>
                </div>
            )}
            
            {/* Search Bar (always visible) */}
            <div className='search-bar'>
                <input
                    type='search'
                    placeholder='Search'
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && getData(cityName)} // optional: fetch on Enter key
                />
                <img src={search_icon} alt="Search" onClick={() => getData(cityName)} />
            </div>

            {/* Loading state */}
            {loading && <p className="info">Loading...</p>}

            {/* Error message */}
            {error && <p className="error">{error}</p>}

            {/* Weather Data */}
            {weatherData && !error && !loading && (
                <>
                    <img
                        src={allIcons[weatherData?.weather[0]?.icon] || clear_icon}
                        className='weather-icon'
                        alt="Weather Icon"
                    />
                    <p className='temperature'>{Math.floor(weatherData?.main?.temp)}°C</p>
                    <p className='city'>{weatherData?.name}</p>

                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt="Humidity" />
                            <div>
                                <p>{weatherData?.main?.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className='col'>
                            <img src={wind_icon} alt="Wind" />
                            <div>
                                <p>{weatherData?.wind?.speed} km/hr</p>
                                <span>Wind speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Weather;
