const mongoose = require('mongoose');
require('dotenv').config();

// sets the schema of the documents being saved to the database
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// The `model` function is used to create a collection of a particular database
// of MongoDB. The parameters are the collection name, and the collection
// schema. Assigning it to `module.exports` defines a Node module
module.exports = mongoose.model('Note', noteSchema);