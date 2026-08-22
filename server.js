const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
// console.log(process.env);

//getting the database string

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//connecting to localdatabase
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    userCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successfully');
  });

//using mongoose to connect to the cloud atlas and its gonna return a promise
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     userCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => {
//     console.log('DB connection successfully');
//   });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    //if we want to pass an error message with required field then we have to pass the array
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

//now creating model using the schema

const Tour = mongoose.model('Tour', tourSchema);

// creating new tours
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997
});
testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('ERROR', err);
  });
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
