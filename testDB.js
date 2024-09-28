

const mongoose = require('mongoose')

const url = "mongodb+srv://sharaf:auc-phonebook-websec@auc-phonebook.jmb8c.mongodb.net/?retryWrites=true&w=majority&appName=auc-phonebook";

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})