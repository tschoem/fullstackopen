import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilter] = useState('')
  const [warning, setWarning] = useState({type: null, message: null})

  useEffect(() => {
    phonebookService.getAll()
      .then(data => {
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
  const handleDelete = person => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      phonebookService
        .deleteNumber(person.id)
        .then(data => {
        console.log(data)
        //setPersons(persons.filter(person => person.id !== data.id))
      })
    }
    
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const newPerson = {
      name: newName,
      number: newNumber,
    }

    if (newName !== '') {
      const i = persons.findIndex((person) => person.name === newName)
      if (i >= 0) {
        if (window.confirm(`${newName} is already in the phonebook. Do you want to replace the old number with the new one?`)) {
          phonebookService
            .updateNumber(persons[i].id,newPerson)
            .then((data) => {
              console.log(data)
              setPersons(persons.map(person => person.id !== data.id ? person : data))
              setNewName('')
              setNewNumber('')
              setWarning({type:'update',message:`${newName} was updated with new number`})
              setTimeout(() => {
                setWarning({type:null,message:null})
              }, 5000)
      
            })
        }
      } else {
        phonebookService
          .createEntry(newPerson)
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
        <Notification type={warning.type} message ={warning.message} />
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
        <Persons persons={personsToShow} deleteHandler={handleDelete}/>
    </div>
  )
}

export default App