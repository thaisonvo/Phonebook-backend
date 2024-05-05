const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as an argument')
  process.exit(1)
}

const name = process.argv[3]
const number = process.argv[4]

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@phonebook.gemznbo.mongodb.net/?retryWrites=true&w=majority&appName=Phonebook`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (!name && !number) {
  console.log('Phonebook:')
  Contact.find({})
    .then(contacts => {
      contacts.forEach(contact => console.log(`${contact.name} ${contact.number}`))
      mongoose.connection.close()
    })
} else {
  const contact = new Contact({ name, number })
  contact.save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}
