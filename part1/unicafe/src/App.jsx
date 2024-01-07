import { useState } from 'react'
//import './App.css'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

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

  const calculateAverage = () => {
    return (good-bad)/(good+neutral+bad)
  }

  const calculatePositivePercent = () => {
    return 100.00*(good)/(good+neutral+bad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleClickGood} text='good' />
      <Button handleClick={handleClickNeutral} text='neutral' />
      <Button handleClick={handleClickBad} text='bad' />
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {good+neutral+bad}</p>
      <p>average {calculateAverage()}</p>
      <p>positive {calculatePositivePercent()}%</p>

    </div>
  )
}

export default App
