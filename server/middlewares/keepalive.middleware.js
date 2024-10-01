const axios = require('axios');
require('dotenv').config(); 

/* Nếu keep-alive-serverchạy local thì middleware này cũng không cần thiết,
mục đích của nó là để duy trì 2 chiều với server keep-alive-server khi deploy free trên Render.*/
const keepAliveMiddleware = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.KEEP_ALIVE_URL}`);     
    console.log('From keep-alive-server:', response.data);
  } catch (error) {
    console.error('Error from keep-alive-server:', error.message);
  }
  next();
};

module.exports = keepAliveMiddleware;
