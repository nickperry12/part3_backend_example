const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
];

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(note => Number(note.id)))
  : 0;

  return maxId;
}

// get home page
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// fetch all notes
app.get('/api/notes', (request, response) => {
  response.json(notes);
});

// fetch a single note
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "Resource does not exist.";
    response.status(404).end();
  }
});

// delete a single note
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
});

// create a new note
app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes.concat(note);
  console.log(note);
  response.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});