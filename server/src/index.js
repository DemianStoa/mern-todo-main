const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(cookieParser())
app.use(errorHandler)

app.use('/auth', require('./routes/auth'))
app.use('/list', require('./routes/list'))

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('starting on port 8080');
  app.listen(8080);
})