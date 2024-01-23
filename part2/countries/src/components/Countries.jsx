
export const CountryFilter = (props) => 
  <div>
    <form>
      find countries <input value={props.filter} onChange={props.onChange} />
    </form>
  </div>

const CountryName = (props) =>
  <>
    {props.name} <br />
  </>

export const CountryCard = ({country}) => {
  if (country) return (
  <>
    <h1>{country.name.common}</h1>
    <p>
      capital {country.capital[0]}<br />
      area {country.area}
    </p>
    <div><b>Languages:</b>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
    </div>
    <img width='400' height='250' src={country.flags.png} />
  </>
  )
}

export const CountriesList = ({countries}) => {
  if (countries.length > 10) {
    return (<p>Too many matches. Specify another filter</p>)
  } 
  if (countries.length > 1) {
    return (
      <p>
        {countries.map(country => <CountryName key={country.cca2} name={country.name.common} />)}
      </p>
    )
  }
}