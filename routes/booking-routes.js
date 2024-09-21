const express = require('express');
const bookingController = require('../controllers/booking-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .get('/:id', bookingController.getBooking)
  .patch('/:id', bookingController.updateBooking)
  .delete('/:id', bookingController.deleteBooking);

module.exports = router;
