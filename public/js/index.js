/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // VALUES
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);
