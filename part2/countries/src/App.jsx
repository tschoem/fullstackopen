import { useState, useEffect } from 'react'
import countriesService from './services/countries.js' 
import {CountryFilter, CountryCard, CountriesList} from './components/Countries.jsx'

function App() {
  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState(null)
  const [countryClicked, setCountryClicked] = useState(null)

  useEffect(() => {
    countriesService.getAll()
      .then(data => {
        setCountries(data)
      })
  }, [])

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
    setCountryClicked(null)
  }

  const handleShow = (countryName) => {
    setCountryClicked(countries.find((country) => country.name.common === countryName))
  }

  return (
    <>
      <CountryFilter filter={countryFilter} onChange={applyFilter}/>
      <CountriesList countries={countriesToShow} onShow={handleShow}/>
      <CountryCard country={country} />
    </>
  )
}

export default App
