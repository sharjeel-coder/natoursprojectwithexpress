const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'hello from the server side',
//     app: 'natours',
//   });
// });

//reading file at the top level and pasre into object using the JSON.parase function
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);
//create api to read the file
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    //if we send multiple responses than we have to use this result
    results: tours.length,
    data: {
      tours,
    },
  });
});
// parametrized url

app.get('/api/v1/tours/:id', (req, res) => {
  //   console.log(req.params);
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
});

app.post('/api/v1/tours', (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // new tour object created
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  //writing into the file using the fs module
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
});
//to update the the tour using the patch method

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

//delete method

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
