const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from the database
  const tours = await Tour.find();
  // Build template

  // Render the template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // Get tour data from the database along with guides and reviews
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // Build template

  // Render the template

  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
});
