/* eslint-disable */
import '../../node_modules/@babel/polyfill';

import { login } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');

if (loginForm)
  loginForm('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    // VALUES
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
console.log('hello from parcel');
