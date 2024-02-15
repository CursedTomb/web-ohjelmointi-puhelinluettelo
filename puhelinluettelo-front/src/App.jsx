import axios from 'axios'
import { useState, useEffect } from 'react'
import dbService from './services/persons'

const Header = ({text}) => {
  return(
    <h2>{text}</h2>
  )
}

const Notification = ({message}) => {
  const style = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }
  if(message===null)
    return null
  return(
    <div style={style}>
        {message}
    </div>
  )
}

const Filter = ({filter, changeHandler}) => (
  <div>
    <p>filter shown with: <input value={filter} onChange={changeHandler} /></p>
  </div>
)

const AddPersonForm = ({name, number, nameChange, numberChange, addPerson}) => (
  <>
    <Header text="Add a new" />
      <form>
        <div>
          name: <input value={name} onChange={nameChange}/>
        </div>
        <div>number: <input value={number} onChange={numberChange}/></div>
        <div>
          <button type="submit" onClick={addPerson}>add</button>
        </div>
      </form>
  </>
)

const Persons = ({persons, handleDeletePerson}) => {
  return(
  <>
    <Header text="Numbers"/>
    {persons.map(person => <Person key={person.name} person={person} handleDeletePerson={handleDeletePerson} />)}
  </>
)}

const Person = ({person, handleDeletePerson}) => {
  return(
    <p>
      {person.name} {person.number} <button onClick={() => handleDeletePerson(person.id)}>delete </button>
    </p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [shownPersons, setShownPersons] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(()=>{
    dbService
    .getAll()
    .then(returnedData=>{
      const tmpPersons = returnedData
      setPersons(tmpPersons)
      setShownPersons(tmpPersons)
    })
  },[])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => {
    const filterVal = event.target.value
    setNewFilter(filterVal.length===0 ? '' : filterVal)
    setShownPersons(persons.filter(person => person.name.toLowerCase().includes(filterVal)))
  }

  const handleDeletePerson = (id) => {
    const name = persons.filter(person=> person.id === id)[0].name
    if(!window.confirm(`delete ${name}`)) return
    dbService
    .delPerson(id)
    .then(deletedPerson => {
      const tmpPersons = persons.filter(person => person.id !== id)
      setPersons(tmpPersons)
      setShownPersons(tmpPersons.filter(person => person.name.toLowerCase().includes(newFilter)))
      setErrorMessage(`Deleted ${name}`)
      setTimeout(()=>setErrorMessage(null), 5000)    
      }  
    )
  }

  const addPerson = (event) =>{
    event.preventDefault()
    const usedNames = persons.filter((person) => newName === person.name)
    if(usedNames.length > 0){
      if(!window.confirm(`${newName} is already added to phonebook, update number?`))
        return
      updateProfile(usedNames[0])
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }
    
    dbService
    .addNew(newPerson)
    .then(response => {
      const tmpPersons = persons.concat(response)
      setPersons(tmpPersons)
      setNewName('')
      setNewNumber('')
      setShownPersons(tmpPersons.filter(person => person.name.toLowerCase().includes(newFilter)))
      setErrorMessage(`Added ${response.name}`)
      setTimeout(()=>setErrorMessage(null), 5000)
    })
    
      
  }

  const updateProfile = (person) => {
    const updatedPerson = {...person, number: newNumber}
    dbService
    .updatePerson(updatedPerson)
    .then(response =>{
      const tmpPersons = persons.filter(person => person.id !== response.id)
      .concat(response)
      
      setPersons(tmpPersons)
      setNewName('')
      setNewNumber('')
      setShownPersons(tmpPersons.filter(person => person.name.toLowerCase().includes(newFilter)))
      setErrorMessage(`Updated ${response.name}`)
      setTimeout(()=>setErrorMessage(null), 5000)
    })
  }

  return (
    <div>
      <Header text="Phonebook" />
      <Notification message={errorMessage} />
      <Filter filter={newFilter} changeHandler={handleFilterChange}/>
      <AddPersonForm name={newName} number={newNumber} 
      nameChange={handleNameChange} numberChange={handleNumberChange}
      addPerson={addPerson}/>  
      <Persons persons={shownPersons} handleDeletePerson={handleDeletePerson}/>    
    </div>
  )

}

export default App