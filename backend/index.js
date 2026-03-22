require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()
const morgan = require('morgan')
const PhoneBook = require('./models/person.js')
app.set('json spaces', 2)
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
	PhoneBook.find({}).then(result => res.json(result))
})

app.get('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	PhoneBook.findById(id).then(person => {
		if (person) {
			res.json(person)
		} else {
			res.status(404).end()
		}
	}).catch(error => next(error))
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

app.delete('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	PhoneBook.findByIdAndDelete(id)
		.then(result => {
			res.status(204).end()
		}).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
	return response.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port http://localhost:${PORT}`)
})