const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const UsersRoute = require('./router/usersRout')
// mongoose.connect('mongodb://127.0.0.1:27017/online_auction', { useNewUrlParser: true, useUnifiedTopology: true });

const uri = "mongodb+srv://sbraviprakasha:HqfyL5v0tG7O8dyD@cluster0.tktppdm.mongodb.net/online_auction?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log('Database connection established!');
});

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/auction_users', UsersRoute)