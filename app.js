const fs = require('fs');
const express = require('express');
const app = express();

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

app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
