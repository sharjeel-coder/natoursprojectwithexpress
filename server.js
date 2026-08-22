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
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
