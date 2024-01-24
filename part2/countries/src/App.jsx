import { useState, useEffect } from 'react'
import countriesService from './services/countries.js' 
import {CountryFilter, CountryCard, CountriesList} from './components/Countries.jsx'
import weatherService from './services/weather.js'
import WeatherCard from './components/Weather.jsx'

function App() {
  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState(null)
  const [countryClicked, setCountryClicked] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    countriesService.getAll()
      .then(data => {
        setCountries(data)
      })
  }, [])

  useEffect(() => {
    if (countryClicked && ('capital' in countryClicked)) {
      weatherService.getLocation(countryClicked.capital[0])
        .then(data => {
          weatherService.getWeather(data[0].lat,data[0].lon)
            .then(weatherData => {
              setWeatherData(weatherData)
            })
        })
      }
  },[countryClicked])

  // do not render anything if the countries list is null
  if (!countries) { 
    return null 
  }

  var countriesToShow = (countryFilter.length === 0) 
  ? countries
  : countries.filter(country => country.name.common.toLowerCase().includes(countryFilter.toLowerCase()))

  var country = (countriesToShow.length === 1) 
  ? countriesToShow[0]
  : null

  if (countryClicked) country = countryClicked

  const applyFilter = (event) => {
    event.preventDefault()
    setCountryFilter(event.target.value)
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
    if (filteredCountries.length === 1) {
      setCountryClicked(filteredCountries[0])
    } else {
      setCountryClicked(null)
    }
    setWeatherData(null)
  }

  const handleShow = (countryName) => {
    setCountryClicked(countries.find((country) => country.name.common === countryName))
  }

  return (
    <>
      <CountryFilter filter={countryFilter} onChange={applyFilter}/>
      <CountriesList countries={countriesToShow} onShow={handleShow}/>
      <CountryCard country={country} />
      <WeatherCard weather={weatherData} country={country}/>
    </>
  )
}

export default App
