const createLogger = require("../utils/logger.util");

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', '');
};

const loggingMiddleware = (req, res, next) => {
  const { method, url, ip } = req;
  
  // Nếu có proxy, load balancer, lấy IP từ 'x-forwarded-for'
  const clientIp = req.headers['x-forwarded-for'] || ip;

  res.on("finish", () => {
    const responseTime = formatDate(new Date());
    createLogger.info(
      ` Request: [${method}] ${url} | Response: [${res.statusCode}] ${responseTime} | IP: [${clientIp}]`
    );
  });
  next();
};

module.exports = loggingMiddleware;
