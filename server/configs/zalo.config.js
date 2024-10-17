const { OpenAPIClient } = require("zmp-openapi-nodejs");

const client = new OpenAPIClient(
  process.env.ZALO_APP_API_KEY,
  process.env.ZALO_APP_ID, // Id của ứng dụng lớn không phải mini app
);

module.exports = client;