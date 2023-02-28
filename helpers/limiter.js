const rateLimit = require('express-rate-limit')
const configuration = require('../config/config')


module.exports.anonymeLimiter = (max_request = configuration.limiter.anonyme_limiter, window = configuration.limiter.anonyme_window) => {
  return rateLimit({
    windowMs: window * 60 * 1000,
    max: max_request,
    message: `vous avez dépassé la limite de demandes, réessayez dans ${window} minutes`,
    standardHeaders: true,
    legacyHeaders: false,
  })
}

module.exports.authorizedLimiter = (max_request = configuration.limiter.auth_limiter, window = configuration.limiter.auth_window) => {
  return rateLimit({
    windowMs: window * 60 * 1000,
    max: max_request,
    message: `vous avez dépassé la limite de demandes, réessayez dans ${window} minutes`,
    standardHeaders: true,
    legacyHeaders: false,
  })
}

module.exports.retenueLimiter = (max_request = configuration.limiter.retenue_limiter, window = configuration.limiter.retenue_window) => {
  return rateLimit({
    windowMs: window * 60 * 1000,
    max: max_request,
    message: `you have exceeded the limit of requests, try again in  8 hours`,
    standardHeaders: true,
    legacyHeaders: false,
  })
}