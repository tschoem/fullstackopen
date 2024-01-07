import { useState } from 'react'
//import './App.css'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if ((props.positive+props.neutral+props.negative) > 0) {
    const average = (props.positive-props.negative)/(props.positive+props.neutral+props.negative)
    const positivePercent = 100.00*(props.positive)/(props.positive+props.neutral+props.negative)+"%"
  
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value ={props.positive} />
          <StatisticLine text="neutral" value ={props.neutral} />
          <StatisticLine text="bad" value ={props.negative} />
          <StatisticLine text="all" value ={props.positive+props.neutral+props.negative} />
          <StatisticLine text="positive" value ={positivePercent} />
        </tbody>
      </table>
    )
  } 
  
  return (
    <div>
      <p>No feedback given</p>
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
      <h1>statistics</h1>
      <Statistics positive={good} neutral={neutral} negative={bad} />
    </div>
  )
}

export default App
