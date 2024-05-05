const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}..`)
mongoose.connect(url)
  .then(() => {
    console.log('Successfully connected to MongoDB')
  })
  .catch(error => {
    console.error(`Error connecting to MongoDB: ${error.message}`)
  })

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must have three characters or more'],
    required: ['Name required']
  },
  number: {
    type: String,
    validate: {
      validator: phoneNumber => {
        return /^\d{2,3}-\d+$/.test(phoneNumber)
      },
      message: 'Phone number must only contain digits, with 2-3 digits in the beginning, followed by a hyphen (-) and the rest of the digits'
    },
    minLength: [8, 'Number needs to have eight digits or more'],
    required: ['Number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)