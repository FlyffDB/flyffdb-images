const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const fs = require('fs');
const path = require('path');

import { API_ROOT } from '../constants';

const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 2000 });

const getApi = async (apiPath, params) => {
  return await http({
    url: API_ROOT + apiPath,
    method: 'GET',
    responseType: 'json',
    params
  });
};

const downloadIcon = async (type, iconName) => {
  const url = API_ROOT + `image/${type}/${iconName}`;

  const response = await http({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  const iconPath = path.resolve('./images', `${type}/${iconName}`);
  const writer = fs.createWriteStream(iconPath);

  response.data.pipe(writer)


  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

export {
  downloadIcon,
  getApi
}