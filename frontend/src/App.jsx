import { useState } from "react"
import Contact from "./components/Contacts"
import axios from "axios"
import { useEffect } from "react"

function App() {

  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')

  const handleName = (e) => {
    e.preventDefault()
    setName(e.target.value)
  }

  const handleNumber = (e) => {
    e.preventDefault()
    setNumber(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newObj = {
      name: name,
      number: number
    }
    axios.post('http://localhost:3001/api/persons/', newObj)
      .then(response => {
        console.log('Added', response.data)
        setPersons(persons.concat(response.data))
        setName('')
        setNumber('')
      })
  }

  useEffect(() => {
    axios.get('http://localhost:3001/api/persons/')
      .then(response => setPersons(response.data))
  }, [])

  const handleDelete = (id, name) => {
    if(window.confirm(`Delete ${name}`)) {
      axios.delete(`http://localhost:3001/api/persons/${id}`)
      .then( () =>{
        setPersons(persons.filter(i => i.id !== id))
      })
      .catch(error => {
        alert("This person is already deleted from phonebook")
        setPersons(persons.filter(i => i.id !== id))
      })
    }
  }

  console.log("App started")
  return (
    <>
      <h1>Add Contact</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label> <input value={name} onChange={handleName} type="text" /> <br />
        <label>Number</label> <input value={number} onChange={handleNumber} type="text" /><br />
        <button type="submit">submit</button>
      </form>
      <h3>Phonebook</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {persons.map(person => (
          <li key={person.name}>
            <Contact name={person.name} number={person.number} />
            <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
            <hr/>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
