/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  const url = type === 'password' ? `${location.protocol}//${location.host}/api/v1/users/update-password` : `${location.protocol}//${location.host}/api/v1/users/update-me`;
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if(res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} successfully saved!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}