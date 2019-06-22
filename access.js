require('dotenv').config();
const axios = require('axios');

const AUTH_URL = 'https://api.pinterest.com/v1/oauth/token';
const getTokenUrl = (id, token, code) =>
  `${AUTH_URL}?grant_type=authorization_code&client_id=${id}&client_secret=${token}&code=${code}&access_type=offline`;

const getAcessToken = async () => {
  const { PINTEREST_SECRET_TOKEN, PINTEREST_APP_ID } = process.env;
  const tokenUrl = getTokenUrl(PINTEREST_APP_ID, PINTEREST_SECRET_TOKEN, 'xyz1010');
  try {
    const resp = await axios.post(tokenUrl);
    const data = await resp.json();
    return data;
  } catch(e) {
    console.error(e.response.data);
  }
}

const token = getAcessToken();
console.log(token);
