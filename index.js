require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));
app.use(cors());
morgan.token("body", (req, res) => JSON.stringify(req.body));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })

    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "the name is missing" });
  } else if (body.number === undefined) {
    return res.status(400).json({ error: "the number is missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get("/api/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
