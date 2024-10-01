const axios = require('axios');
require('dotenv').config(); 

const keepAliveMiddleware = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.KEEP_ALIVE_URL}`);     
    console.log('Request received from keep-alive-server:', response.data);
  } catch (error) {
    console.error('Error receiving request from keep-alive-server:', error.message);
  }
  next();
};

module.exports = keepAliveMiddleware;
