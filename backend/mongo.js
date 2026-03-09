const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0.oyj2xor.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, {family:4})

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const PhoneBook = mongoose.model('Phonebook', phonebookSchema)

const phnbook = new PhoneBook({
    name: 'Mariam Jo',
    number: '1234567890'
})

phnbook.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})