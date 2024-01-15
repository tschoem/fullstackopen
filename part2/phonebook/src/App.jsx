import { useState } from 'react'

const Number = ({ person }) =>
  <b>
    {person.name} {person.number}<br />
  </b>

const Persons = ({ persons }) => 
  <>
    {persons.map((person) => <Number key={person.id} person={person} />)}
  </>

const Filter = (props) => 
  <form>
    <div>
      filter shown with <input value={props.filter} onChange={props.onChange} />
    </div>
  </form>

const PersonForm = (props) =>
  <form onSubmit={props.onSubmit}>
    <div>
      name: <input value={props.newName} onChange={props.onNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.onNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilter] = useState('')

  const personsToShow = (filterName === '' )
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length+1
    }

    if (newName !== '') {
      if (persons.findIndex((person) => person.name === newName) >= 0) {
        alert(`${newName} is already added to the phonebook.`)
      } else {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      }
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filter={filterName} onChange={handleFilterChange} />

      <h2>Add a new</h2>
        <PersonForm 
          newName={newName} 
          onNameChange={handleNameChange} 
          newNumber={newNumber} 
          onNumberChange={handleNumberChange} 
          onSubmit={addPerson}
        />

      <h2>Numbers</h2>
        <Persons persons={personsToShow} />
    </div>
  )
}

export default App