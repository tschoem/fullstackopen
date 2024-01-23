import { useState, useEffect } from 'react'
import countriesService from './services/countries.js' 
import {CountryFilter, CountryCard, CountriesList} from './components/Countries.jsx'

function App() {
  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState(null)
//  const [country, setCountry] = useState(null)

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

  const applyFilter = (event) => {
    event.preventDefault()
    setCountryFilter(event.target.value)
  }

  return (
    <>
      <CountryFilter filter={countryFilter} onChange={applyFilter}/>
      <CountriesList countries={countriesToShow} />
      <CountryCard country={country} />
    </>
  )
}

export default App
