
export const CountryFilter = (props) => 
  <div>
    <form>
      find countries <input value={props.filter} onChange={props.onChange} />
    </form>
  </div>

const CountryName = (props) =>
  <>
    {props.name} <button onClick={props.onShow}>show</button><br />
  </>

export const CountryCard = ({country}) => {
  if (country) {
    const capital = ('capital' in country) 
    ? country.capital[0]
    : 'N/A'

    return (
    <>
        <h1>{country.name.common}</h1>
        <p>
        capital {capital}<br />
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
}

export const CountriesList = (props) => {
  if (props.countries.length > 10) {
    return (<p>Too many matches. Specify another filter</p>)
  } 
  if (props.countries.length > 1) {
    return (
      <p>
        {props.countries.map(country => <CountryName key={country.cca2} name={country.name.common} onShow={() => props.onShow(country.name.common)}/>)}
      </p>
    )
  }
}
