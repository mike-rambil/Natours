/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

axios.defaults.withCredentials = true;

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login', //--Deployment URL
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log(res);
    // console.log(res.data.token);
    // Save the JWT token as a cookie
    const token = res.data.token;
    document.cookie = `jwt=${token}`;
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout', //--Deployment URL
    });
    console.log('Logout')
    const token = res.data.token;
    document.cookie = `jwt=${token}`;
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
