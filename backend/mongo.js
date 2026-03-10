const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0.oyj2xor.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const PhoneBook = mongoose.model('Phonebook', phonebookSchema)

const phnbook = new PhoneBook({
    name: name,
    number: number
})


if (process.argv.length === 5) {
    phnbook.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    })
}
else if (process.argv.length > 3 && process.argv.length < 5) {
    console.log('need all details')
    mongoose.connection.close()
}
else {
    PhoneBook.find({}).then(result => {
        result.forEach(phnbook => {
            console.log(phnbook)
        })
        mongoose.connection.close()
    })
}