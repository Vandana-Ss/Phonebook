import { useState } from "react"
import Contact from "./components/Contacts"
import { useEffect } from "react"
import personService from "./services/persons"

function App() {

  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      if (Array.isArray(initialPersons)) {
        setPersons(initialPersons)
      } else {
        console.error("Data received is not an array:", initialPersons)
      }
    })
  }, [])

  const handleName = (e) => {
    setName(e.target.value)
  }

  const handleNumber = (e) => {
    setNumber(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newObj = { name, number }

    personService.create(newObj).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setName('')
      setNumber('')
    })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(() => {
          alert("This person is already deleted from phonebook")
          setPersons(persons.filter(p => p.id !== id))
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
          <li key={person.id}>
            <Contact name={person.name} number={person.number} />
            <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
