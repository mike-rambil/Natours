/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

axios.defaults.withCredentials = true;

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
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
