require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url, {family: 4}).then(result => {
    console.log('Connected to MongoDB')
}).catch(result => {
    console.log('Failed to connect to MongoDB')
})

const phonebookSchema =new mongoose.Schema({
    //name: String,
    //number: String
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        maxLength: 10,
        required: true
    }
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('PhoneBook', phonebookSchema)