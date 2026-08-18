const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();
//middlewares
app.use(express.json());
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//serving static file to the server
app.use(express.static(`__dirname/public`));

//defining middleware
app.use((req, res, next) => {
  console.log('hello from the middleware😒');
  next();
});
// middleware to manipulate the request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//mounting routes tour tourRouter middleware will work for the provided route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
