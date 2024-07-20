const express = require('express');
const app = express();
require('dotenv').config();

const Note = require('./models/note');

app.use(express.static('dist'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.set('json spaces', 2);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};


// get home page
app.get('/', (request, response) => {
  response.send('<h1>Notes API</h1>');
});

// fetch all notes
app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes);
    });
});

// fetch a single note
app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;
  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      next(error);
    });
});

// delete a single note
app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;
  Note.findByIdAndDelete(id)
    .then(result => {
      result.status(404).end();
    })
    .catch(error => {
      next(error);
    });
});

// create a new note
app.post('/api/notes', (request, response, next) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  });

  note.save()
    .then(savedNote => {
      response.json(savedNote);
    })
    .catch(error => {
      next(error);
    });
});

// updates a note information
app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  const { content, important } = body;

  Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => {
      next(error);
    });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});