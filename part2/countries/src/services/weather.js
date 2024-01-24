import axios from 'axios'
const token = import.meta.env.VITE_WEATHER_TOKEN

const geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const iconUrl = 'https://openweathermap.org/img/wn/'

const getLocation = (city) => {
  const request = axios.get(`${geocodeUrl}?q=${city}&limit=1&appid=${token}`)
  return request.then(response => response.data)
}
 
const getWeather = (lat,long) => {
  const request = axios.post(`${weatherUrl}?lat=${lat}&lon=${long}&units=metric&appid=${token}`)
  return request.then(response => response.data)
}

const getWeatherIcon = (weatherCode) => `${iconUrl}${weatherCode}@2x.png`

export default { getLocation, getWeather, getWeatherIcon }
