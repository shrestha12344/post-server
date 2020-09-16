const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const profileRoutes = require('./routes/profile');
const commentRoutes = require('./routes/comment');

const app = express();

const uri = 'mongodb://127.0.0.1:27017/postsdb';

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('mongodb connected');
    }
  },
);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload({ createParentPath: true }));

app.use('/uploads', express.static(path.join(__dirname, '/routes/uploads')));

app.set('port', process.env.PORT || 9000);

app.get('/api', (req, res) => {
  res.send('post-server-api');
});

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/comment', commentRoutes);

app.listen(app.get('port'), () => {
  console.log(`server started at http://localhost:${app.get('port')}`);
});
