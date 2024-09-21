const logger = require("../utils/logger.util");

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', '');
};

const loggingMiddleware = (req, res, next) => {
  const { method, url } = req;
  res.on("finish", () => {
    const responseTime = formatDate(new Date());
    logger.info(
      ` Request: [${method}] ${url} | Response: [${res.statusCode}] ${responseTime}`
    );
  });
  next();
};

module.exports = loggingMiddleware;
