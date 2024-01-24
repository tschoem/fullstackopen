import weatherService from '../services/weather.js'

const WeatherCard = (props) => {
    if (props.weather && props.country && ('capital') in props.country)
    return (
        <>
        <h2>Weather in {props.country.capital[0]}</h2>
        <p>temperature {props.weather.main.temp}</p>
        <img src={weatherService.getWeatherIcon(props.weather.weather[0].icon)} />
        <p>wind {props.weather.wind.speed} m/s</p>
        </>
    )
}

export default WeatherCard