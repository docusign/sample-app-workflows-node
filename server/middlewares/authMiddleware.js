function authMiddleware(req, res, next) {
  const isTokenValid = req.dsAuth.checkToken(req);
  if (!isTokenValid) {
    req.logger.info(`[${req.originalUrl}] Access token expired or doesn't exist, returns 401`);
    req.dsAuth.internalLogout(req, res, next);
    res.status(401).send();
    return;
  }
  next();
}

module.exports = authMiddleware;
