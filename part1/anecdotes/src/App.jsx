import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes,setVotes] = useState([0,0,0,0,0,0,0,0])

  const randomizeSelection = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length)
    //console.log(randomNumber)
    setSelected(randomNumber)
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const mostVoted = () => {

    var max = votes[0];
    var maxIndex = 0;
  
    for (var i = 1; i < votes.length; i++) {
        if (votes[i] > max) {
          maxIndex = i;
          max = votes[i];
        }
      }
  
    return maxIndex;
  }

  return (
    <div>
      <h1>Anectode of the day</h1>
      <p>{anecdotes[selected]}<br />
      has {votes[selected]} votes</p>
      <Button handleClick={handleVote} text="vote" />
      <Button handleClick={randomizeSelection} text="next anecdote" />
      <h1>Anectode with the most votes</h1>
      <p>{anecdotes[mostVoted()]}<br />
      has {votes[mostVoted()]} votes</p>
    </div>
  )
}

export default App