require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()
const morgan = require('morgan')
const mongoose = require("mongoose")
app.set('json spaces', 2)
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const password = process.argv[2]
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const phonebookSchema = new mongoose.Schema({
	name: String,
	number: String
})

const PhoneBook = mongoose.model('Phonebook', phonebookSchema)

morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
	PhoneBook.find({}).then(result => res.json(result))
})

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id
	const item = persons.find(i => i.id === id)
	PhoneBook.findById(req.params.id).then(person => {
		if (person) {
			res.json(person)
		} else {
			res.status(404).end()
		}
	})
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({ "error": "Content missing" })
	}
	const person = new PhoneBook({
		name: body.name,
		number: body.number
	})
	person.save().then(savedPersons => res.json(savedPersons))
})

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	PhoneBook.findByIdAndDelete(id)
	.then(result => {
		res.status(204).end
	})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port http://localhost:${PORT}`)
})