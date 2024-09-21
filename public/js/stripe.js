/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51O7LCBCVCvy9jD99huPyRWuX5tRK6ojTUiTl1c1zTI8wQCW5H5o08DGlACij4G4h3FCszCxHLoyZhf7jeG6TsEBw00SxA9Gh4o'
);

export const bookTour = async (tourId) => {
  try {
    //1) get checkout the session from the server
    const session = await axios(
      `${location.protocol}//${location.host}/api/v1/bookings/checkout-session/${tourId}`
      );

      //2) create checkout form + charge cc
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id
      })
    }catch (err) {
      showAlert('error', err);
    }
};
