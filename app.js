const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
//middlewares
app.use(express.json());
app.use(morgan('dev'));

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

//reading file at the top level and pasre into object using the JSON.parase function
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

//Refactor our our code
// GET all tours
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // if we send multiple responses than we have to use this result
    results: tours.length,
    data: {
      tours,
    },
  });
};

// GET one tour
const getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// POST tour
const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;

  // new tour object created
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  // writing into the file using the fs module
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

// PATCH tour
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<UPDATED TOUR HERE>',
    },
  });
};

// DELETE tour
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//users handler functions
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
// // getting alltours
// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);
// //to update the the tour using the patch method

// app.patch('/api/v1/tours/:id', updateTour);

// //delete method

// app.delete('/api/v1/tours/:id', deleteTour);

// instead of doing all this above we can do it like this

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//for users

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
