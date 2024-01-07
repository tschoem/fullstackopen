import { useState } from 'react'
//import './App.css'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = (props) => {
  const average = (props.positive-props.negative)/(props.positive+props.neutral+props.negative)
  const positivePercent = 100.00*(props.positive)/(props.positive+props.neutral+props.negative)

  return (
    <div>
      <h1>statistics</h1>
      <p>good {props.positive}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.negative}</p>
      <p>all {props.positive+props.neutral+props.negative}</p>
      <p>average {average}</p>
      <p>positive {positivePercent}%</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => {
    setGood(good + 1) 
  }

  const handleClickNeutral = () => {
    setNeutral(neutral + 1) 
  }

  const handleClickBad = () => {
    setBad(bad + 1) 
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleClickGood} text='good' />
      <Button handleClick={handleClickNeutral} text='neutral' />
      <Button handleClick={handleClickBad} text='bad' />
      <Statistics positive={good} neutral={neutral} negative={bad} />
    </div>
  )
}

export default App
