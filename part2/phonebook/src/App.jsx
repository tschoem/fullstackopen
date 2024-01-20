import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    phonebookService.getAll()
      .then(data => {
        console.log('promise fulfilled')
        setPersons(data)
      })
  }, [])

  const personsToShow = (filterName === '' )
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  const handleFilterChange = (event) => {
    //console.log(event.target.value)
    setNewFilter(event.target.value)
  }
  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const newPerson = {
      name: newName,
      number: newNumber,
    }

    if (newName !== '') {
      if (persons.findIndex((person) => person.name === newName) >= 0) {
        alert(`${newName} is already added to the phonebook.`)
      } else {
        phonebookService
          .create(newPerson)
          .then(data => {
            setPersons(persons.concat(data))
            setNewName('')
            setNewNumber('')
          }) 
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