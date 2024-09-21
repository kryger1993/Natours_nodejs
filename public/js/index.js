/* eslint-disable */

import 'core-js/stable';
import 'regenerator-runtime/runtime'
import { displayMap } from './leaflet';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import {bookTour} from './stripe';

// ----------------------------------------------
// Dom elements
// ----------------------------------------------
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutLink = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userSettingsForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');

// delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if ( logoutLink ) {
  logoutLink.addEventListener('click', logout);
}

if ( userDataForm ) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form)

    updateSettings(form, 'data');
  });

}

if(userSettingsForm) {

  userSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const currentPwd = document.getElementById('password-current').value;
    const newPwd = document.getElementById('password').value;
    const newPwdConfirm = document.getElementById('password-confirm').value;

    await updateSettings({currentPwd, newPwd, newPwdConfirm}, 'password');

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

    document.querySelector('.btn--save-password').textContent = 'Save password';
  })
}

if(bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const {tourId} = e.target.dataset;
    bookTour(tourId);
  })
}