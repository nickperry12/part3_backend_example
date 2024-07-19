const mongoose = require('mongoose');
require('dotenv').config();

// url for the database we're working with
// replace with the database we wish to use
// best practice to use a `.env` file to store the URL and password
const url = process.env.MONGODB_URI;


// when set to true, ensures that only the fields specified
// in our schema will be saved to the database
mongoose.set('strictQuery', false);

// connects to the database
mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB!');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB: ', err);
  });

// sets the schema of the documents being saved to the database
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

// The `model` function is used to create a collection of a particular database
// of MongoDB. The parameters are the collection name, and the collection
// schema. Assigning it to `module.exports` defines a Node module
module.exports = mongoose.model('Note', noteSchema);