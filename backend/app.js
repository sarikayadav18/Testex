const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/quizApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to the database`);
  })
  .catch((e) => {
    console.error(`Couldn't connect to the database`, e);
  });

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
