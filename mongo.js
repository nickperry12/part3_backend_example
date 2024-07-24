const mongoose = require('mongoose');

// ensures that a password is provided via the console
if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

// password provided via console
const password = process.argv[2];

// url for the database we're working with
// replace with the database we wish to use
// best practice to use a `.env` file to store the URL and password
const url =
  `mongodb+srv://nickperry604:${password}@fullstackcourse.gdpv3p1.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=FullstackCourse`;


// when set to true, ensures that only the fields specified
// in our schema will be saved to the database
mongoose.set('strictQuery', false);

// connects to the database
mongoose.connect(url);

// sets the schema of the documents being saved to the database
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// The `model` function is used to create a collection of a particular database
// of MongoDB. The parameters are the collection name, and the collection
// schema
const Note = mongoose.model('Note', noteSchema);

// creates a new Note document to be saved to the DB
const note = new Note({
  content: 'HTML is easy',
  important: true
});

// Saves the document to the database
note.save().then(result => {
  console.log('note saved!', result);
  // mongoose.connection.close();
});

// Retrieves the entire list of notes
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note);
  });
  mongoose.connection.close();
});