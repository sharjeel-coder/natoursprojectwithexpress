const express = require('express');
const tourController = require('./../controllers/tourController');
const fs = require('fs');

const router = express.Router();
//params middleware
// router.param('id', (req, res, next, val) => {
//   next();
// });instead of above this all we can do this as below we created middleware parmams funtion in the tourcontroller and exported it.
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
