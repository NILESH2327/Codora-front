

export const reverseGeoLookup = async (lat, lon) => {
  try {
    const url = `https://api.weatherapi.com/v1/search.json?key=748c922b6b124c14ad305356252111&q=${lat},${lon}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Reverse geolocation lookup failed");
    }

    const data = await response.json();

    // return nearest city (WeatherAPI always returns array)
    return data[0] || null;

  } catch (error) {
    console.error("Reverse Geo Lookup Error:", error);
    return null;
  }
};


export const getWeatherData = async (location) => {

  
  const url = `https://api.weatherapi.com/v1/forecast.json?key=748c922b6b124c14ad305356252111&q=${location}&days=4&aqi=no&alerts=no`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    if (data) {
      // Ceil current
      data.current.temp_c = Math.ceil(data.current.temp_c);
      data.current.feelslike_c = Math.ceil(data.current.feelslike_c);
      data.current.humidity = Math.ceil(data.current.humidity);
      data.current.wind_kph = Math.ceil(data.current.wind_kph);

      // Ceil forecast temps
      data.forecast.forecastday = data.forecast.forecastday.map(day => ({
        ...day,
        day: {
          ...day.day,
          maxtemp_c: Math.ceil(day.day.maxtemp_c),
          mintemp_c: Math.ceil(day.day.mintemp_c),
        },
      }));
    }

    console.log("Weather Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export const getWeatherbyCoords = async (pos) => {
       const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const geoRes = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=748c922b6b124c14ad305356252111&q=${lat},${lon}`
        );
        const geoData = await geoRes.json();
        return geoData;
      }

export const getweekday = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'long' };
  return date.toLocaleDateString('en-US', options);
};
