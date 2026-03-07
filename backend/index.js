const express = require("express")
const cors = require("cors")
const app = express()
const morgan = require('morgan')
app.set('json spaces', 2)
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
	{
		"id": "1",
		"name": "Jaany",
		"number": "1234567890"
	},
	{
		"id": "2",
		"name": "Laavi",
		"number": "1234567890"
	}
]

/*app.get('/', (req, res) => {
	res.send('<h1>This is phonebook app</h1>')
})*/

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id
	const item = persons.find(i => i.id === id)
	if (item) {
        res.json(item)
    } else {
        res.status(404).end()
    }
})

const generateId = () => {
	const maxId = persons.length > 0
		? Math.max(...persons.map(n => Number(n.id)))
		: 0
	return String(maxId + 1)
}

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({ "error": "Content missing" })
	}
	if (persons.some(p => p.name === body.name)) {
		return res.status(400).json({ error: "name must be unique" })
	}

	const newObj = {
		id: generateId(),
		name: body.name,
		number: body.number
	}
	persons = persons.concat(newObj)
	res.json(newObj)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	const exists = persons.some(p => p.id === id)
	if (exists) {
		persons = persons.filter(i => i.id !== id)
		res.status(204).end()
	}
	else {
		res.status(404).json({ "message": "Id do not exist" })
	}
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port http://localhost:${PORT}`)
})